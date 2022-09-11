
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./itemCategoryItem.json');
@Table({ tableName: "itemCategory", modelName: "itemCategory"})
export class ItemCategoryItem extends Model<ItemCategoryItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('itemCategory', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            }
          }, {freezeTableName: true});
    }

    static setAssociation({ sequelize }: { sequelize: Sequelize; }){
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'items', foreignKey: 'categoryHandle'});
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'locations', foreignKey: 'categoryHandle'});
    }

    static async updateTable({ sequelize, isGlobal }: { sequelize: Sequelize, isGlobal: boolean; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as ItemCategoryItem[];

            for(const item of items){
                if(await sequelize.models.itemCategory.count({where: {handle: item.handle}}) === 0){
                    if(isGlobal === true && item.handle !== 1){
                        await sequelize.models.itemCategory.create(item as any);
                    } else if(isGlobal === false && item.handle === 1){
                        await sequelize.models.itemCategory.create(item as any);
                    }
                } else await sequelize.models.itemCategory.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = ItemCategoryItem;