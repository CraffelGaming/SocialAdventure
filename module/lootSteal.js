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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootSteal = void 0;
class LootSteal {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName = null, itemHandle = null) {
        this.isSource = true;
        this.isTarget = true;
        this.isItem = true;
        this.isAdventure = true;
        this.isTimeout = true;
        this.isSteal = true;
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.itemHandle = itemHandle;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadElements();
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, item ${this.item.getDataValue("value")}`);
                if (this.sourceHero) {
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastSteal")), settings.minutes)) {
                        global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, timeout expired`);
                        if (this.targetHero) {
                            global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, targetHero ${this.targetHero.getDataValue("name")}`);
                            if (this.adventure) {
                                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, adventure`);
                                if (yield this.isStealSuccess()) {
                                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, succsess`);
                                    yield this.adventure.destroy();
                                    this.adventure.setDataValue("heroName", this.targetHero.getDataValue("name"));
                                    yield this.adventure.save();
                                    this.sourceHero.setDataValue("lastSteal", new Date());
                                    yield this.sourceHero.save();
                                    return true;
                                }
                                else
                                    this.isSteal = false;
                            }
                            else
                                this.isAdventure = false;
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
            return false;
        });
    }
    loadElements() {
        return __awaiter(this, void 0, void 0, function* () {
            this.sourceHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName));
            if (this.itemHandle) {
                this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.itemHandle));
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
                    }
                }
            }
            else {
                this.adventure = yield this.getAdventure();
                if (this.adventure) {
                    this.targetHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName")));
                    this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")));
                }
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
                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence sourceTrys ${sourceTrys}`);
                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence targetTrys ${targetTrys}`);
                for (let i = 1; i <= sourceTrys; i++) {
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence source try ${i}`);
                    const sourceDice = this.loot.getRandomNumber(0, 100);
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence source dice ${sourceDice}`);
                    if (sourceDice > sourceResult) {
                        sourceResult = sourceDice;
                    }
                }
                for (let i = 1; i <= targetTrys; i++) {
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence target try ${i}`);
                    const targetDice = this.loot.getRandomNumber(0, 100);
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence target dice ${targetDice}`);
                    if (targetDice > targetResult) {
                        targetResult = targetDice;
                    }
                }
                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence source result ${sourceResult}`);
                global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence target result ${targetResult}`);
                if (sourceResult >= targetResult) {
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence source win`);
                    return true;
                }
            }
            global.worker.log.info(`node ${this.loot.channel.node.name}, module steal, silence target win`);
            return false;
        });
    }
    //#endregion
    //#region Hero
    getHero() {
        return __awaiter(this, void 0, void 0, function* () {
            let heroes = yield this.loot.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } });
            const found = [];
            heroes = heroes.filter(x => x.getDataValue("hitpoints") > 0);
            for (const hero in heroes) {
                if ((yield this.getAdventures(heroes[hero])).length > 0) {
                    found.push(heroes[hero]);
                }
            }
            if (found.length > 0) {
                return found[this.loot.getRandomNumber(0, found.length - 1)];
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
                return yield this.loot.channel.database.sequelize.models.adventure.findAll();
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