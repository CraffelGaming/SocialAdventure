
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./heroInventoryItem.json');
import { AdventureItem } from './adventureItem';

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
                defaultValue: 1
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle'});
    }

    static async transferAdventureToInventory({ sequelize, adventure }: { sequelize: Sequelize; adventure: Model<AdventureItem> }){
        const inventory = await sequelize.models.heroInventory.findOne({where: {itemHandle: adventure.getDataValue("itemHandle"), heroName:  adventure.getDataValue("heroName")}}) as Model<HeroInventoryItem>;

        if(inventory){
            await sequelize.models.heroInventory.increment('quantity', { by: 1, where: {itemHandle: adventure.getDataValue("itemHandle"), heroName:  adventure.getDataValue("heroName")}});
        } else {
            await sequelize.models.heroInventory.create({ heroName: adventure.getDataValue("heroName"),
                                                          itemHandle: adventure.getDataValue("itemHandle")});
        }
        adventure.destroy();
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