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
const lootGive_1 = require("./lootGive");
const lootSearch_1 = require("./lootSearch");
const lootSteal_1 = require("./lootSteal");
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
            try {
                this.settings = (yield this.channel.database.sequelize.models.loot.findAll({ order: [['command', 'ASC']], raw: true }));
                this.automation();
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function InitializeLoot - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20000');
            }
        });
    }
    //#endregion
    //#region Execute
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace('loot execute');
                const loot = this.settings.find(x => x.command === "loot");
                const allowedCommand = this.commands.find(x => x.command === command.name);
                if (allowedCommand) {
                    if (!allowedCommand.isMaster || this.isOwner(command)) {
                        if (loot.isActive || allowedCommand.isMaster && this.isOwner(command)) {
                            return yield this[command.name](command);
                        }
                        else {
                            global.worker.log.trace(`module loot not active`);
                        }
                    }
                    else
                        global.worker.log.warn(`not owner dedection loot ${command.name} blocked`);
                }
                else {
                    global.worker.log.warn(`hack dedection loot ${command.name} blocked`);
                }
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function InitializeLoot - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20000');
            }
            return '';
        });
    }
    //#endregion
    //#region Automation
    automation() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                const loot = this.settings.find(x => x.command === "loot");
                if (loot.isActive) {
                    global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} last run ${new Date(loot.lastRun).toLocaleDateString()} ${new Date(loot.lastRun).toLocaleTimeString()}`);
                    if (this.isDateTimeoutExpiredMinutes(new Date(loot.lastRun), loot.minutes)) {
                        loot.lastRun = new Date();
                        loot.countRuns += 1;
                        yield this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                        global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} run after ${loot.minutes} Minutes.`);
                        const exploring = new lootExploring_1.LootExploring(this);
                        if (yield exploring.execute()) {
                            if (!exploring.isWinner) {
                                this.channel.puffer.addMessage(translationItem_1.TranslationItem.translate(this.translation, 'heroAdventureLoose')
                                    .replace('$1', exploring.hero.getDataValue("name"))
                                    .replace('$2', exploring.enemy.getDataValue("name")));
                            }
                            else {
                                this.channel.puffer.addMessage(translationItem_1.TranslationItem.translate(this.translation, 'heroAdventureVictory')
                                    .replace('$1', exploring.hero.getDataValue("name"))
                                    .replace('$2', exploring.dungeon.getDataValue("name"))
                                    .replace('$3', exploring.enemy.getDataValue("name"))
                                    .replace('$4', exploring.gold.toString())
                                    .replace('$5', exploring.experience.toString())
                                    .replace('$6', exploring.item.getDataValue("value"))
                                    .replace('$7', exploring.item.getDataValue("handle").toString()));
                            }
                            yield exploring.save();
                        }
                        else {
                            global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} not executed - missing exploring`);
                        }
                    }
                    else {
                        global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} not executed`);
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} minutes: ${loot.minutes}`);
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} time elapsed: ${this.getDateTimeoutRemainingMinutes(new Date(loot.lastRun), loot.minutes)}`);
                    }
                }
                else {
                    global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module loot not executed not active`);
                }
            }
            catch (ex) {
                global.worker.log.error(`node ${this.channel.node.getDataValue('name')}, module loot automation error.`);
                global.worker.log.error(`exception ${ex.message}`);
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
                const join = this.settings.find(x => x.command === "join");
                let value = yield this.channel.database.sequelize.models.hero.findByPk(command.source);
                if (!value) {
                    yield heroItem_1.HeroItem.put({ sequelize: this.channel.database.sequelize, element: new heroItem_1.HeroItem(command.source), onlyCreate: true });
                    value = (yield this.channel.database.sequelize.models.hero.findByPk(command.source));
                    isNew = true;
                }
                if (this.isDateTimeoutExpiredMinutes(value.getDataValue("lastJoin"), join.minutes) || join.isActive === false) {
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
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroTimeoutJoined').replace('$1', command.source).replace('$2', this.getDateTimeoutRemainingMinutes(value.getDataValue("lastJoin"), join.minutes).toString());
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function loot - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20001');
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
                global.worker.log.error(`module loot error - function leave - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20002');
            }
        });
    }
    //#endregion
    //#region Steal
    steal(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let steal;
                const setting = this.settings.find(x => x.command === "steal");
                if (command.parameters.length >= 1) {
                    const itemHandle = Number(command.parameters[0]);
                    if (!isNaN(itemHandle)) {
                        steal = new lootSteal_1.LootSteal(this, command.source, null, itemHandle);
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'stealParameterNumber').replace('$1', command.source);
                }
                else if (command.target.length > 0) {
                    steal = new lootSteal_1.LootSteal(this, command.source, command.target, null);
                }
                else {
                    steal = new lootSteal_1.LootSteal(this, command.source);
                }
                if (yield steal.execute(setting)) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItem')
                        .replace('$1', command.source)
                        .replace('$2', steal.targetHero.getDataValue("name"))
                        .replace('$3', steal.item.getDataValue("value"))
                        .replace('$4', steal.item.getDataValue("handle").toString());
                }
                else if (!steal.isActive) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealNotActive')
                        .replace('$1', command.source);
                }
                else if (!steal.isLoose) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemFailedLoose')
                        .replace('$1', command.source)
                        .replace('$2', steal.targetHero.getDataValue("name"))
                        .replace('$3', steal.item.getDataValue("value"))
                        .replace('$4', steal.item.getDataValue("handle").toString());
                }
                else if (!steal.isSteal) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemFailed')
                        .replace('$1', command.source)
                        .replace('$2', steal.targetHero.getDataValue("name"));
                }
                else if (!steal.isItem) {
                    if (!steal.isItemHero) {
                        return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoItemHero')
                            .replace('$1', command.source)
                            .replace('$2', command.target);
                    }
                    else if (!steal.isItemHeroes) {
                        return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoItemHeroes')
                            .replace('$1', command.source);
                    }
                    else {
                        return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoItem')
                            .replace('$1', command.source)
                            .replace('$2', command.parameters[0]);
                    }
                }
                else if (!steal.isSource) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoSource')
                        .replace('$1', command.source);
                }
                else if (!steal.isTimeout) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemTimeout')
                        .replace('$1', command.source)
                        .replace('$2', this.getDateTimeoutRemainingMinutes(steal.sourceHero.getDataValue("lastSteal"), setting.minutes).toString());
                }
                else if (!steal.isTarget) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoTarget')
                        .replace('$1', command.source)
                        .replace('$2', command.target);
                }
                else if (!steal.isAdventure) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealItemNoAdventure')
                        .replace('$1', command.source)
                        .replace('$2', steal.item.getDataValue("value"))
                        .replace('$3', steal.item.getDataValue("handle").toString());
                }
                else if (!steal.isSelf) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'stealSelf')
                        .replace('$1', command.source);
                }
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function steal - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20003');
            }
        });
    }
    //#endregion
    //#region Give
    give(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (command.parameters.length >= 1) {
                    const itemHandle = Number(command.parameters[0]);
                    if (!isNaN(itemHandle)) {
                        if (command.target.length > 0) {
                            const give = new lootGive_1.LootGive(this, command.source, command.target, itemHandle);
                            const setting = this.settings.find(x => x.command === "give");
                            if (yield give.execute(setting)) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItem')
                                    .replace('$1', command.source)
                                    .replace('$2', command.target)
                                    .replace('$3', give.item.getDataValue("value"))
                                    .replace('$4', give.item.getDataValue("handle").toString());
                            }
                            else if (!give.isActive) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveNotActive')
                                    .replace('$1', command.source);
                            }
                            else if (!give.isItem) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItemNoItem')
                                    .replace('$1', command.source)
                                    .replace('$2', command.parameters[0]);
                            }
                            else if (!give.isSource) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItemNoSource')
                                    .replace('$1', command.source);
                            }
                            else if (!give.isTimeout) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItemTimeout')
                                    .replace('$1', command.source)
                                    .replace('$2', this.getDateTimeoutRemainingMinutes(give.sourceHero.getDataValue("lastGive"), setting.minutes).toString());
                            }
                            else if (!give.isTarget) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItemNoTarget')
                                    .replace('$1', command.source)
                                    .replace('$2', command.target);
                            }
                            else if (!give.isAdventure) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveItemNoAdventure')
                                    .replace('$1', command.source)
                                    .replace('$2', give.item.getDataValue("value"))
                                    .replace('$3', give.item.getDataValue("handle").toString());
                            }
                            else if (!give.isSelf) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'giveSelf')
                                    .replace('$1', command.source);
                            }
                        }
                        else
                            return translationItem_1.TranslationItem.translate(this.translation, 'giveTargetNeeded').replace('$1', command.source);
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'giveParameterNumber').replace('$1', command.source);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'giveParameterNeeded').replace('$1', command.source);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function give - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20004');
            }
        });
    }
    //#endregion
    //#region Find
    find(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (command.parameters.length >= 1) {
                    const itemHandle = Number(command.parameters[0]);
                    if (!isNaN(itemHandle)) {
                        const search = new lootSearch_1.LootSearch(this, itemHandle);
                        if (yield search.execute()) {
                            return translationItem_1.TranslationItem.translate(this.translation, 'searchIsFound')
                                .replace('$1', command.source)
                                .replace('$2', search.item.getDataValue("value"))
                                .replace('$3', search.item.getDataValue("handle").toString())
                                .replace('$4', search.hero.getDataValue("name"));
                        }
                        else {
                            if (search.isFoundable) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'searchIsFoundable')
                                    .replace('$1', command.source)
                                    .replace('$2', search.item.getDataValue("value"))
                                    .replace('$3', search.item.getDataValue("handle").toString())
                                    .replace('$4', search.dungeons.map(a => a.getDataValue("name")).toString());
                            }
                            else if (search.isExists) {
                                return translationItem_1.TranslationItem.translate(this.translation, 'searchNotFoundable')
                                    .replace('$1', command.source)
                                    .replace('$2', search.item.getDataValue("value"))
                                    .replace('$3', search.item.getDataValue("handle").toString());
                            }
                            else {
                                return translationItem_1.TranslationItem.translate(this.translation, 'searchNotExists')
                                    .replace('$1', command.source)
                                    .replace('$2', itemHandle.toString());
                            }
                        }
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'searchParameterNumber').replace('$1', command.source);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'searchParameterNeeded').replace('$1', command.source);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function find - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20005');
            }
        });
    }
    //#endregion
    //#region Rank
    rank(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const gold = (yield this.channel.database.sequelize.query(this.getRankStatement(hero, "heroName", "heroWallet", "gold")))[0][0];
                const experience = (yield this.channel.database.sequelize.query(this.getRankStatement(hero, "name", "hero", "experience")))[0][0];
                return translationItem_1.TranslationItem.translate(this.translation, 'heroRank')
                    .replace('$1', hero)
                    .replace('$2', gold.rank)
                    .replace('$3', gold.gold)
                    .replace('$4', experience.rank)
                    .replace('$5', experience.experience);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function rank - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20006');
            }
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
    lootclear(command = null) {
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
                global.worker.log.error(`module loot error - function lootclear - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20007');
            }
        });
    }
    //#endregion
    //#region Start
    lootstart(command = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loot = this.settings.find(x => x.command === "loot");
                if (!loot.isActive) {
                    loot.isActive = true;
                    yield this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                    global.worker.log.trace(`module ${loot.command} set active: ${loot.isActive}`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "start");
                }
                else {
                    global.worker.log.trace(`module ${loot.command} already started.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStarted");
                }
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function lootstart - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20008');
            }
        });
    }
    //#endregion
    //#region Stop
    lootstop(command = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const loot = this.settings.find(x => x.command === "loot");
                if (loot.isActive) {
                    loot.isActive = false;
                    yield this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                    global.worker.log.trace(`module lootstop set active: ${loot.isActive}`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "stop");
                }
                else {
                    global.worker.log.trace(`module ${loot.command} already stopped.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStopped");
                }
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function lootstop - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20009');
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
                global.worker.log.error(`module loot error - function hitpoints - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20010');
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
                global.worker.log.error(`module loot error - function adventure - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20011');
            }
        });
    }
    //#endregion
    //#region Blood
    blood(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
                if (item) {
                    const blood = this.settings.find(x => x.command === "blood");
                    if (blood.isActive) {
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
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroBloodNotActive').replace('$1', hero);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function blood - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20012');
            }
        });
    }
    bloodpoints(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function bloodpoints - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20013');
            }
        });
    }
    //#endregion
    //#region Chest
    chest(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function chest - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20014');
            }
        });
    }
    //#endregion
    //#region Inventory
    inventory(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const items = yield this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                            model: this.channel.database.sequelize.models.hero,
                            as: 'hero',
                        }, {
                            model: this.channel.database.sequelize.models.item,
                            as: 'item',
                        }] });
                if (items && items.length > 0) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroItem').replace('$1', hero).replace('$2', items.map(a => a.getDataValue("item").getDataValue("value") + ' [' + a.getDataValue("item").getDataValue("handle") + ']').toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoItem').replace('$1', hero);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function inventory - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20015');
            }
        });
    }
    //#endregion
    //#region Level
    level(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function level - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20016');
            }
        });
    }
    //#endregion
    //#region Gold
    gold(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
                if (item && item.getDataValue("gold") > 0) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroGold').replace('$1', hero).replace('$2', item.getDataValue("gold").toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoGold').replace('$1', hero);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function gold - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20017');
            }
        });
    }
    //#endregion
    //#region Diamant
    diamond(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const hero = this.getTargetHero(command);
                const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero);
                if (item && item.getDataValue("diamond") > 0) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroDiamond').replace('$1', hero).replace('$2', item.getDataValue("diamond").toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoDiamond').replace('$1', hero);
            }
            catch (ex) {
                global.worker.log.error(`module loot error - function diamond - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20018');
            }
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
            return yield this.blood(command);
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