var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var DailyItem_1;
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import seedrandom from 'seedrandom';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'dailyItem.json')).toString());
let DailyItem = DailyItem_1 = class DailyItem extends Model {
    constructor() {
        super();
        this.goldMin = 100;
        this.goldMax = 500;
        this.experienceMin = 100;
        this.experienceMax = 500;
        this.gold = 0;
        this.experience = 0;
        this.date = new Date(2020, 1, 1);
    }
    static createTable({ sequelize }) {
        sequelize.define('daily', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            goldMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 500
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.daily.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.daily.create(item);
                } // else await sequelize.models.daily.update(item, {where: {handle: item.handle}});
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static async put({ sequelize, globalSequelize, element }) {
        try {
            const item = await sequelize.models.daily.findByPk(element.handle);
            if (await DailyItem_1.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                if (item) {
                    await sequelize.models.daily.update(element, { where: { handle: element.handle } });
                    return 201;
                }
                else {
                    await sequelize.models.daily.create(element);
                    return 201;
                }
            }
            else
                return 406;
        }
        catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
    static async validate({ sequelize, globalSequelize, element, isUpdate }) {
        let isValid = true;
        const validations = await globalSequelize.models.validation.findAll({ where: { page: 'daily' } });
        if (!(!element.experienceMin || element.experienceMin && element.experienceMin >= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('min') && element.experienceMin <= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('max')))
            isValid = false;
        if (!(!element.experienceMax || element.experienceMax && element.experienceMax >= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('min') && element.experienceMax <= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('max')))
            isValid = false;
        if (!(!element.goldMin || element.goldMin && element.goldMin >= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('min') && element.goldMin <= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('max')))
            isValid = false;
        if (!(!element.goldMax || element.goldMax && element.goldMax >= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('min') && element.goldMax <= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('max')))
            isValid = false;
        if (!isUpdate) {
            if (!(element.value != null && element.value.length > 0))
                isValid = false;
            if (!(element.description != null && element.description.length > 0))
                isValid = false;
            if (!(element.goldMin != null && element.goldMin > 0))
                isValid = false;
            if (!(element.goldMax != null && element.goldMax > 0))
                isValid = false;
        }
        return isValid;
    }
    static async getCurrentDaily({ sequelize, count, node }) {
        const item = await sequelize.models.daily.findAll({ order: [['handle', 'ASC']], raw: false });
        const today = new Date();
        const found = [];
        const generatorDaily = seedrandom(today.toDateString() + node);
        const generatorReward = seedrandom(today.toDateString() + node);
        for (let i = 1; i <= count; i++) {
            const rand = Math.floor(generatorDaily() * (item.length - 0) + 0);
            const element = item.splice(rand, 1)[0].get();
            element.gold = Math.floor(generatorReward() * (element.goldMax - element.goldMin + 1) + element.goldMin);
            element.experience = Math.floor(generatorReward() * (element.experienceMax - element.experienceMin + 1) + element.experienceMin);
            element.date = today;
            found.push(element);
        }
        return found;
    }
    static async getCurrentDailyByHero({ sequelize, count, heroName, node }) {
        const found = await DailyItem_1.getCurrentDaily({ sequelize, count, node });
        const trait = await sequelize.models.heroTrait.findByPk(heroName);
        for (const item of found) {
            item.gold = Math.round(item.gold * ((trait.getDataValue("workMultipler") / 10) + 1));
            item.experience = Math.round(item.experience * ((trait.getDataValue("workMultipler") / 10) + 1));
        }
        return found;
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], DailyItem.prototype, "value", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], DailyItem.prototype, "description", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "goldMin", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "goldMax", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "experienceMin", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], DailyItem.prototype, "experienceMax", void 0);
DailyItem = DailyItem_1 = __decorate([
    Table({ tableName: "daily", modelName: "daily" }),
    __metadata("design:paramtypes", [])
], DailyItem);
export { DailyItem };
//# sourceMappingURL=dailyItem.js.map