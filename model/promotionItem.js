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
exports.PromotionItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./promotionItem.json");
let PromotionItem = class PromotionItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.gold = 0;
        this.diamond = 0;
        this.experience = 0;
        this.item = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('promotion', {
            handle: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
                primaryKey: true
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            diamond: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            item: {
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
                    if ((yield sequelize.models.promotion.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.promotion.create(item);
                    }
                    else
                        yield sequelize.models.promotion.update(item, { where: { handle: item.handle } });
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
                if (element.handle != null && element.handle.length > 0) {
                    const item = yield sequelize.models.promotion.findByPk(element.handle);
                    if (item) {
                        yield sequelize.models.promotion.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                }
                else {
                    if (element.gold != null && element.gold > 0 ||
                        element.diamond != null && element.diamond > 0 ||
                        element.experience != null && element.experience > 0 ||
                        element.item != null && element.item > 0) {
                        yield sequelize.models.promotion.create(element);
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
    __metadata("design:type", String)
], PromotionItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "gold", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "diamond", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "experience", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "item", void 0);
PromotionItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "promotion", modelName: "promotion" }),
    __metadata("design:paramtypes", [])
], PromotionItem);
exports.PromotionItem = PromotionItem;
module.exports.default = PromotionItem;
//# sourceMappingURL=promotionItem.js.map