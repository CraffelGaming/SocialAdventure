import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./menuItem.json');

export class MenuItem{
    endpoint: string;
    name: string;
    order: number;
    authenticationRequired: boolean;

    constructor(endpoint? : string, name? : string, order? : number){
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
        this.authenticationRequired = false;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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
            },
            authenticationRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.menu.hasMany(sequelize.models.menu, {as: 'childs', foreignKey: 'parentEndpoint'} );
        sequelize.models.menu.belongsTo(sequelize.models.menu, { as: 'parent', foreignKey: 'parentEndpoint'});
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