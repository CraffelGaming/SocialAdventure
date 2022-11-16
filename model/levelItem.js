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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'levelItem.json')).toString());
let LevelItem = class LevelItem extends Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
        sequelize.define('level', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.level.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.level.create(item);
                }
                else
                    await sequelize.models.level.update(item, { where: { handle: item.handle } });
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
    __metadata("design:type", Number)
], LevelItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LevelItem.prototype, "experienceMin", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LevelItem.prototype, "experienceMax", void 0);
LevelItem = __decorate([
    Table({ tableName: "level", modelName: "level" }),
    __metadata("design:paramtypes", [])
], LevelItem);
export { LevelItem };
//# sourceMappingURL=levelItem.js.map