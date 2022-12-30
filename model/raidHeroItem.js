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
let RaidHeroItem = class RaidHeroItem {
    constructor({ raidHandle, heroName }) {
        this.damage = 0;
        this.isRewarded = false;
        this.isActive = false;
        this.raidHandle = raidHandle;
        this.heroName = heroName;
    }
    static createTable({ sequelize }) {
        sequelize.define('raidHero', {
            raidHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            damage: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isRewarded: {
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
        sequelize.models.raidHero.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.raidHero.belongsTo(sequelize.models.raid, { as: 'raids', foreignKey: 'raidHandle' });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.raidHandle != null && element.raidHandle > 0 && element.heroName != null && element.heroName.length > 0) {
                const item = await sequelize.models.raidHero.findOne({ where: { raidHandle: element.raidHandle, heroName: element.heroName } });
                if (item) {
                    await sequelize.models.raidHero.update(element, { where: { raidHandle: element.raidHandle, heroName: element.heroName } });
                    return 201;
                }
                else {
                    await sequelize.models.raidHero.create(element);
                    return 201;
                }
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
    __metadata("design:type", Number)
], RaidHeroItem.prototype, "raidHandle", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], RaidHeroItem.prototype, "heroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidHeroItem.prototype, "damage", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], RaidHeroItem.prototype, "isRewarded", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], RaidHeroItem.prototype, "isActive", void 0);
RaidHeroItem = __decorate([
    Table({ tableName: "raidHero", modelName: "raidHero" }),
    __metadata("design:paramtypes", [Object])
], RaidHeroItem);
export { RaidHeroItem };
//# sourceMappingURL=raidHeroItem.js.map