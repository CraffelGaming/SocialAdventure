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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'validationItem.json')).toString());
let ValidationItem = class ValidationItem extends Model {
    constructor() {
        super();
        this.min = 0;
        this.max = 100;
    }
    static createTable({ sequelize }) {
        sequelize.define('validation', {
            page: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            min: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            max: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.validation.count({ where: { handle: item.handle, page: item.page } }) === 0) {
                    await sequelize.models.validation.create(item);
                }
                else
                    await sequelize.models.validation.update(item, { where: { handle: item.handle, page: item.page } });
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], ValidationItem.prototype, "page", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], ValidationItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], ValidationItem.prototype, "min", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], ValidationItem.prototype, "max", void 0);
ValidationItem = __decorate([
    Table({ tableName: "validation", modelName: "validation" }),
    __metadata("design:paramtypes", [])
], ValidationItem);
export { ValidationItem };
//# sourceMappingURL=validationItem.js.map