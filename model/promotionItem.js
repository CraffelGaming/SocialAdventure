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
var PromotionItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./promotionItem.json");
const heroItem_1 = require("./heroItem");
const heroInventoryItem_1 = require("./heroInventoryItem");
const heroPromotionItem_1 = require("./heroPromotionItem");
let PromotionItem = PromotionItem_1 = class PromotionItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.gold = 0;
        this.diamond = 0;
        this.experience = 0;
        this.validFrom = new Date(2020, 1, 1);
        this.validTo = new Date(2099, 12, 31);
        this.isMaster = false;
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
                allowNull: true
            },
            isMaster: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            validFrom: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            validTo: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.promotion.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'promotionHandle' });
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
    static put({ sequelize, globalSequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield sequelize.models.promotion.findByPk(element.handle);
                if (yield PromotionItem_1.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                    if (item) {
                        yield sequelize.models.promotion.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                    else {
                        yield sequelize.models.promotion.create(element);
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
        });
    }
    static validate({ sequelize, globalSequelize, element, isUpdate }) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const validations = yield globalSequelize.models.validation.findAll({ where: { page: 'promotion' } });
            if (!(!element.gold || element.gold && element.gold >= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('min') && element.gold <= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('max')))
                isValid = false;
            if (!(!element.diamond || element.diamond && element.diamond >= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('min') && element.diamond <= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('max')))
                isValid = false;
            if (!(!element.experience || element.experience && element.experience >= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('min') && element.experience <= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('max')))
                isValid = false;
            if (!(!element.item || element.item && (yield sequelize.models.item.findByPk(element.item))))
                isValid = false;
            return isValid;
        });
    }
    static redeem({ sequelize, promotion, heroName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = yield sequelize.models.hero.findByPk(heroName);
                const heroWallet = yield sequelize.models.heroWallet.findByPk(heroName);
                const item = yield sequelize.models.item.findByPk(promotion.item);
                const heroPromotion = yield sequelize.models.heroPromotion.findOne({ where: { promotionHandle: promotion.handle, heroName } });
                if (promotion.validFrom.getTime() <= Date.now() && promotion.validTo.getTime() >= Date.now()) {
                    if (!heroPromotion) {
                        if (promotion.gold > 0) {
                            yield heroWallet.increment('gold', { by: promotion.gold });
                        }
                        if (promotion.diamond > 0) {
                            yield heroWallet.increment('diamond', { by: promotion.diamond });
                        }
                        if (promotion.experience > 0) {
                            hero.setDataValue("experience", hero.getDataValue("experience") + promotion.experience);
                        }
                        if (promotion.item > 0) {
                            if (item) {
                                heroInventoryItem_1.HeroInventoryItem.transferItemToInventory({ sequelize, item, heroName });
                            }
                        }
                        if (promotion.handle === 'NewStart') {
                            hero.setDataValue("isFounder", true);
                        }
                        hero.save();
                        heroItem_1.HeroItem.calculateHero({ sequelize, element: hero.get() });
                        const element = new heroPromotionItem_1.HeroPromotionItem();
                        element.heroName = heroName;
                        element.promotionHandle = promotion.handle;
                        heroPromotionItem_1.HeroPromotionItem.put({ sequelize, element });
                        return 200;
                    }
                    return 204;
                }
                else
                    return 201;
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
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], PromotionItem.prototype, "validFrom", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], PromotionItem.prototype, "validTo", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], PromotionItem.prototype, "isMaster", void 0);
PromotionItem = PromotionItem_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "promotion", modelName: "promotion" }),
    __metadata("design:paramtypes", [])
], PromotionItem);
exports.PromotionItem = PromotionItem;
module.exports.default = PromotionItem;
//# sourceMappingURL=promotionItem.js.map