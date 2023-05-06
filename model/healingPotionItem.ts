import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroItem } from './heroItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'healingPotionItem.json')).toString());
@Table({ tableName: "healingPotion", modelName: "healingPotion" })
export class HealingPotionItem extends Model<HealingPotionItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;
    @Column
    description: string;
    @Column
    image: string;
    @Column
    percent: number = 0;
    @Column
    gold: number = 0;
    @Column
    isRevive: boolean = false;

    constructor() {
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('healingPotion', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isRevive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void> {
        try {
            const items = JSON.parse(JSON.stringify(json)) as HealingPotionItem[];

            for (const item of items) {
                if (await sequelize.models.healingPotion.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.healingPotion.create(item as any);
                } else await sequelize.models.healingPotion.update(item, { where: { handle: item.handle } });
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HealingPotionItem }): Promise<number> {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.healingPotion.findByPk(element.handle);
                if (item) {
                    await sequelize.models.healingPotion.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            } else {
                if (element.value != null && element.value.length > 0 && element.description != null && element.description.length > 0 && element.gold != null && element.gold > 0 && element.percent != null && element.percent > 0) {
                    await sequelize.models.healingPotion.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async heal({ sequelize, healingPotionHandle, heroName, bonus }: { sequelize: Sequelize, healingPotionHandle: string, heroName: string, bonus: boolean }): Promise<number> {
        try {
            const potion = await sequelize.models.healingPotion.findByPk(healingPotionHandle) as Model<HealingPotionItem>;
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;

            if (hero.getDataValue("hitpoints") < 0) {
                hero.setDataValue("hitpoints", 0);
            }

            if (potion && hero && heroWallet) {
                if (heroWallet.getDataValue("gold") >= potion.getDataValue("gold") && !bonus || heroWallet.getDataValue("gold") >= potion.getDataValue("gold") / 2 && bonus) {
                    if (hero.getDataValue("hitpoints") === 0 && potion.getDataValue("isRevive") === true || hero.getDataValue("hitpoints") > 0 && potion.getDataValue("isRevive") === false) {
                        if (hero.getDataValue("hitpoints") < hero.getDataValue("hitpointsMax")) {
                            hero.setDataValue("hitpoints", Math.round(hero.getDataValue("hitpoints") + (hero.getDataValue("hitpointsMax") / 100 * potion.getDataValue("percent"))));

                            if (hero.getDataValue("hitpoints") > hero.getDataValue("hitpointsMax"))
                                hero.setDataValue("hitpoints", hero.getDataValue("hitpointsMax"));

                            if (bonus === true) {
                                await heroWallet.decrement('gold', { by: Math.round(potion.getDataValue("gold") / 2) });
                            } else {
                                await heroWallet.decrement('gold', { by: potion.getDataValue("gold") });
                            }

                            await hero.save({ fields: ['hitpoints'] });
                            return 200;
                        } else return 204;
                    } else return 406
                } else return 402;
            } else return 404;
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
}