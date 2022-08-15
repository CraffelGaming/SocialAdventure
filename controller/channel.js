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
exports.Channel = void 0;
const connection_1 = require("../database/connection");
const say_1 = require("../module/say");
const loot_1 = require("../module/loot");
const puffer_1 = require("./puffer");
class Channel {
    constructor(node) {
        this.node = node;
        this.countMessages = 0;
        this.database = new connection_1.Connection({ databaseName: Buffer.from(node.name).toString('base64') });
        this.puffer = new puffer_1.Puffer(node),
            this.puffer.interval();
        this.say = [];
    }
    addSay() {
        return __awaiter(this, void 0, void 0, function* () {
            const translation = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'say', language: this.node.language }, order: [['handle', 'ASC']], raw: true });
            for (const item of Object.values(yield this.database.sequelize.models.say.findAll({ order: [['command', 'ASC']], raw: true }))) {
                const element = new say_1.Say(translation, this, item);
                yield element.initialize();
                this.say.push(element);
            }
        });
    }
    addLoot() {
        return __awaiter(this, void 0, void 0, function* () {
            const translation = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'loot', language: this.node.language }, order: [['handle', 'ASC']], raw: true });
            this.loot = new loot_1.Loot(translation, this);
            yield this.loot.initialize();
        });
    }
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [];
            messages.push(this.loot.execute(command));
            for (const key in Object.keys(this.say)) {
                if (this.say.hasOwnProperty(key)) {
                    messages.push(yield this.say[key].execute(command));
                }
            }
            return messages;
        });
    }
}
exports.Channel = Channel;
module.exports.default = Channel;
//# sourceMappingURL=channel.js.map