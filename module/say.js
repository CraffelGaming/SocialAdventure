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
exports.Say = void 0;
const translationItem_1 = require("../model/translationItem");
const module_1 = require("./module");
const twitch_json_1 = __importDefault(require("../twitch.json"));
class Say extends module_1.Module {
    //#region Construct
    constructor(translation, channel, item) {
        super(translation, channel, 'say');
        this.countMessages = 0;
        this.lastCount = new Date();
        this.item = item;
        this.automation();
    }
    //#endregion
    //#region Remove
    remove() {
        try {
            if (this.timer != null) {
                clearInterval(this.timer);
            }
        }
        catch (ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function remove - ${ex.message}`);
        }
    }
    //#endregion
    //#region Execute
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} say execute`);
                if (command.name.startsWith(this.item.getDataValue("command"))) {
                    command.name = command.name.replace(this.item.getDataValue("command"), "");
                    const allowedCommand = this.commands.find(x => x.command === command.name);
                    if (allowedCommand) {
                        const isAllowed = !allowedCommand.isMaster && !allowedCommand.isModerator || this.isOwner(command) || allowedCommand.isModerator && this.isModerator(command);
                        if (isAllowed) {
                            if (this.item.getDataValue("isActive") || isAllowed) {
                                if (command.name.length === 0)
                                    command.name = "shout";
                                command.name = command.name.replace("+", "plus");
                                command.name = command.name.replace("-", "minus");
                                return yield this[command.name](command);
                            }
                            else {
                                global.worker.log.trace(`module loot not active`);
                            }
                        }
                        else
                            global.worker.log.warn(`not owner dedection ${this.item.getDataValue("command")} ${command.name} blocked`);
                    }
                    else
                        global.worker.log.warn(`hack dedection ${this.item.getDataValue("command")} ${command.name} blocked`);
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10000');
            }
            return '';
        });
    }
    //#endregion
    //#region Automation
    automation() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.item.getDataValue("isActive") && this.item.getDataValue("minutes") > 0) {
                    const delayDifference = this.channel.countMessages - this.countMessages;
                    if (delayDifference >= this.item.getDataValue("delay")) {
                        global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} last run ${new Date(this.item.getDataValue("lastRun"))}...`);
                        if (this.isDateTimeoutExpiredMinutes(new Date(this.item.getDataValue("lastRun")), this.item.getDataValue("minutes"))) {
                            this.item.setDataValue("lastRun", new Date());
                            this.item.setDataValue("countRuns", this.item.getDataValue("countRuns") + 1);
                            this.countMessages = this.channel.countMessages;
                            yield this.item.save();
                            global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} run after ${this.item.getDataValue("minutes")} Minutes.`);
                            this.channel.puffer.addMessage(this.replacePlaceholder(null, this.item.getDataValue("text")));
                        }
                        else {
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed minutes: ${this.item.getDataValue("minutes")}`);
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed time elapsed: ${this.getDateDifferenceMinutes(new Date(this.item.getDataValue("lastRun")))}`);
                        }
                    }
                    else {
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed delay: ${this.item.getDataValue("delay")}`);
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed delay diference: ${delayDifference}`);
                    }
                }
                else {
                    global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed active: ${this.item.getDataValue("isActive")}`);
                    global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed minutes: ${this.item.getDataValue("minutes")}`);
                }
            }
            catch (ex) {
                global.worker.log.error(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} automation error.`);
                global.worker.log.error(`exception ${ex.message}`);
            }
        }), 60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion
    //#region Commands
    plus(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.item.getDataValue("text").includes('$counter') && this.item.getDataValue("isCounter") && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.getDataValue("timeout"))) {
                    this.lastCount = new Date();
                    if (command.parameters.length > 0) {
                        const amount = Number(command.parameters[0]);
                        if (!isNaN(amount)) {
                            this.item.setDataValue("count", this.item.getDataValue("count") + amount);
                        }
                        else
                            this.item.setDataValue("count", this.item.getDataValue("count") + 1);
                    }
                    else
                        this.item.setDataValue("count", this.item.getDataValue("count") + 1);
                    this.item.setDataValue("countUses", this.item.getDataValue("countUses") + 1);
                    yield this.item.save();
                    return this.replacePlaceholder(command, this.item.getDataValue("text").replace('$counter', this.item.getDataValue("count").toString()));
                }
                return '';
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function plus - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10001');
            }
        });
    }
    minus(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.item.getDataValue("text").includes('$counter') && this.item.getDataValue("isCounter") && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.getDataValue("timeout"))) {
                    this.lastCount = new Date();
                    if (command.parameters.length > 0) {
                        const amount = Number(command.parameters[0]);
                        if (!isNaN(amount)) {
                            this.item.setDataValue("count", this.item.getDataValue("count") - amount);
                        }
                        else
                            this.item.setDataValue("count", this.item.getDataValue("count") - 1);
                    }
                    else
                        this.item.setDataValue("count", this.item.getDataValue("count") - 1);
                    if (this.item.getDataValue("count") < 0) {
                        this.item.setDataValue("count", 0);
                    }
                    this.item.setDataValue("countUses", this.item.getDataValue("countUses") + 1);
                    yield this.item.save();
                    return this.replacePlaceholder(command, this.item.getDataValue("text").replace('$counter', this.item.getDataValue("count").toString()));
                }
                return '';
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function minus - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10002');
            }
        });
    }
    start(command = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!this.item.getDataValue("isActive")) {
                    this.item.setDataValue("isActive", true);
                    this.item.setDataValue("count", 0);
                    yield this.item.save();
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} set active: ${this.item.getDataValue("isActive")}`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "start");
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} already started.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStarted");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function start - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-100003');
            }
        });
    }
    stop(command = null) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.item.getDataValue("isActive")) {
                    this.item.setDataValue("isActive", false);
                    yield this.item.save();
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} set active: ${this.item.getDataValue("isActive")}`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "stop");
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} already stopped.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStopped");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function stop - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10004');
            }
        });
    }
    interval(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (command.parameters.length > 0) {
                    const interval = parseInt(command.parameters[0], 10);
                    if (!isNaN(interval) && interval > -1) {
                        this.item.setDataValue("minutes", interval);
                        yield this.item.save();
                        return translationItem_1.TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
                    }
                    else {
                        global.worker.log.trace(`module ${this.item.getDataValue("command")} wrong interval parameter.`);
                        return translationItem_1.TranslationItem.translate(this.basicTranslation, "noInterval");
                    }
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} missing interval parameter.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function interval - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10005');
            }
        });
    }
    delay(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (command.parameters.length > 0) {
                    const delay = parseInt(command.parameters[0], 10);
                    if (!isNaN(delay) && delay > -1) {
                        this.item.setDataValue("delay", delay);
                        yield this.item.save();
                        return translationItem_1.TranslationItem.translate(this.basicTranslation, "delayChanged").replace("<delay>", command.parameters[0]);
                    }
                    else {
                        global.worker.log.trace(`module ${this.item.getDataValue("command")} wrong delay parameter.`);
                        return translationItem_1.TranslationItem.translate(this.basicTranslation, "noDelay");
                    }
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} missing delay parameter.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function delay - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10006');
            }
        });
    }
    text(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (command.parameters.length > 0) {
                    this.item.setDataValue("text", command.parameters[0]);
                    yield this.item.save();
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} text changed active: ${this.item.getDataValue("text")}`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "textChanged").replace("<text>", command.parameters[0]);
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} missing text parameter.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function text - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10007');
            }
        });
    }
    shout(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let text = '';
                if (this.item.getDataValue("isActive")) {
                    if (this.item.getDataValue("text") && this.item.getDataValue("text").length !== 0) {
                        text += this.item.getDataValue("text");
                        yield this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: { command: this.item.getDataValue("command") } });
                        global.worker.log.trace(`module ${this.item.getDataValue("command")} shout executed`);
                        if (this.item.getDataValue("isCounter")) {
                            text = text.replace('$counter', this.item.getDataValue("count").toString());
                        }
                        if (this.item.getDataValue("isShoutout")) {
                            if (command.target) {
                                const raider = yield this.channel.twitch.getUserByName(command.target);
                                if (raider) {
                                    const raiderChannel = yield this.channel.twitch.GetChannel(raider.id);
                                    if (raiderChannel) {
                                        text = text.replace('$raider', raider.display_name);
                                        text = text.replace('$raiderGame', raiderChannel.game_name);
                                        text = text.replace('$raiderTitle', raiderChannel.title);
                                        text = text.replace('$raiderUrl', twitch_json_1.default.url_twitch + raider.login);
                                    }
                                }
                            }
                            else {
                                global.worker.log.trace(`module ${this.item.getDataValue("command")} shout shoutout need target`);
                                return translationItem_1.TranslationItem.translate(this.basicTranslation, "shoutoutNeedTarget").replace("$1", command.source);
                            }
                        }
                        return this.replacePlaceholder(command, text);
                    }
                    else {
                        global.worker.log.trace(`module ${this.item.getDataValue("command")} shout nothign to say`);
                        return translationItem_1.TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.getDataValue("command"));
                    }
                }
                else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} not running`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "notRunning");
                }
            }
            catch (ex) {
                global.worker.log.error(`module ${this.item.getDataValue("command")} error function start - ${ex.message}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10008');
            }
        });
    }
}
exports.Say = Say;
//# sourceMappingURL=say.js.map