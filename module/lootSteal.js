"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootSteal = void 0;
const sequelize_1 = __importDefault(require("sequelize"));
const adventureItem_1 = require("../model/adventureItem");
class LootSteal {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName = null, itemParameter = null) {
        this.isSource = true;
        this.isTarget = true;
        this.isItem = true;
        this.isItemHero = true;
        this.isItemHeroes = true;
        this.isAdventure = true;
        this.isTimeout = true;
        this.isSteal = true;
        this.isLoose = true;
        this.isSelf = true;
        this.isActive = true;
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadElements();
            if (settings.isActive) {
                if (this.item) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, item ${this.item.getDataValue("value")}`);
                    if (this.sourceHero) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, sourceHero ${this.sourceHero.getDataValue("name")}`);
                        if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastSteal")), settings.minutes)) {
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, timeout expired`);
                            if (this.targetHero) {
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, targetHero ${this.targetHero.getDataValue("name")}`);
                                if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                                    if (this.adventure) {
                                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                        if (yield this.isStealSuccess()) {
                                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, succsess`);
                                            yield this.save(this.sourceHero, this.sourceHero);
                                            return true;
                                        }
                                        else {
                                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, failed`);
                                            this.isSteal = false;
                                            this.adventure = yield this.getAdventure(this.sourceHero);
                                            if (this.adventure) {
                                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                                this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")));
                                                if (this.isItem) {
                                                    this.isLoose = false;
                                                    yield this.save(this.sourceHero, this.targetHero);
                                                }
                                            }
                                        }
                                    }
                                    else
                                        this.isAdventure = false;
                                }
                            }
                            else
                                this.isTarget = false;
                        }
                        else
                            this.isTimeout = false;
                    }
                    else
                        this.isSource = false;
                }
                else
                    this.isItem = false;
            }
            else
                this.isActive = false;
            return false;
        });
    }
    save(source, target) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.adventure.destroy();
            const adventure = new adventureItem_1.AdventureItem(this.item.getDataValue("handle"), target.getDataValue("name"));
            yield adventureItem_1.AdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: adventure });
            source.setDataValue("lastSteal", new Date());
            yield source.save();
        });
    }
    loadElements() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sourceHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName));
            if (this.itemParameter) {
                this.item = yield this.getItem();
                if (this.item) {
                    this.adventure = (yield this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle") } }));
                    if (this.adventure) {
                        this.targetHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName")));
                    }
                }
            }
            else if (this.targetHeroName) {
                this.targetHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName));
                if (this.targetHero) {
                    this.adventure = yield this.getAdventure(this.targetHero);
                    if (this.adventure) {
                        this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")));
                        if (!this.isItem)
                            this.isItemHero = false;
                    }
                    else
                        this.isItemHero = false;
                }
                this.isTarget = false;
            }
            else {
                this.adventure = yield this.getAdventure();
                if (this.adventure) {
                    this.targetHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName")));
                    this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")));
                    if (!this.isItem)
                        this.isItemHeroes = false;
                }
                this.isItemHeroes = false;
            }
        });
    }
    isStealSuccess() {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceTrait = yield this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue("name"));
            const targetTrait = yield this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue("name"));
            let targetResult = 0;
            let sourceResult = 0;
            if (sourceTrait && targetTrait) {
                const sourceTrys = targetTrait.getDataValue("stealMultipler");
                const targetTrys = targetTrait.getDataValue("defenceMultipler");
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence sourceTrys ${sourceTrys}`);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence targetTrys ${targetTrys}`);
                for (let i = 1; i <= sourceTrys; i++) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source try ${i}`);
                    const sourceDice = this.loot.getRandomNumber(0, 100);
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source dice ${sourceDice}`);
                    if (sourceDice > sourceResult) {
                        sourceResult = sourceDice;
                    }
                }
                for (let i = 1; i <= targetTrys; i++) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target try ${i}`);
                    const targetDice = this.loot.getRandomNumber(0, 100);
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target dice ${targetDice}`);
                    if (targetDice > targetResult) {
                        targetResult = targetDice;
                    }
                }
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source result ${sourceResult}`);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target result ${targetResult}`);
                if (sourceResult >= targetResult) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source win`);
                    return true;
                }
            }
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target win`);
            return false;
        });
    }
    //#endregion
    //#region Item
    getItem() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.itemParameter && this.itemParameter.length > 0) {
                const itemHandle = Number(this.itemParameter);
                if (isNaN(itemHandle)) {
                    return yield this.loot.channel.database.sequelize.models.item.findOne({ where: { value: this.itemParameter } });
                }
                else {
                    return yield this.loot.channel.database.sequelize.models.item.findByPk(itemHandle);
                }
            }
            return null;
        });
    }
    //#endregion
    //#region Adventure
    getAdventures(hero = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (hero) {
                return yield this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero.getDataValue("name") } });
            }
            else {
                return yield this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: { [sequelize_1.default.Op.not]: this.sourceHero.getDataValue("name") } } });
            }
        });
    }
    getAdventure(hero = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const adventures = yield this.getAdventures(hero);
            if (adventures.length > 0) {
                return adventures[this.loot.getRandomNumber(0, adventures.length - 1)];
            }
            return null;
        });
    }
}
exports.LootSteal = LootSteal;
//# sourceMappingURL=lootSteal.js.map