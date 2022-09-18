import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./healingPotionItem.json');

@Table({ tableName: "healingPotion", modelName: "healingPotion"})
export class HealingPotionItem extends Model<HealingPotionItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;
    @Column
    description: string;
    @Column
    percent: number = 0;
    @Column
    gold: number = 0;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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
            percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HealingPotionItem[];

            for(const item of items){
                if(await sequelize.models.healingPotion.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.healingPotion.create(item as any);
                } else await sequelize.models.healingPotion.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: HealingPotionItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.healingPotion.findByPk(element.handle);
                if(item){
                    await sequelize.models.healingPotion.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.value != null && element.value.length > 0 &&element.description != null && element.description.length > 0 && element.gold != null && element.gold > 0 && element.percent != null && element.percent > 0){
                    await sequelize.models.healingPotion.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = HealingPotionItem;

