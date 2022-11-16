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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'lootItem.json')).toString());
let LootItem = class LootItem extends Model {
    constructor() {
        super();
        this.minutes = 60;
        this.isActive = true;
        this.isLiveAutoControl = true;
        this.countUses = 0;
        this.countRuns = 0;
        this.lastRun = new Date(2020, 1, 1);
    }
    static createTable({ sequelize }) {
        sequelize.define('loot', {
            command: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            minutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            lastRun: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(2020, 1, 1)
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isLiveAutoControl: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            countUses: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            countRuns: {
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
                if (await sequelize.models.loot.count({ where: { command: item.command } }) === 0) {
                    await sequelize.models.loot.create(item);
                } // else await sequelize.models.loot.update(item, {where: {command: item.command}});
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
], LootItem.prototype, "command", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LootItem.prototype, "minutes", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], LootItem.prototype, "isActive", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], LootItem.prototype, "isLiveAutoControl", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LootItem.prototype, "countUses", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], LootItem.prototype, "countRuns", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], LootItem.prototype, "lastRun", void 0);
LootItem = __decorate([
    Table({ tableName: "loot", modelName: "loot" }),
    __metadata("design:paramtypes", [])
], LootItem);
export { LootItem };
//# sourceMappingURL=lootItem.js.map