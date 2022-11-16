var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var PromotionItem_1;
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroItem } from './heroItem.js';
import { HeroInventoryItem } from './heroInventoryItem.js';
import { HeroPromotionItem } from './heroPromotionItem.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'promotionItem.json')).toString());
let PromotionItem = PromotionItem_1 = class PromotionItem extends Model {
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
                type: DataTypes.STRING(),
                allowNull: false,
                primaryKey: true
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            diamond: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            item: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            validFrom: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            validTo: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.promotion.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'promotionHandle' });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.promotion.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.promotion.create(item);
                } // else await sequelize.models.promotion.update(item, {where: {handle: item.handle}});
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, globalSequelize, element }) {
        try {
            const item = await sequelize.models.promotion.findByPk(element.handle);
            if (await PromotionItem_1.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                if (item) {
                    await sequelize.models.promotion.update(element, { where: { handle: element.handle } });
                    return 201;
                }
                else {
                    await sequelize.models.promotion.create(element);
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
    }
    static async validate({ sequelize, globalSequelize, element, isUpdate }) {
        let isValid = true;
        const validations = await globalSequelize.models.validation.findAll({ where: { page: 'promotion' } });
        if (!(!element.gold || element.gold && element.gold >= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('min') && element.gold <= validations.find(x => x.getDataValue('handle') === 'gold').getDataValue('max')))
            isValid = false;
        if (!(!element.diamond || element.diamond && element.diamond >= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('min') && element.diamond <= validations.find(x => x.getDataValue('handle') === 'diamond').getDataValue('max')))
            isValid = false;
        if (!(!element.experience || element.experience && element.experience >= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('min') && element.experience <= validations.find(x => x.getDataValue('handle') === 'experience').getDataValue('max')))
            isValid = false;
        if (!(!element.item || element.item && await sequelize.models.item.findByPk(element.item)))
            isValid = false;
        return isValid;
    }
    static async redeem({ sequelize, promotion, heroName }) {
        try {
            const hero = await sequelize.models.hero.findByPk(heroName);
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName);
            const item = await sequelize.models.item.findByPk(promotion.item);
            const heroPromotion = await sequelize.models.heroPromotion.findOne({ where: { promotionHandle: promotion.handle, heroName } });
            if (promotion.validFrom.getTime() <= Date.now() && promotion.validTo.getTime() >= Date.now()) {
                if (!heroPromotion) {
                    if (promotion.gold > 0) {
                        await heroWallet.increment('gold', { by: promotion.gold });
                    }
                    if (promotion.diamond > 0) {
                        await heroWallet.increment('diamond', { by: promotion.diamond });
                    }
                    if (promotion.experience > 0) {
                        hero.setDataValue("experience", hero.getDataValue("experience") + promotion.experience);
                    }
                    if (promotion.item > 0) {
                        if (item) {
                            HeroInventoryItem.transferItemToInventory({ sequelize, item, heroName });
                        }
                    }
                    if (promotion.handle === 'NewStart') {
                        hero.setDataValue("isFounder", true);
                    }
                    hero.save();
                    HeroItem.calculateHero({ sequelize, element: hero.get() });
                    const element = new HeroPromotionItem();
                    element.heroName = heroName;
                    element.promotionHandle = promotion.handle;
                    HeroPromotionItem.put({ sequelize, element });
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
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], PromotionItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "diamond", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "experience", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], PromotionItem.prototype, "item", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], PromotionItem.prototype, "validFrom", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], PromotionItem.prototype, "validTo", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], PromotionItem.prototype, "isMaster", void 0);
PromotionItem = PromotionItem_1 = __decorate([
    Table({ tableName: "promotion", modelName: "promotion" }),
    __metadata("design:paramtypes", [])
], PromotionItem);
export { PromotionItem };
//# sourceMappingURL=promotionItem.js.map