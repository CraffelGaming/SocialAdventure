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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'locationItem.json')).toString());
let LocationItem = class LocationItem extends Model {
    constructor() {
        super();
        this.difficulty = 1;
        this.categoryHandle = 1;
        this.isActive = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('location', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            difficulty: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            categoryHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.location.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle' });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.location.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.location.create(item);
                } // else await sequelize.models.location.update(item, {where: {handle: item.handle}});
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.location.findByPk(element.handle);
                if (item) {
                    await sequelize.models.location.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.name != null && element.name.length > 0) {
                    await sequelize.models.location.create(element);
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
], LocationItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], LocationItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], LocationItem.prototype, "description", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LocationItem.prototype, "difficulty", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LocationItem.prototype, "categoryHandle", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], LocationItem.prototype, "isActive", void 0);
LocationItem = __decorate([
    Table({ tableName: "location", modelName: "location" }),
    __metadata("design:paramtypes", [])
], LocationItem);
export { LocationItem };
//# sourceMappingURL=locationItem.js.map