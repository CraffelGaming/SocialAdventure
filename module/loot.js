import { Op } from "sequelize";
import { HealingPotionItem } from "../model/healingPotionItem.js";
import { HeroInventoryItem } from "../model/heroInventoryItem.js";
import { HeroItem } from "../model/heroItem.js";
import { TranslationItem } from "../model/translationItem.js";
import { LootExploring } from "./lootExploring.js";
import { LootGive } from "./lootGive.js";
import { LootSearch } from "./lootSearch.js";
import { LootSteal } from "./lootSteal.js";
import { Module } from "./module.js";
export class Loot extends Module {
    //#region Construct
    constructor(translation, channel) {
        super(translation, channel, 'loot');
    }
    //#endregion
    //#region Initialize
    async InitializeLoot() {
        try {
            this.settings = await this.channel.database.sequelize.models.loot.findAll({ order: [['command', 'ASC']], raw: true });
            this.automation();
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function InitializeLoot - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20000');
        }
    }
    //#endregion
    //#region Execute
    async execute(command) {
        try {
            global.worker.log.trace('loot execute');
            const loot = this.settings.find(x => x.command === "loot");
            const allowedCommand = this.commands.find(x => x.command === command.name);
            if (allowedCommand) {
                const isAllowed = !allowedCommand.isMaster && !allowedCommand.isModerator || this.isOwner(command) || allowedCommand.isModerator && this.isModerator(command);
                if (isAllowed) {
                    if (loot.isActive || isAllowed) {
                        return await this[command.name](command);
                    }
                    else {
                        global.worker.log.trace(`module loot not active`);
                    }
                }
                else
                    global.worker.log.warn(`not owner dedection loot ${command.name} blocked`);
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function InitializeLoot - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20000');
        }
        return '';
    }
    //#endregion
    //#region Automation
    automation() {
        this.timer = setInterval(async () => {
            try {
                const loot = this.settings.find(x => x.command === "loot");
                if (loot.isActive) {
                    global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} last run ${new Date(loot.lastRun).toLocaleDateString()} ${new Date(loot.lastRun).toLocaleTimeString()}`);
                    if (this.isDateTimeoutExpiredMinutes(new Date(loot.lastRun), loot.minutes)) {
                        loot.lastRun = new Date();
                        loot.countRuns += 1;
                        await this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                        global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${loot.command} run after ${loot.minutes} Minutes.`);
                        const exploring = new LootExploring(this);
                        if (await exploring.execute()) {
                            if (!exploring.isWinner) {
                                this.channel.puffer.addMessage(TranslationItem.translate(this.translation, 'heroAdventureLoose')
                                    .replace('$1', exploring.hero.getDataValue("name"))
                                    .replace('$2', exploring.enemy.getDataValue("name")));
                            }
                            else {
                                this.channel.puffer.addMessage(TranslationItem.translate(this.translation, 'heroAdventureVictory')
                                    .replace('$1', exploring.hero.getDataValue("name"))
                                    .replace('$2', exploring.dungeon.getDataValue("name"))
                                    .replace('$3', exploring.enemy.getDataValue("name"))
                                    .replace('$4', exploring.gold.toString())
                                    .replace('$5', exploring.experience.toString())
                                    .replace('$6', exploring.item.getDataValue("value"))
                                    .replace('$7', exploring.item.getDataValue("handle").toString()));
                            }
                            await exploring.save();
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
        }, 60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion
    //#region Join / Leave
    async loot(command) {
        try {
            let isNew = false;
            const join = this.settings.find(x => x.command === "join");
            let hero = await this.channel.database.sequelize.models.hero.findByPk(command.source);
            if (!hero) {
                await HeroItem.put({ sequelize: this.channel.database.sequelize, element: new HeroItem(command.source), onlyCreate: true });
                hero = await this.channel.database.sequelize.models.hero.findByPk(command.source);
                isNew = true;
            }
            if (this.isDateTimeoutExpiredMinutes(hero.getDataValue("lastLeave"), join.minutes) || join.isActive === false) {
                if (!hero.getDataValue("isActive")) {
                    hero.setDataValue("isActive", true);
                    hero.setDataValue("lastJoin", new Date());
                    if (hero.getDataValue("hitpoints") < hero.getDataValue("hitpointsMax") / 2) {
                        hero.setDataValue("hitpoints", hero.getDataValue("hitpointsMax") / 2);
                    }
                    await hero.save();
                    if (isNew) {
                        return TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                    }
                    else
                        return TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);
                }
                else
                    return TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
            }
            else
                return TranslationItem.translate(this.translation, 'heroTimeoutJoined').replace('$1', command.source).replace('$2', this.getDateTimeoutRemainingMinutes(hero.getDataValue("lastLeave"), join.minutes).toString());
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function loot - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20001');
        }
    }
    async leave(command) {
        try {
            const hero = await this.channel.database.sequelize.models.hero.findByPk(command.source);
            if (hero !== undefined) {
                if (hero.getDataValue("isActive") === true) {
                    hero.setDataValue("isActive", false);
                    hero.setDataValue("lastLeave", new Date());
                    const adventures = await this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero.getDataValue("name") } });
                    for (const adventure in adventures) {
                        if (adventures[adventure]) {
                            HeroInventoryItem.transferAdventureToInventory({ sequelize: this.channel.database.sequelize, adventure: adventures[adventure] });
                        }
                    }
                    await hero.save();
                    return TranslationItem.translate(this.translation, 'heroLeave').replace('$1', command.source);
                }
                else
                    return TranslationItem.translate(this.translation, 'heroNotJoined').replace('$1', command.source);
            }
            else
                return TranslationItem.translate(this.translation, 'heroNotExists').replace('$1', command.source);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function leave - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20002');
        }
    }
    //#endregion
    //#region Steal
    async steal(command) {
        try {
            let steal;
            const setting = this.settings.find(x => x.command === "steal");
            if (command.parameters.length >= 1) {
                steal = new LootSteal(this, command.source, null, command.parameters.join(' '));
            }
            else if (command.target.length > 0) {
                steal = new LootSteal(this, command.source, command.target, null);
            }
            else {
                steal = new LootSteal(this, command.source);
            }
            if (await steal.execute(setting)) {
                return TranslationItem.translate(this.translation, 'stealItem')
                    .replace('$1', command.source)
                    .replace('$2', steal.targetHero.getDataValue("name"))
                    .replace('$3', steal.item.getDataValue("value"))
                    .replace('$4', steal.item.getDataValue("handle").toString());
            }
            else if (!steal.isActive) {
                return TranslationItem.translate(this.translation, 'stealNotActive')
                    .replace('$1', command.source);
            }
            else if (!steal.isLoose) {
                return TranslationItem.translate(this.translation, 'stealItemFailedLoose')
                    .replace('$1', command.source)
                    .replace('$2', steal.targetHero.getDataValue("name"))
                    .replace('$3', steal.item.getDataValue("value"))
                    .replace('$4', steal.item.getDataValue("handle").toString());
            }
            else if (!steal.isSteal) {
                return TranslationItem.translate(this.translation, 'stealItemFailed')
                    .replace('$1', command.source)
                    .replace('$2', steal.targetHero.getDataValue("name"));
            }
            else if (!steal.isItem) {
                if (!steal.isItemHero) {
                    return TranslationItem.translate(this.translation, 'stealItemNoItemHero')
                        .replace('$1', command.source)
                        .replace('$2', command.target);
                }
                else if (!steal.isItemHeroes) {
                    return TranslationItem.translate(this.translation, 'stealItemNoItemHeroes')
                        .replace('$1', command.source);
                }
                else {
                    return TranslationItem.translate(this.translation, 'stealItemNoItem')
                        .replace('$1', command.source)
                        .replace('$2', command.parameters[0]);
                }
            }
            else if (!steal.isSource) {
                return TranslationItem.translate(this.translation, 'stealItemNoSource')
                    .replace('$1', command.source);
            }
            else if (!steal.isTimeout) {
                return TranslationItem.translate(this.translation, 'stealItemTimeout')
                    .replace('$1', command.source)
                    .replace('$2', this.getDateTimeoutRemainingMinutes(steal.sourceHero.getDataValue("lastSteal"), setting.minutes).toString());
            }
            else if (!steal.isTarget) {
                return TranslationItem.translate(this.translation, 'stealItemNoTarget')
                    .replace('$1', command.source)
                    .replace('$2', command.target);
            }
            else if (!steal.isAdventure) {
                return TranslationItem.translate(this.translation, 'stealItemNoAdventure')
                    .replace('$1', command.source)
                    .replace('$2', steal.item.getDataValue("value"))
                    .replace('$3', steal.item.getDataValue("handle").toString());
            }
            else if (!steal.isSelf) {
                return TranslationItem.translate(this.translation, 'stealSelf')
                    .replace('$1', command.source);
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function steal - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20003');
        }
    }
    //#endregion
    //#region Give
    async give(command) {
        try {
            if (command.parameters.length >= 1) {
                if (command.target.length > 0) {
                    const give = new LootGive(this, command.source, command.target, command.parameters.join(' '));
                    const setting = this.settings.find(x => x.command === "give");
                    if (await give.execute(setting)) {
                        return TranslationItem.translate(this.translation, 'giveItem')
                            .replace('$1', command.source)
                            .replace('$2', command.target)
                            .replace('$3', give.item.getDataValue("value"))
                            .replace('$4', give.item.getDataValue("handle").toString());
                    }
                    else if (!give.isActive) {
                        return TranslationItem.translate(this.translation, 'giveNotActive')
                            .replace('$1', command.source);
                    }
                    else if (!give.isItem) {
                        return TranslationItem.translate(this.translation, 'giveItemNoItem')
                            .replace('$1', command.source)
                            .replace('$2', command.parameters[0]);
                    }
                    else if (!give.isSource) {
                        return TranslationItem.translate(this.translation, 'giveItemNoSource')
                            .replace('$1', command.source);
                    }
                    else if (!give.isTimeout) {
                        return TranslationItem.translate(this.translation, 'giveItemTimeout')
                            .replace('$1', command.source)
                            .replace('$2', this.getDateTimeoutRemainingMinutes(give.sourceHero.getDataValue("lastGive"), setting.minutes).toString());
                    }
                    else if (!give.isTarget) {
                        return TranslationItem.translate(this.translation, 'giveItemNoTarget')
                            .replace('$1', command.source)
                            .replace('$2', command.target);
                    }
                    else if (!give.isAdventure) {
                        return TranslationItem.translate(this.translation, 'giveItemNoAdventure')
                            .replace('$1', command.source)
                            .replace('$2', give.item.getDataValue("value"))
                            .replace('$3', give.item.getDataValue("handle").toString());
                    }
                    else if (!give.isSelf) {
                        return TranslationItem.translate(this.translation, 'giveSelf')
                            .replace('$1', command.source);
                    }
                }
                else
                    return TranslationItem.translate(this.translation, 'giveTargetNeeded').replace('$1', command.source);
            }
            else
                return TranslationItem.translate(this.translation, 'giveParameterNeeded').replace('$1', command.source);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function give - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20004');
        }
    }
    //#endregion
    //#region Find
    async find(command) {
        try {
            if (command.parameters.length >= 1) {
                const search = new LootSearch(this, command.parameters.join(' '));
                if (await search.execute()) {
                    return TranslationItem.translate(this.translation, 'searchIsFound')
                        .replace('$1', command.source)
                        .replace('$2', search.item.getDataValue("value"))
                        .replace('$3', search.item.getDataValue("handle").toString())
                        .replace('$4', search.hero.getDataValue("name"));
                }
                else {
                    if (search.isFoundable) {
                        return TranslationItem.translate(this.translation, 'searchIsFoundable')
                            .replace('$1', command.source)
                            .replace('$2', search.item.getDataValue("value"))
                            .replace('$3', search.item.getDataValue("handle").toString())
                            .replace('$4', search.dungeons.map(a => a.getDataValue("name")).toString());
                    }
                    else if (search.isExists) {
                        return TranslationItem.translate(this.translation, 'searchNotFoundable')
                            .replace('$1', command.source)
                            .replace('$2', search.item.getDataValue("value"))
                            .replace('$3', search.item.getDataValue("handle").toString());
                    }
                    else {
                        return TranslationItem.translate(this.translation, 'searchNotExists')
                            .replace('$1', command.source)
                            .replace('$2', command.parameters[0]);
                    }
                }
            }
            else
                return TranslationItem.translate(this.translation, 'searchParameterNeeded').replace('$1', command.source);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function find - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20005');
        }
    }
    //#endregion
    //#region Rank
    async rank(command) {
        try {
            const hero = this.getTargetHero(command);
            const gold = (await this.channel.database.sequelize.query(this.getRankStatement(hero, "heroName", "heroWallet", "gold")))[0][0];
            const experience = (await this.channel.database.sequelize.query(this.getRankStatement(hero, "name", "hero", "experience")))[0][0];
            if (gold != null && experience != null) {
                return TranslationItem.translate(this.translation, 'heroRank')
                    .replace('$1', hero)
                    .replace('$2', gold.rank)
                    .replace('$3', gold.gold)
                    .replace('$4', experience.rank)
                    .replace('$5', experience.experience);
            }
            else {
                return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function rank - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20006');
        }
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
    async lootclear(command = null) {
        try {
            const heroes = await this.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } });
            if (heroes != null) {
                for (const hero of heroes) {
                    if (hero !== null && hero !== undefined) {
                        hero.setDataValue("isActive", false);
                        await hero.save();
                    }
                }
            }
            const adventures = await this.channel.database.sequelize.models.adventure.findAll();
            if (adventures != null) {
                for (const adventure of adventures) {
                    if (adventure !== null && adventure !== undefined) {
                        await HeroInventoryItem.transferAdventureToInventory({ sequelize: this.channel.database.sequelize, adventure });
                    }
                }
            }
            return TranslationItem.translate(this.translation, "cleared");
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function lootclear - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20007');
        }
    }
    //#endregion
    //#region Start
    async lootstart(command = null) {
        try {
            const loot = this.settings.find(x => x.command === "loot");
            if (!loot.isActive) {
                loot.isActive = true;
                await this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                global.worker.log.trace(`module ${loot.command} set active: ${loot.isActive}`);
                return TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                global.worker.log.trace(`module ${loot.command} already started.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function lootstart - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20008');
        }
    }
    //#endregion
    //#region Stop
    async lootstop(command = null) {
        try {
            const loot = this.settings.find(x => x.command === "loot");
            if (loot.isActive) {
                loot.isActive = false;
                await this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                global.worker.log.trace(`module lootstop set active: ${loot.isActive}`);
                return TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                global.worker.log.trace(`module ${loot.command} already stopped.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function lootstop - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20009');
        }
    }
    //#endregion
    //#region Hitpoints
    async hitpoints(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.hero.findByPk(hero);
            if (item) {
                return TranslationItem.translate(this.translation, 'heroHitpoints').replace('$1', hero).replace('$2', item.getDataValue("hitpoints").toString()).replace('$3', item.getDataValue("hitpointsMax").toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function hitpoints - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20010');
        }
    }
    //#endregion
    //#region Adventure
    async adventure(command) {
        try {
            const count = await this.channel.database.sequelize.models.hero.count({ where: { isActive: true } });
            global.worker.log.trace(`loot adventure - count - ${count}`);
            return TranslationItem.translate(this.translation, 'heroCount').replace('$1', count.toString());
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function adventure - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20011');
        }
    }
    //#endregion
    //#region Blood
    async blood(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                if (blood.isActive) {
                    if (this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes) || item.getDataValue("blood") < 1) {
                        const countHeroes = await this.getCountActiveHeroes();
                        item.setDataValue("blood", this.getRandomNumber(1 + countHeroes, 10 + countHeroes));
                        item.setDataValue("lastBlood", new Date());
                        await item.save();
                        return TranslationItem.translate(this.translation, 'heroBlood').replace('$1', hero).replace('$2', blood.minutes.toString()).replace('$3', item.getDataValue("blood").toString());
                    }
                    else
                        return TranslationItem.translate(this.translation, 'heroNoBlood').replace('$1', hero).replace('$2', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString()).replace('$3', item.getDataValue("blood").toString());
                }
                return TranslationItem.translate(this.translation, 'heroBloodNotActive').replace('$1', hero);
            }
            else
                return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function blood - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20012');
        }
    }
    async bloodpoints(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                if (item.getDataValue("blood") > 0 && this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes)) {
                    item.setDataValue("blood", 0);
                    await item.save();
                    return TranslationItem.translate(this.translation, 'heroNoBloodpoints').replace('$1', hero);
                }
                else
                    return TranslationItem.translate(this.translation, 'heroBloodpoints').replace('$1', hero).replace('$2', item.getDataValue("blood").toString()).replace('$3', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function bloodpoints - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20013');
        }
    }
    //#endregion
    //#region Chest
    async chest(command) {
        try {
            const hero = this.getTargetHero(command);
            let count = 0;
            for (const item of Object.values(await this.channel.database.sequelize.models.heroInventory.findAll({ where: { heroName: hero }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']] }))) {
                count += item.quantity;
            }
            if (count > 0) {
                return TranslationItem.translate(this.translation, 'heroChest').replace('$1', hero).replace('$2', count.toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroNoChest').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function chest - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20014');
        }
    }
    //#endregion
    //#region Inventory
    async inventory(command) {
        try {
            const hero = this.getTargetHero(command);
            const items = await this.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: this.channel.database.sequelize.models.hero,
                        as: 'hero',
                    }, {
                        model: this.channel.database.sequelize.models.item,
                        as: 'item',
                    }] });
            if (items && items.length > 0) {
                return TranslationItem.translate(this.translation, 'heroItem').replace('$1', hero).replace('$2', items.map(a => a.getDataValue("item").getDataValue("value") + ' [' + a.getDataValue("item").getDataValue("handle") + ']').toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroNoItem').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function inventory - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20015');
        }
    }
    //#endregion
    //#region Level
    async level(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.hero.findByPk(hero);
            if (item) {
                const level = await this.channel.database.sequelize.models.level.findOne({
                    where: { experienceMin: { [Op.lte]: item.getDataValue("experience") },
                        experienceMax: { [Op.gte]: item.getDataValue("experience") }
                    }
                });
                if (level) {
                    return TranslationItem.translate(this.translation, 'heroLevel')
                        .replace('$1', hero)
                        .replace('$2', level.getDataValue("handle").toString())
                        .replace('$3', item.getDataValue("prestige").toString());
                }
                else
                    return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
            }
            else
                return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function level - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20016');
        }
    }
    //#endregion
    //#region Gold
    async gold(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item && item.getDataValue("gold") > 0) {
                return TranslationItem.translate(this.translation, 'heroGold').replace('$1', hero).replace('$2', item.getDataValue("gold").toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroNoGold').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function gold - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20017');
        }
    }
    //#endregion
    //#region Heal
    async heal(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.hero.findByPk(hero);
            const wallet = await this.channel.database.sequelize.models.heroWallet.findByPk(command.source);
            const potions = await this.channel.database.sequelize.models.healingPotion.findAll();
            let potion;
            const percent = 100 / item.getDataValue("hitpointsMax") * item.getDataValue("hitpoints");
            if (wallet != null) {
                if (percent <= 80 && percent > 60) {
                    potion = potions.find(x => x.getDataValue("percent") === 25 && x.getDataValue("isRevive") === false);
                }
                else if (percent <= 60 && percent > 40) {
                    potion = potions.find(x => x.getDataValue("percent") === 50 && x.getDataValue("isRevive") === false);
                }
                else if (percent <= 40 && percent > 10) {
                    potion = potions.find(x => x.getDataValue("percent") === 75 && x.getDataValue("isRevive") === false);
                }
                else if (percent <= 10 && percent > 0) {
                    potion = potions.find(x => x.getDataValue("percent") === 100 && x.getDataValue("isRevive") === false);
                }
                else if (percent <= 0) {
                    if (wallet.getDataValue("gold") >= potions.find(x => x.getDataValue("percent") === 100 && x.getDataValue("isRevive") === true).getDataValue("gold")) {
                        potion = potions.find(x => x.getDataValue("percent") === 100 && x.getDataValue("isRevive") === true);
                    }
                    else {
                        potion = potions.find(x => x.getDataValue("percent") === 0 && x.getDataValue("isRevive") === true);
                    }
                }
                if (potion && !potion.getDataValue("isRevive")) {
                    return await this.healHero(command, potion, item, wallet);
                }
                else if (potion && potion.getDataValue("isRevive")) {
                    return await this.reviveHero(command, potion, item, wallet);
                }
                else {
                    if (wallet.getDataValue("heroName") === item.getDataValue("name")) {
                        return TranslationItem.translate(this.translation, 'healNo')
                            .replace('$1', wallet.getDataValue("heroName"))
                            .replace('$2', item.getDataValue("hitpoints").toString())
                            .replace('$3', item.getDataValue("hitpointsMax").toString());
                    }
                    else {
                        return TranslationItem.translate(this.translation, 'healNoOther')
                            .replace('$1', wallet.getDataValue("heroName"))
                            .replace('$2', item.getDataValue("hitpoints").toString())
                            .replace('$3', item.getDataValue("hitpointsMax").toString())
                            .replace('$4', item.getDataValue("name").toString());
                    }
                }
            }
            else {
                return TranslationItem.translate(this.translation, 'heroNotJoined').replace('$1', command.source);
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function heal - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20019');
        }
    }
    async healHero(command, potion, hero, wallet) {
        let message;
        try {
            if (wallet.getDataValue("gold") >= potion.getDataValue("gold")) {
                await HealingPotionItem.heal({ sequelize: this.channel.database.sequelize, healingPotionHandle: potion.getDataValue("handle").toString(), heroName: hero.getDataValue("name"), bonus: hero.getDataValue("name") !== wallet.getDataValue("heroName") });
                hero = await this.channel.database.sequelize.models.hero.findByPk(hero.getDataValue("name"));
                if (wallet.getDataValue("heroName") === hero.getDataValue("name")) {
                    message = TranslationItem.translate(this.translation, 'healYes')
                        .replace('$1', wallet.getDataValue("heroName"))
                        .replace('$2', potion.getDataValue("value"))
                        .replace('$3', hero.getDataValue("hitpoints").toString())
                        .replace('$4', hero.getDataValue("hitpointsMax").toString());
                }
                else {
                    message = TranslationItem.translate(this.translation, 'healYesOther')
                        .replace('$1', wallet.getDataValue("heroName"))
                        .replace('$2', potion.getDataValue("value"))
                        .replace('$3', hero.getDataValue("hitpoints").toString())
                        .replace('$4', hero.getDataValue("hitpointsMax").toString())
                        .replaceAll('$5', hero.getDataValue("name"));
                }
            }
            else {
                if (wallet.getDataValue("heroName") === hero.getDataValue("name")) {
                    message = TranslationItem.translate(this.translation, 'healNoMoney')
                        .replace('$1', wallet.getDataValue("heroName"))
                        .replace('$2', wallet.getDataValue("gold").toString())
                        .replace('$3', potion.getDataValue("gold").toString());
                }
                else {
                    message = TranslationItem.translate(this.translation, 'healNoMoneyOther').replace('$1', wallet.getDataValue("heroName"))
                        .replace('$2', wallet.getDataValue("gold").toString())
                        .replace('$3', potion.getDataValue("gold").toString())
                        .replace('$4', hero.getDataValue("name"));
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function healHero - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20020');
        }
        return message;
    }
    async reviveHero(command, potion, hero, wallet) {
        let message;
        try {
            await HealingPotionItem.heal({ sequelize: this.channel.database.sequelize, healingPotionHandle: potion.getDataValue("handle").toString(), heroName: hero.getDataValue("name"), bonus: hero.getDataValue("name") !== wallet.getDataValue("heroName") });
            hero = await this.channel.database.sequelize.models.hero.findByPk(hero.getDataValue("name"));
            if (wallet.getDataValue("heroName") === hero.getDataValue("name")) {
                message = TranslationItem.translate(this.translation, 'healRevive')
                    .replace('$1', wallet.getDataValue("heroName"))
                    .replace('$2', potion.getDataValue("value"))
                    .replace('$3', hero.getDataValue("hitpoints").toString())
                    .replace('$4', hero.getDataValue("hitpointsMax").toString());
            }
            else {
                message = TranslationItem.translate(this.translation, 'healReviveOther')
                    .replace('$1', wallet.getDataValue("heroName"))
                    .replace('$2', potion.getDataValue("value"))
                    .replace('$3', hero.getDataValue("hitpoints").toString())
                    .replace('$4', hero.getDataValue("hitpointsMax").toString())
                    .replaceAll('$5', hero.getDataValue("name"));
            }
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function reviveHero - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20021');
        }
        return message;
    }
    //#endregion
    //#region Diamant
    async diamond(command) {
        try {
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);
            if (item && item.getDataValue("diamond") > 0) {
                return TranslationItem.translate(this.translation, 'heroDiamond').replace('$1', hero).replace('$2', item.getDataValue("diamond").toString());
            }
            else
                return TranslationItem.translate(this.translation, 'heroNoDiamond').replace('$1', hero);
        }
        catch (ex) {
            global.worker.log.error(`module loot error - function diamond - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-20018');
        }
    }
    //#endregion
    //#region Shortcuts
    async hp(command) {
        return await this.hitpoints(command);
    }
    async inv(command) {
        return await this.inventory(command);
    }
    async lvl(command) {
        return await this.level(command);
    }
    async blut(command) {
        return await this.blood(command);
    }
    //#endregion
    //#region Hero
    getTargetHero(command) {
        let hero = command.source;
        if (command.target && command.target.length > 0)
            hero = command.target;
        return hero;
    }
    async getCountActiveHeroes() {
        return await this.channel.database.sequelize.models.hero.count({ where: { isActive: true } });
        ;
    }
}
//# sourceMappingURL=loot.js.map