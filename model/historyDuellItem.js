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
let HistoryDuellItem = class HistoryDuellItem {
    constructor(sourceHeroName, targetHeroName) {
        this.sourceHitpoints = 0;
        this.targetHitpoints = 0;
        this.gold = 0;
        this.experience = 0;
        this.date = new Date(2020, 1, 1);
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.date = new Date();
    }
    static createTable({ sequelize }) {
        sequelize.define('historyDuell', {
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
            sourceHitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            targetHitpoints: {
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
            date: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2099, 12, 31)
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.historyDuell.belongsTo(sequelize.models.hero, { as: 'heroSource', foreignKey: 'sourceHeroName' });
        sequelize.models.historyDuell.belongsTo(sequelize.models.hero, { as: 'heroTarget', foreignKey: 'targetHeroName' });
    }
    static async put({ sequelize, element }) {
        try {
            const item = await sequelize.models.historyDuell.findByPk(element.handle);
            if (item) {
                await sequelize.models.historyDuell.update(element, { where: { handle: element.handle } });
                return 201;
            }
            else {
                await sequelize.models.historyDuell.create(element);
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
], HistoryDuellItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryDuellItem.prototype, "sourceHeroName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HistoryDuellItem.prototype, "targetHeroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryDuellItem.prototype, "sourceHitpoints", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryDuellItem.prototype, "targetHitpoints", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryDuellItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HistoryDuellItem.prototype, "experience", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HistoryDuellItem.prototype, "date", void 0);
HistoryDuellItem = __decorate([
    Table({ tableName: "historyDuell", modelName: "historyDuell" }),
    __metadata("design:paramtypes", [String, String])
], HistoryDuellItem);
export { HistoryDuellItem };
//# sourceMappingURL=historyDuellItem.js.map