"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var EnemyItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnemyItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./enemyItem.json");
let EnemyItem = EnemyItem_1 = class EnemyItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.difficulty = 1;
        this.hitpoints = 10;
        this.strength = 5;
        this.isActive = true;
        this.experienceMin = 100;
        this.experienceMax = 200;
        this.goldMin = 100;
        this.goldMax = 200;
    }
    static createTable({ sequelize }) {
        sequelize.define('enemy', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            difficulty: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            hitpoints: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            strength: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            experienceMin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            experienceMax: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 200
            },
            goldMin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            goldMax: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 200
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.enemy.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.enemy.create(item);
                    }
                    else
                        yield sequelize.models.enemy.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
    static put({ sequelize, globalSequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield sequelize.models.enemy.findByPk(element.handle);
                if (yield EnemyItem_1.validate({ sequelize, globalSequelize, element, isUpdate: item ? true : false })) {
                    if (item) {
                        yield sequelize.models.enemy.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                    else {
                        yield sequelize.models.enemy.create(element);
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
        });
    }
    static validate({ sequelize, globalSequelize, element, isUpdate }) {
        return __awaiter(this, void 0, void 0, function* () {
            let isValid = true;
            const validations = yield globalSequelize.models.validation.findAll({ where: { page: 'enemy' } });
            if (!(!element.experienceMin || element.experienceMin && element.experienceMin >= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('min') && element.experienceMin <= validations.find(x => x.getDataValue('handle') === 'experienceMin').getDataValue('max')))
                isValid = false;
            if (!(!element.experienceMax || element.experienceMax && element.experienceMax >= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('min') && element.experienceMax <= validations.find(x => x.getDataValue('handle') === 'experienceMax').getDataValue('max')))
                isValid = false;
            if (!(!element.goldMin || element.goldMin && element.goldMin >= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('min') && element.goldMin <= validations.find(x => x.getDataValue('handle') === 'goldMin').getDataValue('max')))
                isValid = false;
            if (!(!element.goldMax || element.goldMax && element.goldMax >= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('min') && element.goldMax <= validations.find(x => x.getDataValue('handle') === 'goldMax').getDataValue('max')))
                isValid = false;
            if (!(!element.strength || element.strength && element.strength >= validations.find(x => x.getDataValue('handle') === 'strength').getDataValue('min') && element.strength <= validations.find(x => x.getDataValue('handle') === 'strength').getDataValue('max')))
                isValid = false;
            if (!(!element.hitpoints || element.hitpoints && element.hitpoints >= validations.find(x => x.getDataValue('handle') === 'hitpoints').getDataValue('min') && element.hitpoints <= validations.find(x => x.getDataValue('handle') === 'hitpoints').getDataValue('max')))
                isValid = false;
            if (!isUpdate) {
                if (!(element.name != null && element.name.length > 0)) {
                    isValid = false;
                }
            }
            return isValid;
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EnemyItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], EnemyItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "difficulty", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "hitpoints", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "strength", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], EnemyItem.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "experienceMin", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "experienceMax", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "goldMin", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], EnemyItem.prototype, "goldMax", void 0);
EnemyItem = EnemyItem_1 = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "enemy", modelName: "enemy" }),
    __metadata("design:paramtypes", [])
], EnemyItem);
exports.EnemyItem = EnemyItem;
module.exports.default = EnemyItem;
//# sourceMappingURL=enemyItem.js.map