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
exports.HealingPotionItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./healingPotionItem.json");
let HealingPotionItem = class HealingPotionItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.percent = 0;
        this.gold = 0;
        this.isRevive = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('healingPotion', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: false
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            percent: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            isRevive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.healingPotion.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.healingPotion.create(item);
                    }
                    else
                        yield sequelize.models.healingPotion.update(item, { where: { handle: item.handle } });
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
                    const item = yield sequelize.models.healingPotion.findByPk(element.handle);
                    if (item) {
                        yield sequelize.models.healingPotion.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                }
                else {
                    if (element.value != null && element.value.length > 0 && element.description != null && element.description.length > 0 && element.gold != null && element.gold > 0 && element.percent != null && element.percent > 0) {
                        yield sequelize.models.healingPotion.create(element);
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
    static heal({ sequelize, healingPotionHandle, heroName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const potion = yield sequelize.models.healingPotion.findByPk(healingPotionHandle);
                const hero = yield sequelize.models.hero.findByPk(heroName);
                const heroWallet = yield sequelize.models.heroWallet.findByPk(heroName);
                if (potion && hero && heroWallet) {
                    if (heroWallet.getDataValue("gold") >= potion.getDataValue("gold")) {
                        if (hero.getDataValue("hitpoints") === 0 && potion.getDataValue("isRevive") === true || hero.getDataValue("hitpoints") > 0 && potion.getDataValue("isRevive") === false) {
                            hero.setDataValue("hitpoints", hero.getDataValue("hitpoints") + (hero.getDataValue("hitpointsMax") / 100 * potion.getDataValue("percent")));
                            if (hero.getDataValue("hitpoints") > hero.getDataValue("hitpointsMax"))
                                hero.setDataValue("hitpoints", hero.getDataValue("hitpointsMax"));
                            yield heroWallet.decrement('gold', { by: potion.getDataValue("gold") });
                            yield hero.save({ fields: ['hitpoints'] });
                            return 200;
                        }
                        else
                            return 406;
                    }
                    else
                        return 402;
                }
                else
                    return 404;
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
], HealingPotionItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "value", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "image", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HealingPotionItem.prototype, "percent", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HealingPotionItem.prototype, "gold", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], HealingPotionItem.prototype, "isRevive", void 0);
HealingPotionItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "healingPotion", modelName: "healingPotion" }),
    __metadata("design:paramtypes", [])
], HealingPotionItem);
exports.HealingPotionItem = HealingPotionItem;
module.exports.default = HealingPotionItem;
//# sourceMappingURL=healingPotionItem.js.map