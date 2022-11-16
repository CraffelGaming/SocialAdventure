var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var HeroItem_1;
import { Column, Table, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { HeroTraitItem } from './heroTraitItem.js';
import { HeroWalletItem } from './heroWalletItem.js';
let HeroItem = HeroItem_1 = class HeroItem {
    constructor(name) {
        this.lastSteal = new Date(2020, 1, 1);
        this.lastJoin = new Date(2020, 1, 1);
        this.lastLeave = new Date(2020, 1, 1);
        this.lastGive = new Date(2020, 1, 1);
        this.lastDaily = new Date(2020, 1, 1);
        this.startIndex = 0;
        this.experience = 0;
        this.prestige = 0;
        this.hitpoints = 100;
        this.hitpointsMax = 100;
        this.isActive = false;
        this.isFounder = false;
        this.level = 1;
        this.strength = 20;
        this.name = name;
    }
    static createTable({ sequelize }) {
        sequelize.define('hero', {
            name: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            lastSteal: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastJoin: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastLeave: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastDaily: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            lastGive: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            startIndex: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            prestige: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            hitpointsMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            isFounder: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            strength: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 20
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.hero.hasOne(sequelize.models.heroTrait, { as: 'trait', foreignKey: 'heroName' });
        sequelize.models.hero.hasOne(sequelize.models.adventure, { as: 'adventure', foreignKey: 'heroName' });
        sequelize.models.hero.hasOne(sequelize.models.heroWallet, { as: 'wallet', foreignKey: 'heroName' });
        sequelize.models.hero.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'heroName' });
        sequelize.models.hero.hasMany(sequelize.models.heroPromotion, { as: 'promotion', foreignKey: 'heroName' });
    }
    static async calculateHero({ sequelize, element }) {
        const level = await sequelize.models.level.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('experienceMax')), 'max']]
        });
        const maxExperience = level.getDataValue("max");
        if (element.experience >= maxExperience) {
            await sequelize.models.hero.decrement('experience', { by: maxExperience, where: { name: element.name } });
            await sequelize.models.hero.increment('prestige', { by: 1, where: { name: element.name } });
        }
        return true;
    }
    static async put({ sequelize, element, onlyCreate }) {
        let result = 201;
        try {
            if (element.name !== null && element.name !== "") {
                element.name.toLowerCase();
                if (await sequelize.models.hero.count({ where: { name: element.name } }) === 0) {
                    await sequelize.models.hero.create(element);
                    await HeroTraitItem.put({ sequelize, element: new HeroTraitItem(element.name) });
                    await HeroWalletItem.put({ sequelize, element: new HeroWalletItem(element.name) });
                }
                else if (!onlyCreate) {
                    await sequelize.models.hero.update(element, { where: { name: element.name } });
                }
                HeroItem_1.calculateHero({ sequelize, element });
            }
            else
                result = 406;
        }
        catch (ex) {
            global.worker.log.error(ex);
            result = 500;
        }
        return result;
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], HeroItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastSteal", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastJoin", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastLeave", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastGive", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroItem.prototype, "lastDaily", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "startIndex", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "experience", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "prestige", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "hitpoints", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "hitpointsMax", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HeroItem.prototype, "isActive", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HeroItem.prototype, "isFounder", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "level", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroItem.prototype, "strength", void 0);
HeroItem = HeroItem_1 = __decorate([
    Table({ tableName: "hero", modelName: "hero" }),
    __metadata("design:paramtypes", [String])
], HeroItem);
export { HeroItem };
//# sourceMappingURL=heroItem.js.map