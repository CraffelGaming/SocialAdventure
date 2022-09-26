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
exports.Loot = void 0;
const sequelize_1 = require("sequelize");
const heroInventoryItem_1 = require("../model/heroInventoryItem");
const heroItem_1 = require("../model/heroItem");
const translationItem_1 = require("../model/translationItem");
const lootExploring_1 = require("./lootExploring");
const module_1 = require("./module");
class Loot extends module_1.Module {
    //#region Construct
    constructor(translation, channel) {
        super(translation, channel, 'loot');
    }
    //#endregion
    //#region Initialize
    InitializeLoot() {
        return __awaiter(this, void 0, void 0, function* () {
            this.settings = (yield this.channel.database.sequelize.models.loot.findAll({ order: [['command', 'ASC']], raw: true }));
            this.automation();
        });
    }
    //#endregion
    //#region Execute
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace('loot execute');
                const allowedCommand = this.commands.find(x => x.command === command.name);
                if (allowedCommand) {
                    if (!allowedCommand.isMaster || this.isOwner(command)) {
                        return yield this[command.name](command);
                    }
                    else
                        global.worker.log.warn(`not owner dedection loot ${command.name} blocked`);
                }
                else {
                    global.worker.log.warn(`hack dedection loot ${command.name} blocked`);
                }
            }
            catch (ex) {
                global.worker.log.error(`loot error - function execute - ${ex.message}`);
            }
            return '';
        });
    }
    //#endregion
    //#region Automation
    automation() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            const loot = this.settings.find(x => x.command === "loot");
            if (loot.isActive) {
                global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} last run ${new Date(loot.lastRun)}...`);
                if (this.isDateTimeoutExpiredMinutes(new Date(loot.lastRun), loot.minutes)) {
                    loot.lastRun = new Date();
                    loot.countRuns += 1;
                    yield this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} run after ${loot.minutes} Minutes.`);
                    const exploring = new lootExploring_1.LootExploring(this);
                    if (yield exploring.execute()) {
                        if (!exploring.isWinner) {
                            this.channel.puffer.addMessage(translationItem_1.TranslationItem.translate(this.translation, 'heroAdventureLoose')
                                .replace('$1', exploring.hero.getDataValue("name")));
                        }
                        else {
                            this.channel.puffer.addMessage(translationItem_1.TranslationItem.translate(this.translation, 'heroAdventureVictory')
                                .replace('$1', exploring.hero.getDataValue("name"))
                                .replace('$2', exploring.dungeon.getDataValue("name"))
                                .replace('$3', exploring.enemy.getDataValue("name"))
                                .replace('$4', exploring.gold.toString())
                                .replace('$5', exploring.experience.toString())
                                .replace('$6', exploring.item.getDataValue("value")));
                        }
                        yield exploring.save();
                    }
                    else {
                        global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed - missing exploring`);
                    }
                }
                else {
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} minutes: ${loot.minutes}`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} time elapsed: ${this.getDateTimeoutRemainingMinutes(new Date(loot.lastRun), loot.minutes)}`);
                }
            }
        }), 60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion
    //#region Join / Leave
    loot(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let isNew = false;
                const loot = this.settings.find(x => x.command === "loot");
                let value = yield this.channel.database.sequelize.models.hero.findByPk(command.source);
                if (!value) {
                    yield heroItem_1.HeroItem.put({ sequelize: this.channel.database.sequelize, element: new heroItem_1.HeroItem(command.source) });
                    value = (yield this.channel.database.sequelize.models.hero.findByPk(command.source));
                    isNew = true;
                }
                if (this.isDateTimeoutExpiredMinutes(value.getDataValue("lastJoin"), loot.minutes)) {
                    if (!value.getDataValue("isActive")) {
                        value.setDataValue("isActive", true);
                        value.setDataValue("lastJoin", new Date());
                        if (value.getDataValue("hitpoints") === 0) {
                            value.setDataValue("hitpoints", value.getDataValue("hitpointsMax") / 2);
                        }
                        yield value.save();
                        if (isNew) {
                            return translationItem_1.TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                        }
                        else
                            return translationItem_1.TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroTimeoutJoined').replace('$1', command.source).replace('$2', this.getDateTimeoutRemainingMinutes(value.getDataValue("lastJoin"), loot.minutes).toString());
            }
            catch (ex) {
                global.worker.log.error(`loot error - function loot - ${ex.message}`);
            }
        });
    }
    leave(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = yield this.channel.database.sequelize.models.hero.findByPk(command.source);
                if (hero !== undefined) {
                    if (hero.getDataValue("isActive") === true) {
                        hero.setDataValue("isActive", false);
                        const adventures = yield this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero.getDataValue("name") } });
                        for (const adventure in adventures) {
                            if (adventures[adventure]) {
                                heroInventoryItem_1.HeroInventoryItem.transferAdventureToInventory({ sequelize: this.channel.database.sequelize, adventure: adventures[adventure] });
                            }
                        }
                        yield hero.save();
                        return translationItem_1.TranslationItem.translate(this.translation, 'heroLeave').replace('$1', command.source);
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'heroNotJoined').replace('$1', command.source);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNotExists').replace('$1', command.source);
            }
            catch (ex) {
                global.worker.log.error(`loot error - function leave - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Commands
    steal(command) {
        return 'steal';
    }
    give(command) {
        return 'give';
    }
    find(command) {
        return 'find';
    }
    //#endregion
    //#region Rank
    rank(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const gold = (yield this.channel.database.sequelize.query(this.getRankStatement(hero, "heroName", "heroWallet", "gold")))[0][0];
            const experience = (yield this.channel.database.sequelize.query(this.getRankStatement(hero, "name", "hero", "experience")))[0][0];
            return translationItem_1.TranslationItem.translate(this.translation, 'heroRank')
                .replace('$1', hero)
                .replace('$2', gold.rank)
                .replace('$3', gold.gold)
                .replace('$4', experience.rank)
                .replace('$5', experience.experience);
        });
    }
    getRankStatement(hero, heroColumn, table, column) {
        return "SELECT rank, " + column + ", " + heroColumn + " FROM (" +
            "    SELECT" +
            "        ROW_NUMBER () OVER ( " +
            "            ORDER BY " + column + " DESC" +
            "        ) rank," + column + ", " + heroColumn +
            "    FROM " + table +
            " ) t" +
            " WHERE " + heroColumn + " = '" + hero + "'";
    }
    //#endregion
    //#region Clear
    lootclear(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const heroes = yield this.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } });
                for (const hero in heroes) {
                    if (heroes[hero] !== undefined) {
                        heroes[hero].setDataValue("isActive", false);
                        const adventures = yield this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: heroes[hero].getDataValue("name") } });
                        for (const adventure in adventures) {
                            if (adventures[adventure]) {
                                heroInventoryItem_1.HeroInventoryItem.transferAdventureToInventory({ sequelize: this.channel.database.sequelize, adventure: adventures[adventure] });
                            }
                        }
                        yield heroes[hero].save();
                    }
                }
                return translationItem_1.TranslationItem.translate(this.translation, "cleared");
            }
            catch (ex) {
                global.worker.log.error(`loot error - function leave - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Start
    lootstart(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const loot = this.settings.find(x => x.command === "loot");
            if (!loot.isActive) {
                loot.isActive = true;
                yield this.channel.database.sequelize.models.say.update(loot, { where: { command: loot.command } });
                global.worker.log.trace(`module ${loot.command} set active: ${loot.isActive}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                global.worker.log.trace(`module ${loot.command} already started.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        });
    }
    //#endregion
    //#region Stop
    lootstop(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const loot = this.settings.find(x => x.command === "loot");
            if (loot.isActive) {
                loot.isActive = false;
                yield this.channel.database.sequelize.models.say.update(loot, { where: { command: loot.command } });
                global.worker.log.trace(`module lootstop set active: ${loot.isActive}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                global.worker.log.trace(`module ${loot.command} already stopped.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        });
    }
    //#endregion
    //#region Hitpoints
    hitpoints(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const item = yield this.channel.database.sequelize.models.hero.findByPk(hero);
                if (item) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroHitpoints').replace('$1', hero).replace('$2', item.getDataValue("hitpoints").toString()).replace('$3', item.getDataValue("hitpointsMax").toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
            }
            catch (ex) {
                global.worker.log.error(`loot error - function hitpoints - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Adventure
    adventure(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const count = yield this.channel.database.sequelize.models.hero.count({ where: { isActive: true } });
                global.worker.log.trace(`loot adventure - count - ${count}`);
                return translationItem_1.TranslationItem.translate(this.translation, 'heroCount').replace('$1', count.toString());
            }
            catch (ex) {
                global.worker.log.error(`loot error - function adventure - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Blood
    blood(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                if (this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes) || item.getDataValue("blood") < 1) {
                    const countHeroes = yield this.getCountActiveHeroes();
                    item.setDataValue("blood", this.getRandomNumber(1 + countHeroes, 10 + countHeroes));
                    item.setDataValue("lastBlood", new Date());
                    yield item.save();
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroBlood').replace('$1', hero).replace('$2', blood.minutes.toString()).replace('$3', item.getDataValue("blood").toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoBlood').replace('$1', hero).replace('$2', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString()).replace('$3', item.getDataValue("blood").toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        });
    }
    bloodpoints(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                if (item.getDataValue("blood") > 0 && this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes)) {
                    item.setDataValue("blood", 0);
                    yield item.save();
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoBloodpoints').replace('$1', hero);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroBloodpoints').replace('$1', hero).replace('$2', item.getDataValue("blood").toString()).replace('$3', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        });
    }
    //#endregion
    //#region Chest
    chest(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            let count = 0;
            for (const item of Object.values(yield this.channel.database.sequelize.models.heroInventory.findAll({ where: { heroName: hero }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']] }))) {
                count += item.quantity;
            }
            if (count > 0) {
                return translationItem_1.TranslationItem.translate(this.translation, 'heroChest').replace('$1', hero).replace('$2', count.toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroNoChest').replace('$1', hero);
        });
    }
    //#endregion
    //#region Inventory
    inventory(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const items = yield this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: this.channel.database.sequelize.models.hero,
                        as: 'hero',
                    }, {
                        model: this.channel.database.sequelize.models.item,
                        as: 'item',
                    }] });
            if (items && items.length > 0) {
                return translationItem_1.TranslationItem.translate(this.translation, 'heroItem').replace('$1', hero).replace('$2', items.map(a => a.getDataValue("item").getDataValue("value")).toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroNoItem').replace('$1', hero);
        });
    }
    //#endregion
    //#region Level
    level(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.hero.findByPk(hero);
            if (item) {
                const level = yield this.channel.database.sequelize.models.level.findOne({
                    where: { experienceMin: { [sequelize_1.Op.lte]: item.getDataValue("experience") },
                        experienceMax: { [sequelize_1.Op.gte]: item.getDataValue("experience") }
                    }
                });
                if (level) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroLevel').replace('$1', hero).replace('$2', level.getDataValue("handle").toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        });
    }
    //#endregion
    //#region Gold
    gold(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item && item.getDataValue("gold") > 0) {
                return translationItem_1.TranslationItem.translate(this.translation, 'heroGold').replace('$1', hero).replace('$2', item.getDataValue("gold").toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroNoGold').replace('$1', hero);
        });
    }
    //#endregion
    //#region Diamant
    diamond(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item && item.getDataValue("diamond") > 0) {
                return translationItem_1.TranslationItem.translate(this.translation, 'heroDiamond').replace('$1', hero).replace('$2', item.getDataValue("diamond").toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroNoDiamond').replace('$1', hero);
        });
    }
    //#endregion
    //#region Shortcuts
    hp(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.hitpoints(command);
        });
    }
    inv(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.inventory(command);
        });
    }
    lvl(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.level(command);
        });
    }
    blut(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.level(command);
        });
    }
    //#endregion
    //#region Hero
    getTargetHero(command) {
        let hero = command.source;
        if (command.target && command.target.length > 0)
            hero = command.target;
        return hero;
    }
    getCountActiveHeroes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.channel.database.sequelize.models.hero.count({ where: { isActive: true } });
            ;
        });
    }
}
exports.Loot = Loot;
//# sourceMappingURL=loot.js.map