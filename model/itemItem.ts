
import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { ValidationItem } from './validationItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'itemItem.json')).toString());
@Table({ tableName: "item", modelName: "item" })
export class ItemItem extends Model<ItemItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    value: string;
    @Column
    gold: number = 50;
    @Column
    type: number = 0;
    @Column
    categoryHandle: number = 1;

    constructor() {
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }) {
        sequelize.define('item', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 50
            },
            categoryHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            type: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }

    static setAssociation({ sequelize, isGlobal }: { sequelize: Sequelize, isGlobal: boolean; }) {
        if (!isGlobal) {
            sequelize.models.item.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'itemHandle' });
            sequelize.models.item.hasOne(sequelize.models.adventure, { as: 'adventure', foreignKey: 'itemHandle' });
        }
        sequelize.models.item.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle' });
    }

    static async updateTable({ sequelize, isGlobal }: { sequelize: Sequelize, isGlobal: boolean; }): Promise<void> {
        let handle = 1;
        try {
            const items = JSON.parse(JSON.stringify(json)) as ItemItem[];

            for (const item of items) {
                if (await sequelize.models.item.count({ where: { handle } }) === 0) {
                    if (isGlobal === true && item.categoryHandle > 1) {
                        await sequelize.models.item.create(item as any);
                    }
                    else if (isGlobal === false && item.categoryHandle <= 1) {
                        await sequelize.models.item.create(item as any);
                    }
                }

                else {
                    if (isGlobal === true && item.categoryHandle > 1) {
                        await sequelize.models.item.update(item, { where: { handle } });
                    }
                    // else if(isGlobal === false && item.categoryHandle <= 1){
                    // await sequelize.models.item.update(item, {where: {handle}});
                    // }
                }

                handle++;
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }

    static async put({ sequelize, globalSequelize, element }: { sequelize: Sequelize, globalSequelize: Sequelize, element: ItemItem }): Promise<number> {
        try {
            const item = await sequelize.models.item.findByPk(element.handle);
            if (await ItemItem.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                if (item) {
                    await sequelize.models.item.update(element, { where: { handle: element.handle } });
                    return 201;
                }
                else {
                    await sequelize.models.item.create(element as any);
                    return 201;
                }
            } else return 406;
        } catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }

    static async validate({ sequelize, globalSequelize, element, isUpdate }: { sequelize: Sequelize, globalSequelize: Sequelize, element: ItemItem, isUpdate: boolean }): Promise<boolean> {
        let isValid = true;

        const validations = await globalSequelize.models.validation.findAll({ where: { page: 'item' } }) as Model<ValidationItem>[];

        if (!(!element.gold || element.gold && element.gold >= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('min') && element.gold <= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('max'))) isValid = false;

        if (!isUpdate) {
            if (!(element.value != null && element.value.length > 0)) {
                isValid = false;
            }
        }

        return isValid;
    }
}