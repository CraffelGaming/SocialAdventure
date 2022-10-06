import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./validationItem.json');

@Table({ tableName: "validation", modelName: "validation"})
export class ValidationItem extends Model<ValidationItem>{
    @PrimaryKey
    @Column
    page: string;
    @PrimaryKey
    @Column
    handle: string;
    @Column
    min: number = 0;
    @Column
    max: number = 100;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('validation', {
            page: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            min: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            max: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as ValidationItem[];

            for(const item of items){
                if(await sequelize.models.validation.count({where: {handle: item.handle, page: item.page}}) === 0){
                    await sequelize.models.validation.create(item as any);
                } else await sequelize.models.validation.update(item, {where: {handle: item.handle, page: item.page}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}
module.exports.default = ValidationItem;

