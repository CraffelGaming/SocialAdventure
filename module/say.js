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
        this.item = item;
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace('say execute');
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
    start(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.item.isActive) {
                this.item.isActive = true;
                yield this.channel.database.sequelize.models.say.update(this.item, { where: { craffel: this.item.command } });
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        });
    }
    stop(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.item.isActive) {
                this.item.isActive = false;
                yield this.channel.database.sequelize.models.say.update(this.item, { where: { craffel: this.item.command } });
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        });
    }
    interval(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (command.parameters.length > 0) {
                const interval = parseInt(command.parameters[0], 10);
                if (!isNaN(interval)) {
                    this.item.minutes = interval;
                    yield this.channel.database.sequelize.models.say.update(this.item, { where: { craffel: this.item.command } });
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
                }
                else {
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "noInterval");
                }
            }
            else {
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        });
    }
    text(command) {
        return __awaiter(this, void 0, void 0, function* () {
            return 'text';
        });
    }
    shout(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.item.isActive) {
                if (this.item.text && this.item.text.length !== 0) {
                    return this.item.text;
                }
                else {
                    return translationItem_1.TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.command);
                }
            }
            else {
                return translationItem_1.TranslationItem.translate(this.basicTranslation, "notRunning");
            }
        });
    }
}
exports.Say = Say;
//# sourceMappingURL=say.js.map