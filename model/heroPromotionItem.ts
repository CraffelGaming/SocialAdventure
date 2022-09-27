import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./promotionItem.json');

@Table({ tableName: "heroPromotion", modelName: "heroPromotion"})
export class HeroPromotionItem{
    @PrimaryKey
    @Column
    promotionHandle: string;
    @PrimaryKey
    @Column
    heroName: string;

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('heroPromotion', {
            promotionHandle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroPromotion.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.heroPromotion.belongsTo(sequelize.models.promotion, { as: 'promotion', foreignKey: 'promotionHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HeroPromotionItem[];

            for(const item of items){
                if(await sequelize.models.heroPromotion.count({where: {heroName: item.heroName, promotionHandle: item.promotionHandle}}) === 0){
                    await sequelize.models.heroPromotion.create(item as any);
                } else await sequelize.models.heroPromotion.update(item, {where: {heroName: item.heroName, promotionHandle: item.promotionHandle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HeroPromotionItem }): Promise<number>{
        try{
            const item = await sequelize.models.heroPromotion.findOne({where: {heroName: element.heroName, promotionHandle: element.promotionHandle}});
            if(!item){
                await sequelize.models.heroPromotion.create(element as any);
                return 201;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = HeroPromotionItem;

