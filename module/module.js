"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Module = void 0;
class Module {
    constructor(translation, channel) {
        this.translation = translation;
        this.channel = channel;
        this.basicTranslation = global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'module', language: this.channel.node.language }, order: [['handle', 'ASC']], raw: false });
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