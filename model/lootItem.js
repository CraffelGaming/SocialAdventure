"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./lootItem.json");
let LootItem = class LootItem extends sequelize_typescript_1.Model {
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
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            minutes: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            lastRun: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(2020, 1, 1)
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isLiveAutoControl: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            countUses: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            countRuns: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.loot.count({ where: { command: item.command } })) === 0) {
                        yield sequelize.models.loot.create(item);
                    } // else await sequelize.models.loot.update(item, {where: {command: item.command}});
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], LootItem.prototype, "command", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], LootItem.prototype, "minutes", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], LootItem.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], LootItem.prototype, "isLiveAutoControl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], LootItem.prototype, "countUses", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], LootItem.prototype, "countRuns", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], LootItem.prototype, "lastRun", void 0);
LootItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "loot", modelName: "loot" }),
    __metadata("design:paramtypes", [])
], LootItem);
exports.LootItem = LootItem;
module.exports.default = LootItem;
//# sourceMappingURL=lootItem.js.map