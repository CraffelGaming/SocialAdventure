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
const translationItem_1 = require("../model/translationItem");
const module_1 = require("./module");
class Loot extends module_1.Module {
    //#region Construct
    constructor(translation, channel) {
        super(translation, channel, 'loot');
        this.automation();
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
            global.worker.log.info(`node ${this.channel.node.name}, module loot run automtion Minutes.`);
            this.channel.puffer.addMessage("loot executed");
        }), 600000 // Alle 10 Minuten
        );
    }
    //#endregion
    //#region Join / Leave
    loot(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const value = yield this.channel.database.sequelize.models.hero.findOrCreate({
                    defaults: { isActive: true, lastJoin: new Date() },
                    where: { name: command.source }
                });
                if (value[1]) {
                    return translationItem_1.TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                }
                else {
                    if (!value[0].getDataValue("isActive")) {
                        value[0].setDataValue("isActive", true);
                        value[0].setDataValue("lastJoin", new Date());
                        yield value[0].save();
                        return translationItem_1.TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);
                    }
                    else
                        return translationItem_1.TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
                }
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
    inventory(command) {
        return 'inventory';
    }
    steal(command) {
        return 'steal';
    }
    give(command) {
        return 'give';
    }
    find(command) {
        return 'find';
    }
    gold(command) {
        return 'gold';
    }
    chest(command) {
        return 'chest';
    }
    level(command) {
        return 'level';
    }
    blut(command) {
        return 'blut';
    }
    rank(command) {
        return 'rank';
    }
    diamond(command) {
        return 'diamond';
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
    //#region Shortcots
    inv(command) {
        this.inventory(command);
    }
    lvl(command) {
        this.level(command);
    }
}
exports.Loot = Loot;
//# sourceMappingURL=loot.js.map