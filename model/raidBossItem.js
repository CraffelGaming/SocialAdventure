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
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'raidBossItem.json')).toString());
let RaidBossItem = class RaidBossItem extends Model {
    constructor() {
        super();
        this.hitpoints = 1000;
        this.strength = 10;
        this.gold = 5000;
        this.diamond = 25;
        this.experience = 3000;
        this.categoryHandle = 1;
        this.isActive = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('raidBoss', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            hitpoints: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            strength: {
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
            categoryHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.raidBoss.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle' });
        sequelize.models.raidBoss.hasMany(sequelize.models.raid, { as: 'raids', foreignKey: 'raidBossHandle' });
    }
    static async updateTable({ sequelize }) {
        const handle = 1;
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.raidBoss.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.raidBoss.create(item);
                } // else await sequelize.models.raidBoss.update(item, {where: {handle: item.handle}});
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.raidBoss.findByPk(element.handle);
                if (item) {
                    await sequelize.models.raidBoss.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.name != null && element.name.length > 0) {
                    await sequelize.models.raidBoss.create(element);
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
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], RaidBossItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], RaidBossItem.prototype, "description", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "hitpoints", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "strength", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "diamond", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "experience", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], RaidBossItem.prototype, "categoryHandle", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], RaidBossItem.prototype, "isActive", void 0);
RaidBossItem = __decorate([
    Table({ tableName: "raidBoss", modelName: "raidBoss" }),
    __metadata("design:paramtypes", [])
], RaidBossItem);
export { RaidBossItem };
//# sourceMappingURL=raidBossItem.js.map