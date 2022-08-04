
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroInventoryItem.json');

export class HeroInventoryItem{
    itemHandle: number;
    heroName: string;
    quantity: number;
    isReload: boolean;

    constructor(){
        this.itemHandle = 0;
    }

    static initialize(sequelize){
        sequelize.define('heroInventory', {
            itemHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isReload: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: false
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as HeroInventoryItem[];

            for(const item of items){
                if(await sequelize.models.heroInventory.count({where: {itemHandle: item.itemHandle, heroName: item.heroName}}) === 0){
                    await sequelize.models.heroInventory.create(item as any);
                } else await sequelize.models.heroInventory.update(item, {where: {itemHandle: item.itemHandle, heroName: item.heroName}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = HeroInventoryItem;