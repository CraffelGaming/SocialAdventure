var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
let RaidItem = class RaidItem extends Model {
    constructor() {
        super();
        this.hitpoints = 1000;
        this.isDefeated = false;
        this.isActive = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('raid', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            raidBossHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isDefeated: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.raid.belongsTo(sequelize.models.raidBoss, { as: 'raidBoss', foreignKey: 'raidBossHandle' });
        sequelize.models.raid.hasMany(sequelize.models.raidHero, { as: 'raidHeroes', foreignKey: 'raidHandle' });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.raid.findByPk(element.handle);
                if (item) {
                    await sequelize.models.raid.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.raidBossHandle != null && element.raidBossHandle > 0) {
                    await sequelize.models.raid.create(element);
                    return 201;
                }
                else
                    return 406;
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
        return 404;
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], RaidItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidItem.prototype, "raidBossHandle", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidItem.prototype, "hitpoints", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], RaidItem.prototype, "isDefeated", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], RaidItem.prototype, "isActive", void 0);
RaidItem = __decorate([
    Table({ tableName: "raid", modelName: "raid" }),
    __metadata("design:paramtypes", [])
], RaidItem);
export { RaidItem };
//# sourceMappingURL=raidItem.js.map