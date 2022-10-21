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
exports.Module = void 0;
class Module {
    //#region Construct
    constructor(translation, channel, name) {
        this.translation = translation;
        this.channel = channel;
        this.name = name;
    }
    //#endregion
    //#region Initialize
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.basicTranslation = (yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'module', language: this.channel.node.getDataValue('language') }, order: [['handle', 'ASC']], raw: true }));
            this.commands = (yield this.channel.database.sequelize.models.command.findAll({ where: { module: this.name }, order: [['command', 'ASC']], raw: true }));
        });
    }
    //#endregion
    //#region Owner
    isOwner(command) {
        let result = false;
        if (this.channel.node.getDataValue('name') === command.source)
            result = true;
        global.worker.log.trace(`is owner: ${result}`);
        return result;
    }
    //#endregion
    //#region Moderator
    isModerator(command) {
        let result = false;
        if (this.channel.moderators && this.channel.moderators.length > 0) {
            if (this.channel.moderators.some(x => x.user_name === command.source))
                result = true;
        }
        global.worker.log.trace(`is moderator: ${result}`);
        return result;
    }
    //#endregion
    //#region Placeholder
    replacePlaceholder(command, text) {
        text = text.replace('$streamer', this.channel.node.getDataValue('name'));
        if (command != null) {
            text = text.replace('$source', command.source);
            text = text.replace('$target', command.target.length > 0 ? command.target : command.source);
            text = text.replace('$command', command.name);
            if (text.includes('$dice')) {
                if (command.parameters.length >= 2) {
                    const min = Number(command.parameters[0]);
                    const max = Number(command.parameters[1]);
                    if (!isNaN(min) && !isNaN(max))
                        text = text.replace('$dice', this.getRandomNumber(min, max).toString());
                    else
                        text = text.replace('$dice', this.getRandomNumber(1, 6).toString());
                }
                else
                    text = text.replace('$dice', this.getRandomNumber(1, 6).toString());
            }
        }
        return text;
    }
    //#endregion
    //#region Date
    getDateDifferenceSeconds(date) {
        return Math.floor((Date.now() - date.getTime()) / 1000);
    }
    getDateDifferenceMinutes(date) {
        return Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    }
    isDateTimeoutExpiredMinutes(date, timeout) {
        return this.getDateDifferenceMinutes(date) >= timeout;
    }
    isDateTimeoutExpiredSeconds(date, timeout) {
        return this.getDateDifferenceSeconds(date) >= timeout;
    }
    getDateTimeoutRemainingMinutes(date, timeout) {
        const diff = this.getDateDifferenceMinutes(date);
        return diff >= timeout ? 0 : timeout - diff;
    }
    getDateTimeoutRemainingSeconds(date, timeout) {
        const diff = this.getDateDifferenceMinutes(date);
        return diff >= timeout ? 0 : timeout - diff;
    }
    //#endregion
    //#region Random
    getRandomNumber(min, max) {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, new random number ${random} between ${min} and ${max}`);
        return random;
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map