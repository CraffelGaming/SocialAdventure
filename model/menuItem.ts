import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./menuItem.json');

export class MenuItem{
    endpoint: string;
    name: string;
    order: number;

    constructor(endpoint? : string, name? : string, order? : number){
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
    }

    static initialize(sequelize){
        sequelize.define('menu', {
            endpoint: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as MenuItem[];

            for(const item of items){
                if(await sequelize.models.menu.count({where: {endpoint: item.endpoint}}) === 0){
                    await sequelize.models.menu.create(item as any);
                } else await sequelize.models.menu.update(item, {where: {endpoint: item.endpoint}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = MenuItem;