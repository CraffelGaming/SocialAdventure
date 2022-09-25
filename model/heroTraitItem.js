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
exports.HeroTraitItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./heroTraitItem.json");
let HeroTraitItem = class HeroTraitItem {
    constructor(heroName) {
        this.goldMultipler = 1;
        this.stealMultipler = 1;
        this.defenceMultipler = 1;
        this.workMultipler = 1;
        this.strengthMultipler = 1;
        this.hitpointMultipler = 1;
        this.heroName = heroName;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroTrait', {
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            goldMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            stealMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            defenceMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            workMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            strengthMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            hitpointMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroTrait.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroTrait.count({ where: { heroName: item.heroName } })) === 0) {
                        yield sequelize.models.heroTrait.create(item);
                    }
                    else
                        yield sequelize.models.heroTrait.update(item, { where: { heroName: item.heroName } });
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
                if (element.heroName !== null && element.heroName !== "") {
                    if ((yield sequelize.models.heroTrait.count({ where: { heroName: element.heroName } })) === 0) {
                        yield sequelize.models.heroTrait.create(element);
                    }
                    else
                        yield sequelize.models.heroTrait.update(element, { where: { heroName: element.heroName } });
                    return 200;
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
], HeroTraitItem.prototype, "heroName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "goldMultipler", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "stealMultipler", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "defenceMultipler", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "workMultipler", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "strengthMultipler", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "hitpointMultipler", void 0);
HeroTraitItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "heroTrait", modelName: "heroTrait" }),
    __metadata("design:paramtypes", [String])
], HeroTraitItem);
exports.HeroTraitItem = HeroTraitItem;
module.exports.default = HeroTraitItem;
//# sourceMappingURL=heroTraitItem.js.map