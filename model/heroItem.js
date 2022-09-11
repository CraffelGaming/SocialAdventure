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
exports.HeroItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./heroItem.json");
const heroTraitItem_1 = require("./heroTraitItem");
const heroWalletItem_1 = require("./heroWalletItem");
let HeroItem = class HeroItem {
    constructor(name) {
        this.lastSteal = new Date(2020, 1, 1);
        this.lastJoin = new Date(2020, 1, 1);
        this.startIndex = 0;
        this.experience = 0;
        this.prestige = 0;
        this.isActive = false;
        this.name = name;
    }
    static createTable({ sequelize }) {
        const a = sequelize.define('hero', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            lastSteal: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastJoin: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            startIndex: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            prestige: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
        global.worker.log.error(a);
    }
    static setAssociation({ sequelize }) {
        sequelize.models.hero.hasOne(sequelize.models.heroTrait, { as: 'trait', foreignKey: 'heroName' });
        sequelize.models.hero.hasOne(sequelize.models.heroWallet, { as: 'wallet', foreignKey: 'heroName' });
        sequelize.models.hero.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'heroName' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.hero.count({ where: { name: item.name } })) === 0) {
                        yield sequelize.models.hero.create(item);
                    }
                    else
                        yield sequelize.models.hero.update(item, { where: { name: item.name } });
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
                if (element.name !== null && element.name !== "") {
                    const level = yield sequelize.models.level.findOne({
                        attributes: [[sequelize.fn('max', sequelize.col('experienceMax')), 'max']]
                    });
                    const maxExperience = level.getDataValue("experienceMax");
                    if (element.experience) {
                        if (element.experience >= maxExperience) {
                            element.experience -= maxExperience;
                            element.prestige += 1;
                        }
                    }
                    if ((yield sequelize.models.hero.count({ where: { name: element.name } })) === 0) {
                        yield sequelize.models.hero.create(element);
                        yield heroTraitItem_1.HeroTraitItem.put({ sequelize, element: new heroTraitItem_1.HeroTraitItem(element.name) });
                        yield heroWalletItem_1.HeroWalletItem.put({ sequelize, element: new heroWalletItem_1.HeroWalletItem(element.name) });
                        return 201;
                    }
                    else {
                        yield sequelize.models.hero.update(element, { where: { name: element.name } });
                        return 200;
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
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HeroItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastSteal", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastJoin", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "startIndex", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "experience", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "prestige", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], HeroItem.prototype, "isActive", void 0);
HeroItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "hero", modelName: "hero" }),
    __metadata("design:paramtypes", [String])
], HeroItem);
exports.HeroItem = HeroItem;
module.exports.default = HeroItem;
//# sourceMappingURL=heroItem.js.map