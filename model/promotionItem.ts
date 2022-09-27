import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./promotionItem.json');
import { HeroItem } from './heroItem';
import { HeroWalletItem } from './heroWalletItem';
import { ItemItem } from './itemItem';
import { HeroInventoryItem } from './heroInventoryItem';

@Table({ tableName: "promotion", modelName: "promotion"})
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
    item: number = 0;
    @Column
    validFrom: Date = new Date(2020, 1, 1);
    @Column
    validTo: Date;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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
                allowNull: false,
                defaultValue: 0
            },
            validFrom: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            validTo: {
                type: DataTypes.DATE,
                allowNull: true
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as PromotionItem[];

            for(const item of items){
                if(await sequelize.models.promotion.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.promotion.create(item as any);
                } else await sequelize.models.promotion.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: PromotionItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle.length > 0){
                const item = await sequelize.models.promotion.findByPk(element.handle);
                if(item){
                    await sequelize.models.promotion.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.gold != null && element.gold > 0 ||
                   element.diamond != null && element.diamond > 0 ||
                   element.experience != null && element.experience > 0 ||
                   element.item != null && element.item > 0){
                    await sequelize.models.promotion.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async redeem({ sequelize, promotion, heroName }: { sequelize: Sequelize, promotion: PromotionItem, heroName: string }): Promise<number>{
        try{
            const hero = await sequelize.models.hero.findByPk(heroName) as Model<HeroItem>;
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName) as Model<HeroWalletItem>;
            const item = await sequelize.models.item.findByPk(promotion.item) as Model<ItemItem>;

            if(promotion){
                if(promotion.gold > 0){
                    await heroWallet.increment('gold', { by: promotion.gold});
                }

                if(promotion.diamond > 0){
                    await heroWallet.increment('diamond', { by: promotion.diamond});
                }

                if(promotion.experience > 0){
                    await hero.increment('experience', { by: promotion.experience});
                    hero.setDataValue("experience", hero.getDataValue("experience") + promotion.experience);
                    HeroItem.calculateHero({sequelize: sequelize, element: hero.get()});
                }

                if(promotion.item > 0){
                    if(item){
                        HeroInventoryItem.transferItemToInventory({sequelize: sequelize, item: item, heroName: heroName });
                    }
                }
                return 200;
            } else return 404;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = PromotionItem;

