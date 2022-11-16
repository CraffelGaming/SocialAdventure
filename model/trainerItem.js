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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'trainerItem.json')).toString());
let TrainerItem = class TrainerItem extends Model {
    constructor() {
        super();
        this.value = "";
        this.description = "";
        this.gold = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('trainer', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.trainer.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.trainer.create(item);
                }
                else
                    await sequelize.models.trainer.update(item, { where: { handle: item.handle } });
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle.length > 0) {
                const item = await sequelize.models.trainer.findByPk(element.handle);
                if (item) {
                    await sequelize.models.trainer.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.value != null && element.value.length > 0 && element.gold != null && element.gold > 0) {
                    await sequelize.models.trainer.create(element);
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
    static async training({ sequelize, globalSequelize, trainerHandle, heroName }) {
        try {
            const trainer = await sequelize.models.trainer.findByPk(trainerHandle);
            const hero = await sequelize.models.hero.findByPk(heroName);
            const heroTrait = await sequelize.models.heroTrait.findByPk(heroName);
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName);
            const validation = await globalSequelize.models.validation.findAll({ where: { page: 'hero' } });
            if (trainer && hero && heroWallet && heroTrait && validation) {
                const trait = (trainer.getDataValue("handle") + "Multipler");
                const value = heroTrait.getDataValue(trait);
                const price = value * trainer.getDataValue("gold");
                if (heroWallet.getDataValue("gold") >= price) {
                    if (value < validation.find(x => x.getDataValue("handle") === trait).getDataValue("max")) {
                        await heroWallet.decrement('gold', { by: price });
                        await heroTrait.increment(trait, { by: 1 });
                        if (trainer.getDataValue("handle") === "hitpoint") {
                            await hero.increment('hitpointsMax', { by: 10 });
                            await hero.increment('hitpoints', { by: 10 });
                        }
                        if (trainer.getDataValue("handle") === "strength") {
                            await hero.increment('strength', { by: 1 });
                        }
                        return 200;
                    }
                    else
                        return 401;
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
    __metadata("design:type", String)
], TrainerItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "value", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "description", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], TrainerItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "image", void 0);
TrainerItem = __decorate([
    Table({ tableName: "trainer", modelName: "trainer" }),
    __metadata("design:paramtypes", [])
], TrainerItem);
export { TrainerItem };
//# sourceMappingURL=trainerItem.js.map