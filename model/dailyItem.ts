import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./dailyItem.json');

@Table({ tableName: "daily", modelName: "daily"})
export class DailyItem extends Model<DailyItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;
    @Column
    description: string;
    @Column
    goldMin: number = 100;
    @Column
    goldMax: number = 500;
    @Column
    experienceMin: number = 100;
    @Column
    experienceMax: number = 500;

    gold: number = 0;
    experience: number = 0;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('daily', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goldMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as DailyItem[];

            for(const item of items){
                if(await sequelize.models.daily.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.daily.create(item as any);
                } else await sequelize.models.daily.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: DailyItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.daily.findByPk(element.handle);
                if(item){
                    await sequelize.models.daily.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.value != null && element.value.length > 0 && element.description != null && element.description.length > 0 && element.goldMin != null && element.goldMin > 0&& element.goldMax != null && element.goldMax > 0){
                    await sequelize.models.daily.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = DailyItem;

