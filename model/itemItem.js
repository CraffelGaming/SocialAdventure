var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ItemItem_1;
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'itemItem.json')).toString());
let ItemItem = ItemItem_1 = class ItemItem extends Model {
    constructor() {
        super();
        this.gold = 50;
        this.type = 0;
        this.categoryHandle = 1;
    }
    static createTable({ sequelize }) {
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
    static setAssociation({ sequelize, isGlobal }) {
        if (!isGlobal) {
            sequelize.models.item.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'itemHandle' });
            sequelize.models.item.hasOne(sequelize.models.adventure, { as: 'adventure', foreignKey: 'itemHandle' });
        }
        sequelize.models.item.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle' });
    }
    static async updateTable({ sequelize, isGlobal }) {
        let handle = 1;
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.item.count({ where: { handle } }) === 0) {
                    if (isGlobal === true && item.categoryHandle > 1) {
                        await sequelize.models.item.create(item);
                    }
                    else if (isGlobal === false && item.categoryHandle <= 1) {
                        await sequelize.models.item.create(item);
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
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, globalSequelize, element }) {
        try {
            const item = await sequelize.models.item.findByPk(element.handle);
            if (await ItemItem_1.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                if (item) {
                    await sequelize.models.item.update(element, { where: { handle: element.handle } });
                    return 201;
                }
                else {
                    await sequelize.models.item.create(element);
                    return 201;
                }
            }
            else
                return 406;
        }
        catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
    static async validate({ sequelize, globalSequelize, element, isUpdate }) {
        let isValid = true;
        const validations = await globalSequelize.models.validation.findAll({ where: { page: 'item' } });
        if (!(!element.gold || element.gold && element.gold >= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('min') && element.gold <= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('max')))
            isValid = false;
        if (!isUpdate) {
            if (!(element.value != null && element.value.length > 0)) {
                isValid = false;
            }
        }
        return isValid;
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], ItemItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], ItemItem.prototype, "value", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], ItemItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], ItemItem.prototype, "type", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], ItemItem.prototype, "categoryHandle", void 0);
ItemItem = ItemItem_1 = __decorate([
    Table({ tableName: "item", modelName: "item" }),
    __metadata("design:paramtypes", [])
], ItemItem);
export { ItemItem };
//# sourceMappingURL=itemItem.js.map