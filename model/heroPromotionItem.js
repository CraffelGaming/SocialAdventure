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
exports.HeroPromotionItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./promotionItem.json");
let HeroPromotionItem = class HeroPromotionItem {
    static createTable({ sequelize }) {
        sequelize.define('heroPromotion', {
            promotionHandle: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroPromotion.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroPromotion.belongsTo(sequelize.models.promotion, { as: 'promotion', foreignKey: 'promotionHandle' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroPromotion.count({ where: { heroName: item.heroName, promotionHandle: item.promotionHandle } })) === 0) {
                        yield sequelize.models.heroPromotion.create(item);
                    }
                    else
                        yield sequelize.models.heroPromotion.update(item, { where: { heroName: item.heroName, promotionHandle: item.promotionHandle } });
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
                const item = yield sequelize.models.heroPromotion.findOne({ where: { heroName: element.heroName, promotionHandle: element.promotionHandle } });
                if (!item) {
                    yield sequelize.models.heroPromotion.create(element);
                    return 201;
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
], HeroPromotionItem.prototype, "promotionHandle", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HeroPromotionItem.prototype, "heroName", void 0);
HeroPromotionItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "heroPromotion", modelName: "heroPromotion" })
], HeroPromotionItem);
exports.HeroPromotionItem = HeroPromotionItem;
module.exports.default = HeroPromotionItem;
//# sourceMappingURL=heroPromotionItem.js.map