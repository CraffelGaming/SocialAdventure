
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroInventoryItem.json');

@Table({ tableName: "heroInventory", modelName: "heroInventory"})
export class HeroInventoryItem extends Model<HeroInventoryItem>{
    @PrimaryKey
    @Column
    itemHandle: number;
    @PrimaryKey
    @Column
    heroName: string;
    @Column
    quantity: number = 0;
    @Column
    isReload: boolean = false;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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