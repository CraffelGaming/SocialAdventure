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
exports.Say = void 0;
const translationItem_1 = require("../model/translationItem");
const module_1 = require("./module");
class Say extends module_1.Module {
    constructor(translation, channel, item) {
        super(translation, channel);
        this.countMessages = 0;
        this.item = item;
        this.automation();
    }
    remove() {
        if (this.timer != null) {
            clearInterval(this.timer);
        }
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace(`module ${this.item.command} say execute`);
                if (command.name.startsWith(this.item.command)) {
                    command.name = command.name.replace(this.item.command, "");
                    if (command.name.length === 0)
                        command.name = "shout";
                    return yield this[command.name](command);
                }
            }
            catch (ex) {
                return '';
            }
        });
    }
    automation() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            if (this.item.isActive && this.item.minutes > 0) {
                const delayDifference = this.channel.countMessages - this.countMessages;
                if (delayDifference >= this.item.delay) {
                    const date = new Date();
                    global.worker.log.info(`node ${this.channel.node.name}, module ${this.item.command} last run ${new Date(this.item.lastRun)}...`);
                    const timeDifference = Math.floor((date.getTime() - new Date(this.item.lastRun).getTime()) / 60000);
                    if (timeDifference >= this.item.minutes) {
                        try {
                            this.item.lastRun = date;
                            this.item.countRuns += 1;
                            this.countMessages = this.channel.countMessages;
                            yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                            global.worker.log.info(`node ${this.channel.node.name}, module ${this.item.command} run after ${this.item.minutes} Minutes.`);
                            this.channel.puffer.addMessage(this.item.text);
                        }
                        catch (ex) {
                            global.worker.log.error(`node ${this.channel.node.name}, module ${this.item.command} automation error.`);
                            global.worker.log.error(ex);
                        }
                    }
                    else {
                        global.worker.log.info(`node ${this.channel.node.name}, module ${this.item.command} not executed`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} minutes: ${this.item.minutes}`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} time elapsed: ${timeDifference}`);
                    }
                }
                else {
                    global.worker.log.info(`node ${this.channel.node.name}, module ${this.item.command} not executed`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} delay: ${this.item.delay}`);
                    global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} delay diference: ${delayDifference}`);
                }
            }
            else {
                global.worker.log.info(`node ${this.channel.node.name}, module ${this.item.command} not executed`);
                global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} active: ${this.item.isActive}`);
                global.worker.log.trace(`node ${this.channel.node.name}, module ${this.item.command} minutes: ${this.item.minutes}`);
            }
        }), 60000 // Alle 60 Sekunden prüfen
        );
    }
    start(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.item.isActive) {
                this.item.isActive = true;
                yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                global.worker.log.trace(`module ${this.item.command} set active: ${this.item.isActive}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                global.worker.log.trace(`module ${this.item.command} already started.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        });
    }
    stop(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.item.isActive) {
                this.item.isActive = false;
                yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                global.worker.log.trace(`module ${this.item.command} set active: ${this.item.isActive}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                global.worker.log.trace(`module ${this.item.command} already stopped.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        });
    }
    interval(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.parameters.length > 0) {
                const interval = parseInt(command.parameters[0], 10);
                if (!isNaN(interval) && interval > -1) {
                    this.item.minutes = interval;
                    yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
                }
                else {
                    global.worker.log.trace(`module ${this.item.command} wrong interval parameter.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noInterval");
                }
            }
            else {
                global.worker.log.trace(`module ${this.item.command} missing interval parameter.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        });
    }
    delay(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.parameters.length > 0) {
                const delay = parseInt(command.parameters[0], 10);
                if (!isNaN(delay) && delay > -1) {
                    this.item.delay = delay;
                    yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "delayChanged").replace("<delay>", command.parameters[0]);
                }
                else {
                    global.worker.log.trace(`module ${this.item.command} wrong delay parameter.`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noDelay");
                }
            }
            else {
                global.worker.log.trace(`module ${this.item.command} missing delay parameter.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        });
    }
    text(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.parameters.length > 0) {
                this.item.text = command.parameters[0];
                yield this.channel.database.sequelize.models.say.update(this.item, { where: { command: this.item.command } });
                global.worker.log.trace(`module ${this.item.command} text changed active: ${this.item.text}`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "textChanged").replace("<text>", command.parameters[0]);
            }
            else {
                global.worker.log.trace(`module ${this.item.command} missing text parameter.`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        });
    }
    shout(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.item.isActive) {
                if (this.item.text && this.item.text.length !== 0) {
                    yield this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: { command: this.item.command } });
                    global.worker.log.trace(`module ${this.item.command} shout executed`);
                    return this.item.text;
                }
                else {
                    global.worker.log.trace(`module ${this.item.command} shout nothign to say`);
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.command);
                }
            }
            else {
                global.worker.log.trace(`module ${this.item.command} not running`);
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "notRunning");
            }
        });
    }
}
exports.Say = Say;
//# sourceMappingURL=say.js.map