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
let HeroTraitItem = class HeroTraitItem {
    constructor(heroName) {
        this.goldMultipler = 1;
        this.stealMultipler = 1;
        this.defenceMultipler = 1;
        this.workMultipler = 1;
        this.strengthMultipler = 1;
        this.hitpointMultipler = 1;
        this.perceptionMultipler = 1;
        this.heroName = heroName;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroTrait', {
            heroName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            goldMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            stealMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            defenceMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            workMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            strengthMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            hitpointMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            perceptionMultipler: {
                type: DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroTrait.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.heroName !== null && element.heroName !== "") {
                if (await sequelize.models.heroTrait.count({ where: { heroName: element.heroName } }) === 0) {
                    await sequelize.models.heroTrait.create(element);
                }
                else
                    await sequelize.models.heroTrait.update(element, { where: { heroName: element.heroName } });
                return 200;
            }
            else
                return 406;
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
], HeroTraitItem.prototype, "heroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "goldMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "stealMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "defenceMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "workMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "strengthMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "hitpointMultipler", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroTraitItem.prototype, "perceptionMultipler", void 0);
HeroTraitItem = __decorate([
    Table({ tableName: "heroTrait", modelName: "heroTrait" }),
    __metadata("design:paramtypes", [String])
], HeroTraitItem);
export { HeroTraitItem };
//# sourceMappingURL=heroTraitItem.js.map