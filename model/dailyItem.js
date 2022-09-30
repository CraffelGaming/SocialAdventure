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
exports.DailyItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./dailyItem.json");
let DailyItem = class DailyItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.goldMin = 100;
        this.goldMax = 500;
        this.experienceMin = 100;
        this.experienceMax = 500;
        this.gold = 0;
        this.experience = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('daily', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            goldMin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            },
            experienceMin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.daily.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.daily.create(item);
                    }
                    else
                        yield sequelize.models.daily.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
    static put({ sequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (element.handle != null && element.handle > 0) {
                    const item = yield sequelize.models.daily.findByPk(element.handle);
                    if (item) {
                        yield sequelize.models.daily.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                }
                else {
                    if (element.value != null && element.value.length > 0 && element.description != null && element.description.length > 0 && element.goldMin != null && element.goldMin > 0 && element.goldMax != null && element.goldMax > 0) {
                        yield sequelize.models.daily.create(element);
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
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], DailyItem.prototype, "value", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], DailyItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "goldMin", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "goldMax", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "experienceMin", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "experienceMax", void 0);
DailyItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "daily", modelName: "daily" }),
    __metadata("design:paramtypes", [])
], DailyItem);
exports.DailyItem = DailyItem;
module.exports.default = DailyItem;
//# sourceMappingURL=dailyItem.js.map