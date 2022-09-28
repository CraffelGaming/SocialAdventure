import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./placeholderItem.json');

@Table({ tableName: "placeholder", modelName: "placeholder"})
export class PlaceholderItem {
    @PrimaryKey
    @Column
    handle: string;
    @Column
    translation: string;
    @Column
    isCounter : boolean = false;
    @Column
    isShoutout : boolean = false;
    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('placeholder', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isShoutout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as PlaceholderItem[];

            for(const item of items){
                if(await sequelize.models.placeholder.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.placeholder.create(item as any);
                } else await sequelize.models.placeholder.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}
module.exports.default = PlaceholderItem;

