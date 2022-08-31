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
    constructor(translation, channel, name) {
        this.translation = translation;
        this.channel = channel;
        this.name = name;
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            this.basicTranslation = (yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'module', language: this.channel.node.language }, order: [['handle', 'ASC']], raw: true }));
            this.commands = (yield this.channel.database.sequelize.models.command.findAll({ where: { module: this.name }, order: [['command', 'ASC']], raw: true }));
        });
    }
    isOwner(command) {
        let result = false;
        if (this.channel.node.name === command.source)
            result = true;
        global.worker.log.trace(`is owner: ${result}`);
        return result;
    }
}
exports.Module = Module;
//# sourceMappingURL=module.js.map