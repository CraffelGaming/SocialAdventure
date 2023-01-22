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
let HistoryStealItem = class HistoryStealItem {
    constructor(sourceHeroName, targetHeroName) {
        this.rollSource = 0;
        this.rollSourceCount = 0;
        this.rollTarget = 0;
        this.rollTargetCount = 0;
        this.isSuccess = true;
        this.date = new Date(2020, 1, 1);
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.date = new Date();
    }
    static createTable({ sequelize }) {
        sequelize.define('historySteal', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            sourceHeroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            targetHeroName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            rollSource: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollSourceCount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollTarget: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            rollTargetCount: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isSuccess: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            itemName: {
                type: DataTypes.STRING,
                allowNull: true
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
            const item = await sequelize.models.historySteal.findByPk(element.handle);
            if (item) {
                await sequelize.models.historySteal.update(element, { where: { handle: element.handle } });
                return 201;
            }
            else {
                await sequelize.models.historySteal.create(element);
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
], HistoryStealItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryStealItem.prototype, "sourceHeroName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryStealItem.prototype, "targetHeroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryStealItem.prototype, "rollSource", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryStealItem.prototype, "rollSourceCount", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryStealItem.prototype, "rollTarget", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryStealItem.prototype, "rollTargetCount", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HistoryStealItem.prototype, "isSuccess", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryStealItem.prototype, "itemName", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HistoryStealItem.prototype, "date", void 0);
HistoryStealItem = __decorate([
    Table({ tableName: "historySteal", modelName: "historySteal" }),
    __metadata("design:paramtypes", [String, String])
], HistoryStealItem);
export { HistoryStealItem };
//# sourceMappingURL=historyStealItem.js.map