
import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ItemItem } from './itemItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'itemCategoryItem.json')).toString());
@Table({ tableName: "itemCategory", modelName: "itemCategory"})
export class ItemCategoryItem extends Model<ItemCategoryItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;

    items: ItemItem[];

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
        sequelize.models.itemCategory.hasMany(sequelize.models.location, { as: 'locations', foreignKey: 'categoryHandle'});
        sequelize.models.itemCategory.hasMany(sequelize.models.raidBoss, { as: 'raidBosses', foreignKey: 'categoryHandle'});
    }

    static async updateTable({ sequelize, isGlobal }: { sequelize: Sequelize, isGlobal: boolean; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as ItemCategoryItem[];

            for(const item of items){
                if(await sequelize.models.itemCategory.count({where: {handle: item.handle}}) === 0){
                    if(isGlobal === true && item.handle > 1){
                        await sequelize.models.itemCategory.create(item as any);
                    } else if(isGlobal === false && item.handle <= 1){
                        await sequelize.models.itemCategory.create(item as any);
                    }
                } // else await sequelize.models.itemCategory.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, element }: { sequelize: Sequelize, element: ItemItem }): Promise<number>{
        try{
            if(element.handle != null && element.handle > 0){
                const item = await sequelize.models.itemCategory.findByPk(element.handle);
                if(item){
                    await sequelize.models.itemCategory.update(element, {where: {handle: element.handle}});
                    return 201;
                }
            } else {
                if(element.value != null && element.value.length > 0){
                    await sequelize.models.itemCategory.create(element as any);
                    return 201;
                } else return 406;
            }
        } catch(ex){
            global.worker.log.error(ex);
            return 500;
        }
    }
}