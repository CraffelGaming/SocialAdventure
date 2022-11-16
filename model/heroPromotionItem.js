var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
let HeroPromotionItem = class HeroPromotionItem {
    static createTable({ sequelize }) {
        sequelize.define('heroPromotion', {
            promotionHandle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroPromotion.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroPromotion.belongsTo(sequelize.models.promotion, { as: 'promotion', foreignKey: 'promotionHandle' });
    }
    static async put({ sequelize, element }) {
        try {
            const item = await sequelize.models.heroPromotion.findOne({ where: { heroName: element.heroName, promotionHandle: element.promotionHandle } });
            if (!item) {
                await sequelize.models.heroPromotion.create(element);
                return 201;
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
    __metadata("design:type", String)
], HeroPromotionItem.prototype, "promotionHandle", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], HeroPromotionItem.prototype, "heroName", void 0);
HeroPromotionItem = __decorate([
    Table({ tableName: "heroPromotion", modelName: "heroPromotion" })
], HeroPromotionItem);
export { HeroPromotionItem };
//# sourceMappingURL=heroPromotionItem.js.map