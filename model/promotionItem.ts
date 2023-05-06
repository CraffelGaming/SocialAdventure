import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroItem } from './heroItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
import { ItemItem } from './itemItem.js';
import { HeroInventoryItem } from './heroInventoryItem.js';
import { HeroPromotionItem } from './heroPromotionItem.js';
import { ValidationItem } from './validationItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'promotionItem.json')).toString());
@Table({ tableName: "promotion", modelName: "promotion" })
export class PromotionItem extends Model<PromotionItem>{
    @PrimaryKey
    @Column
    handle: string;
    @Column
    gold: number = 0;
    @Column
    diamond: number = 0;
    @Column
    experience: number = 0;
    @Column
    item: number;
    @Column
    validFrom: Date = new Date(2020, 1, 1);
    @Column
    validTo: Date = new Date(2099, 12, 31);
    @Column
    isMaster: boolean = false;

    constructor() {
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('promotion', {
            handle: {
                type: DataTypes.STRING(),
                allowNull: false,
                primaryKey: true
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            diamond: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            item: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            validFrom: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            validTo: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.models.promotion.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'promotionHandle' });
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void> {
        try {
            const items = JSON.parse(JSON.stringify(json)) as PromotionItem[];

            for (const item of items) {
                if (await sequelize.models.promotion.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.promotion.create(item as any);
                } // else await sequelize.models.promotion.update(item, {where: {handle: item.handle}});
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, globalSequelize, element }: { sequelize: Sequelize, globalSequelize: Sequelize, element: PromotionItem }): Promise<number> {
        try {
            const item = await sequelize.models.promotion.findByPk(element.handle);
            if (await PromotionItem.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                if (item) {
                    await sequelize.models.promotion.update(element, { where: { handle: element.handle } });
                    return 201;
                } else {
                    await sequelize.models.promotion.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async validate({ sequelize, globalSequelize, element, isUpdate }: { sequelize: Sequelize, globalSequelize: Sequelize, element: PromotionItem, isUpdate: boolean }): Promise<boolean> {
        let isValid = true;

        const validations = await globalSequelize.models.validation.findAll({ where: { page: 'promotion' } }) as Model<ValidationItem>[];

        if (!(!element.gold || element.gold && element.gold >= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('min') && element.gold <= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('max'))) isValid = false;
        if (!(!element.diamond || element.diamond && element.diamond >= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('min') && element.diamond <= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('max'))) isValid = false;
        if (!(!element.experience || element.experience && element.experience >= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('min') && element.experience <= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('max'))) isValid = false;
        if (!(!element.item || element.item && await sequelize.models.item.findByPk(element.item))) isValid = false;

        return isValid;
    }

    static async redeem({ sequelize, promotion, heroName }: { sequelize: Sequelize, promotion: PromotionItem, heroName: string }): Promise<number> {
        try {
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;
            const item = await sequelize.models.item.findByPk(promotion.item) as Model<ItemItem>;
            const heroPromotion = await sequelize.models.heroPromotion.findOne({ where: { promotionHandle: promotion.handle, heroName } }) as Model<HeroPromotionItem>;

            if (promotion.validFrom.getTime() <= Date.now() && promotion.validTo.getTime() >= Date.now()) {
                if (!heroPromotion) {
                    if (promotion.gold > 0) {
                        await heroWallet.increment('gold', { by: promotion.gold });
                    }

                    if (promotion.diamond > 0) {
                        await heroWallet.increment('diamond', { by: promotion.diamond });
                    }

                    if (promotion.experience > 0) {
                        hero.setDataValue("experience", hero.getDataValue("experience") + promotion.experience);
                    }

                    if (promotion.item > 0) {
                        if (item) {
                            HeroInventoryItem.transferItemToInventory({ sequelize, item, heroName });
                        }
                    }

                    if (promotion.handle === 'NewStart') {
                        hero.setDataValue("isFounder", true);
                    }
                    hero.save();
                    HeroItem.calculateHero({ sequelize, element: hero.get() });

                    const element = new HeroPromotionItem();
                    element.heroName = heroName;
                    element.promotionHandle = promotion.handle;
                    HeroPromotionItem.put({ sequelize, element });

                    return 200;
                }
                return 204;
            } else return 201;
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}