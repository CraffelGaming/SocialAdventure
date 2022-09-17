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
const heroItem_1 = require("../model/heroItem");
const translationItem_1 = require("../model/translationItem");
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
        const loot = this.settings.find(x => x.command === "loot");
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (loot.isActive) {
                const date = new Date();
                global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} last run ${new Date(loot.lastRun)}...`);
                const timeDifference = Math.floor((date.getTime() - new Date(loot.lastRun).getTime()) / 60000);
                if (timeDifference >= loot.minutes) {
                    loot.lastRun = date;
                    loot.countRuns += 1;
                    yield this.channel.database.sequelize.models.loot.update(loot, { where: { command: loot.command } });
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} run after ${loot.minutes} Minutes.`);
                    this.channel.puffer.addMessage("loot executed");
                }
                else {
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} minutes: ${loot.minutes}`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} time elapsed: ${timeDifference}`);
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
                let value = yield this.channel.database.sequelize.models.hero.findByPk(command.source);
                if (!value) {
                    yield heroItem_1.HeroItem.put({ sequelize: this.channel.database.sequelize, element: new heroItem_1.HeroItem(command.source) });
                    value = (yield this.channel.database.sequelize.models.hero.findByPk(command.source));
                    isNew = true;
                }
                if (!value.getDataValue("isActive")) {
                    value.setDataValue("isActive", true);
                    value.setDataValue("lastJoin", new Date());
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
    //#region Statistics
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
    rank(command) {
        return 'rank';
    }
    lootstart(command) {
        return 'lootstart';
    }
    lootstop(command) {
        return 'lootstop';
    }
    lootclear(command) {
        return 'lootclear';
    }
    //#endregion
    //#region Blood
    blood(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero, { raw: true });
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                const date = new Date();
                const timeDifference = Math.floor((date.getTime() - new Date(item.lastBlood).getTime()) / 60000);
                if (timeDifference >= blood.minutes || item.blood < 1) {
                    const countHeroes = yield this.getCountActiveHeroes();
                    item.blood = this.getRandomNumber(1 + countHeroes, 10 + countHeroes);
                    item.lastBlood = date;
                    yield this.channel.database.sequelize.models.heroWallet.update(item, { where: { heroName: item.heroName } });
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroBlood').replace('$1', hero).replace('$2', blood.minutes.toString()).replace('$3', item.blood.toString());
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoBlood').replace('$1', hero).replace('$2', (blood.minutes - timeDifference).toString()).replace('$3', item.blood.toString());
            }
            else
                return translationItem_1.TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        });
    }
    bloodpoints(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const hero = this.getTargetHero(command);
            const item = yield this.channel.database.sequelize.models.heroWallet.findByPk(hero, { raw: true });
            if (item) {
                const blood = this.settings.find(x => x.command === "blood");
                const date = new Date();
                const timeDifference = Math.floor((date.getTime() - new Date(item.lastBlood).getTime()) / 60000);
                if (item.blood > 0 && timeDifference >= blood.minutes) {
                    item.blood = 0;
                    yield this.channel.database.sequelize.models.heroWallet.update(item, { where: { heroName: item.heroName } });
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNoBloodpoints').replace('$1', hero);
                }
                else
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroBloodpoints').replace('$1', hero).replace('$2', item.blood.toString()).replace('$3', (blood.minutes - timeDifference).toString());
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
            if (item && item.getDataValue("level") > 0) {
                return translationItem_1.TranslationItem.translate(this.translation, 'heroLevel').replace('$1', hero).replace('$2', item.getDataValue("level").toString());
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
    //#endregion
    //#region Random
    getRandomNumber(min, max) {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        global.worker.log.trace(`node ${this.channel.node.name}, new random number ${random} between ${min} and ${max}`);
        return random;
    }
}
exports.Loot = Loot;
//# sourceMappingURL=loot.js.map