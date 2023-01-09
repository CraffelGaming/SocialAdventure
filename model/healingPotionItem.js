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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'healingPotionItem.json')).toString());
let HealingPotionItem = class HealingPotionItem extends Model {
    constructor() {
        super();
        this.percent = 0;
        this.gold = 0;
        this.isRevive = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('healingPotion', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            },
            percent: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            isRevive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.healingPotion.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.healingPotion.create(item);
                }
                else
                    await sequelize.models.healingPotion.update(item, { where: { handle: item.handle } });
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.healingPotion.findByPk(element.handle);
                if (item) {
                    await sequelize.models.healingPotion.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.value != null && element.value.length > 0 && element.description != null && element.description.length > 0 && element.gold != null && element.gold > 0 && element.percent != null && element.percent > 0) {
                    await sequelize.models.healingPotion.create(element);
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
    static async heal({ sequelize, healingPotionHandle, heroName, bonus }) {
        try {
            const potion = await sequelize.models.healingPotion.findByPk(healingPotionHandle);
            const hero = await sequelize.models.hero.findByPk(heroName);
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName);
            if (hero.getDataValue("hitpoints") < 0) {
                hero.setDataValue("hitpoints", 0);
            }
            if (potion && hero && heroWallet) {
                if (heroWallet.getDataValue("gold") >= potion.getDataValue("gold") && !bonus || heroWallet.getDataValue("gold") >= potion.getDataValue("gold") / 2 && bonus) {
                    if (hero.getDataValue("hitpoints") === 0 && potion.getDataValue("isRevive") === true || hero.getDataValue("hitpoints") > 0 && potion.getDataValue("isRevive") === false) {
                        if (hero.getDataValue("hitpoints") < hero.getDataValue("hitpointsMax")) {
                            hero.setDataValue("hitpoints", Math.round(hero.getDataValue("hitpoints") + (hero.getDataValue("hitpointsMax") / 100 * potion.getDataValue("percent"))));
                            if (hero.getDataValue("hitpoints") > hero.getDataValue("hitpointsMax"))
                                hero.setDataValue("hitpoints", hero.getDataValue("hitpointsMax"));
                            if (bonus === true) {
                                await heroWallet.decrement('gold', { by: Math.round(potion.getDataValue("gold") / 2) });
                            }
                            else {
                                await heroWallet.decrement('gold', { by: potion.getDataValue("gold") });
                            }
                            await hero.save({ fields: ['hitpoints'] });
                            return 200;
                        }
                        else
                            return 204;
                    }
                    else
                        return 406;
                }
                else
                    return 402;
            }
            else
                return 404;
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
], HealingPotionItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "value", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "description", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HealingPotionItem.prototype, "image", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HealingPotionItem.prototype, "percent", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HealingPotionItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HealingPotionItem.prototype, "isRevive", void 0);
HealingPotionItem = __decorate([
    Table({ tableName: "healingPotion", modelName: "healingPotion" }),
    __metadata("design:paramtypes", [])
], HealingPotionItem);
export { HealingPotionItem };
//# sourceMappingURL=healingPotionItem.js.map