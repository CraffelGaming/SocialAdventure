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
let HistoryAdventureItem = class HistoryAdventureItem {
    constructor() {
        this.heroHitpointsStart = 0;
        this.heroHitpointsEnd = 0;
        this.enemyHitpointsStart = 0;
        this.enemyHitpointsEnd = 0;
        this.isSuccess = true;
        this.heroDamage = 0;
        this.enemyDamage = 0;
        this.gold = 0;
        this.experience = 0;
        this.date = new Date(2020, 1, 1);
        this.date = new Date();
    }
    static createTable({ sequelize }) {
        sequelize.define('historyAdventure', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            enemyName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            heroHitpointsStart: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            heroHitpointsEnd: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            enemyHitpointsStart: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            enemyHitpointsEnd: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            enemyDamage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            heroDamage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            experience: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }
    static async put({ sequelize, element }) {
        try {
            const item = await sequelize.models.historyAdventure.findByPk(element.handle);
            if (item) {
                await sequelize.models.historyAdventure.update(element, { where: { handle: element.handle } });
                return 201;
            }
            else {
                await sequelize.models.historyAdventure.create(element);
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
], HistoryAdventureItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryAdventureItem.prototype, "heroName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryAdventureItem.prototype, "enemyName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "heroHitpointsStart", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "heroHitpointsEnd", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "enemyHitpointsStart", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "enemyHitpointsEnd", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HistoryAdventureItem.prototype, "isSuccess", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "heroDamage", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "enemyDamage", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryAdventureItem.prototype, "experience", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryAdventureItem.prototype, "itemName", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HistoryAdventureItem.prototype, "date", void 0);
HistoryAdventureItem = __decorate([
    Table({ tableName: "historyAdventure", modelName: "historyAdventure" }),
    __metadata("design:paramtypes", [])
], HistoryAdventureItem);
export { HistoryAdventureItem };
//# sourceMappingURL=historyAdventureItem.js.map