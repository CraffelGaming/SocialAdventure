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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainerItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./trainerItem.json");
let TrainerItem = class TrainerItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.value = "";
        this.description = "";
        this.gold = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('trainer', {
            handle: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            image: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.trainer.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.trainer.create(item);
                    }
                    else
                        yield sequelize.models.trainer.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
    static put({ sequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (element.handle != null && element.handle.length > 0) {
                    const item = yield sequelize.models.trainer.findByPk(element.handle);
                    if (item) {
                        yield sequelize.models.trainer.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                }
                else {
                    if (element.value != null && element.value.length > 0 && element.gold != null && element.gold > 0) {
                        yield sequelize.models.trainer.create(element);
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
        });
    }
    static training({ sequelize, trainerHandle, heroName }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const trainer = yield sequelize.models.trainer.findByPk(trainerHandle);
                const hero = yield sequelize.models.hero.findByPk(heroName);
                const heroTrait = yield sequelize.models.heroTrait.findByPk(heroName);
                const heroWallet = yield sequelize.models.heroWallet.findByPk(heroName);
                const validation = yield sequelize.models.validation.findAll({ where: { handle: 'hero' } });
                if (trainer && hero && heroWallet && heroTrait) {
                    const trait = (trainer.getDataValue("handle") + "Multipler");
                    const value = heroTrait.getDataValue(trait);
                    const price = value * trainer.getDataValue("gold");
                    if (heroWallet.getDataValue("gold") >= price) {
                        if (value < validation.find(x => x.getDataValue("handle") === trait).getDataValue("max")) {
                            yield heroWallet.decrement('gold', { by: price });
                            yield heroTrait.increment(trait, { by: 1 });
                            if (trainer.getDataValue("handle") === "hitpoint") {
                                yield hero.increment('hitpointsMax', { by: 10 });
                                yield hero.increment('hitpoints', { by: 10 });
                            }
                            if (trainer.getDataValue("handle") === "strength") {
                                yield hero.increment('strength', { by: 1 });
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
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "value", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TrainerItem.prototype, "gold", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TrainerItem.prototype, "image", void 0);
TrainerItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "trainer", modelName: "trainer" }),
    __metadata("design:paramtypes", [])
], TrainerItem);
exports.TrainerItem = TrainerItem;
module.exports.default = TrainerItem;
//# sourceMappingURL=trainerItem.js.map