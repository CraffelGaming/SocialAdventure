import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./adventureItem.json');
import { ItemItem } from './itemItem';
import { HeroItem } from './heroItem';

@Table({ tableName: "adventure", modelName: "adventure"})
export class AdventureItem{
    @PrimaryKey
    @Column
    itemHandle: number;
    @PrimaryKey
    @Column
    heroName: string;
    hero: HeroItem;
    item: ItemItem;

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('adventure', {
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
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.adventure.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName'});
        sequelize.models.adventure.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle'});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as AdventureItem[];

            for(const item of items){
                if(await sequelize.models.adventure.count({where: {itemHandle: item.itemHandle, heroName: item.heroName}}) === 0){
                    await sequelize.models.adventure.create(item as any);
                }
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: AdventureItem }): Promise<number>{
        try{
            if(element.heroName != null && element.itemHandle > 0){
                const item = await sequelize.models.adventure.findOne({ where: { heroName: element.heroName, itemHandle: element.itemHandle}});
                if(!item){
                    await sequelize.models.adventure.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}
module.exports.default = AdventureItem;

