var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'itemCategoryItem.json')).toString());
let ItemCategoryItem = class ItemCategoryItem extends Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
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
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'items', foreignKey: 'categoryHandle' });
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'locations', foreignKey: 'categoryHandle' });
    }
    static async updateTable({ sequelize, isGlobal }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.itemCategory.count({ where: { handle: item.handle } }) === 0) {
                    if (isGlobal === true && item.handle > 1) {
                        await sequelize.models.itemCategory.create(item);
                    }
                    else if (isGlobal === false && item.handle <= 1) {
                        await sequelize.models.itemCategory.create(item);
                    }
                } // else await sequelize.models.itemCategory.update(item, {where: {handle: item.handle}});
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.itemCategory.findByPk(element.handle);
                if (item) {
                    await sequelize.models.itemCategory.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.value != null && element.value.length > 0) {
                    await sequelize.models.itemCategory.create(element);
                    return 201;
                }
                else
                    return 406;
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], ItemCategoryItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], ItemCategoryItem.prototype, "value", void 0);
ItemCategoryItem = __decorate([
    Table({ tableName: "itemCategory", modelName: "itemCategory" }),
    __metadata("design:paramtypes", [])
], ItemCategoryItem);
export { ItemCategoryItem };
//# sourceMappingURL=itemCategoryItem.js.map