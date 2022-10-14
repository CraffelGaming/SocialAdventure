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
const twitch_1 = require("./twitch");
class Channel {
    //#region Construct
    constructor(node) {
        this.node = node;
        this.countMessages = 0;
        this.twitch = new twitch_1.Twitch();
        this.twitch.load(this.node.getDataValue("name"));
        this.stream = null;
        this.database = new connection_1.Connection({ databaseName: Buffer.from(node.name).toString('base64') });
        this.puffer = new puffer_1.Puffer(node),
            this.puffer.interval();
        this.say = [];
        this.streamWatcher();
    }
    //#endregion
    //#region Twitch API streamer login by node
    streamWatcher() {
        global.worker.log.info(`node ${this.node.name}, add streamWatcher`);
        setInterval(() => __awaiter(this, void 0, void 0, function* () {
            global.worker.log.trace(`node ${this.node.name}, streamWatcher run`);
            try {
                if (this.twitch) {
                    const stream = yield this.twitch.GetStream(this.twitch.twitchUser.getDataValue('id'));
                    if (stream && stream.type === 'live') {
                        if (!this.node.isLive) {
                            global.worker.log.info(`node ${this.node.name}, streamWatcher is now live`);
                            this.node.isLive = true;
                            yield this.database.sequelize.models.node.update(this.node, { where: { name: this.node.name } });
                            this.startSays();
                            this.startLoot();
                        }
                    }
                    else if (this.node.isLive) {
                        global.worker.log.info(`node ${this.node.name}, streamWatcher is not longer live`);
                        this.node.isLive = false;
                        yield this.database.sequelize.models.node.update(this.node, { where: { name: this.node.name } });
                        this.stopSays();
                        this.stopLoot();
                    }
                    else {
                        global.worker.log.trace(`node ${this.node.name}, streamWatcher nothing changed, live: ${this.node.isLive}`);
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function streamWatcher - ${ex.message}`);
            }
        }), 1000 * 60 // 1 Minute(n)
        );
    }
    //#endregion
    //#region Say
    addSays() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translation = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'say', language: this.node.language }, order: [['handle', 'ASC']], raw: true });
                for (const item of Object.values(yield this.database.sequelize.models.say.findAll({ order: [['command', 'ASC']], raw: true }))) {
                    const element = new say_1.Say(translation, this, item);
                    yield element.initialize();
                    this.say.push(element);
                    global.worker.log.info(`node ${this.node.name}, say add ${element.item.command}.`);
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function addSays - ${ex.message}`);
            }
        });
    }
    stopSays() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of this.say) {
                    if (item.item.isLiveAutoControl) {
                        yield item.stop();
                        global.worker.log.info(`node ${this.node.name}, stop module ${item.item.command}.`);
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function stopSays - ${ex.message}`);
            }
        });
    }
    startSays() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of this.say) {
                    if (item.item.isLiveAutoControl) {
                        yield item.start();
                        global.worker.log.info(`node ${this.node.name}, stop module ${item.item.command}.`);
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function startSays - ${ex.message}`);
            }
        });
    }
    addSay(item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translation = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'say', language: this.node.language }, order: [['handle', 'ASC']], raw: true });
                const element = new say_1.Say(translation, this, item);
                yield element.initialize();
                this.say.push(element);
                global.worker.log.info(`node ${this.node.name}, say add ${element.item.command}.`);
            }
            catch (ex) {
                global.worker.log.error(`channel error - function addSay - ${ex.message}`);
            }
        });
    }
    removeSay(command) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const index = this.say.findIndex(d => d.item.command === command);
                if (index > -1) {
                    global.worker.log.info(`node ${this.node.name}, say remove ${this.say[index].item.command}.`);
                    this.say[index].remove();
                    this.say.splice(index, 1);
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function removeSay - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Loot
    addLoot() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const translation = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'loot', language: this.node.language }, order: [['handle', 'ASC']], raw: true });
                this.loot = new loot_1.Loot(translation, this);
                yield this.loot.initialize();
                yield this.loot.InitializeLoot();
            }
            catch (ex) {
                global.worker.log.error(`channel error - function addLoot - ${ex.message}`);
            }
        });
    }
    stopLoot() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.loot.settings.find(x => x.command === "loot").isLiveAutoControl) {
                    yield this.loot.lootclear();
                    yield this.loot.lootstop();
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function stopLoot - ${ex.message}`);
            }
        });
    }
    startLoot() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (this.loot.settings.find(x => x.command === "loot").isLiveAutoControl) {
                    yield this.loot.lootstart();
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function startLoot - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Execute
    execute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            const messages = [];
            try {
                messages.push(yield this.loot.execute(command));
                for (const key in Object.keys(this.say)) {
                    if (this.say.hasOwnProperty(key)) {
                        messages.push(yield this.say[key].execute(command));
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function execute - ${ex.message}`);
            }
            return messages;
        });
    }
}
exports.Channel = Channel;
module.exports.default = Channel;
//# sourceMappingURL=channel.js.map