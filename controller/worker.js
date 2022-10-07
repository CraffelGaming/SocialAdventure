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
exports.Worker = void 0;
const connection_1 = require("../database/connection");
const path = require("path");
const channel_1 = require("./channel");
const tmi = require("tmi.js");
const tmiSettings = require("../bot.json");
const twitchData = require("../twitch.json");
const twitch_1 = require("./twitch");
const command_1 = require("./command");
class Worker {
    constructor(log) {
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..', 'database', 'migrations');
        this.channels = [];
        this.tmi = new tmi.client(tmiSettings);
        this.twitch = new twitch_1.Twitch();
        this.log.trace('twitch chat client initialized');
        this.globalDatabase = new connection_1.Connection({ databaseName: Buffer.from('global').toString('base64') });
        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);
    }
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            global.worker.tmi = new tmi.client(tmiSettings);
            global.worker.channels = [];
            yield global.worker.initialize();
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.globalDatabase.initializeGlobal();
            // Connect client to twitch
            yield this.connect();
            for (const node of Object.values(yield this.globalDatabase.sequelize.models.node.findAll({ include: [{
                        model: global.worker.globalDatabase.sequelize.models.twitchUser,
                        as: 'twitchUser',
                    }] }))) {
                this.startNode(node);
            }
        });
    }
    startNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = global.worker.channels.find(x => x.node.name === node.name);
            if (channel == null) {
                this.log.trace('add Node ' + node.name);
                channel = new channel_1.Channel(node);
                yield channel.database.initialize();
                yield channel.addSays();
                yield channel.addLoot();
                // Register Channel to twitch
                this.register(channel);
                this.channels.push(channel);
            }
            else {
                this.log.trace('Node already added ' + node.name);
            }
            return channel;
        });
    }
    //#region Twitch API
    login(request, response, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const twitch = new twitch_1.Twitch();
            const credentials = yield twitch.twitchAuthentification(request, response);
            if (credentials) {
                const userData = yield twitch.TwitchPush(request, response, "GET", "/users?client_id=" + twitchData.client_id);
                if (userData) {
                    yield twitch.saveTwitch(request, response, userData);
                    yield twitch.saveTwitchUser(request, response, userData);
                    request.session.userData = userData;
                }
            }
            callback(request, response);
        });
    }
    //#endregion
    //#region Chatbot
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            const twitch = new twitch_1.Twitch();
            this.botCredential = yield twitch.twitchBotAuthentification();
            this.tmi.on('message', this.onMessageHandler);
            this.tmi.on('connected', this.onConnectedHandler);
            this.tmi.on('disconnected', this.onDisconnectedHandler);
            yield this.tmi.connect();
        });
    }
    register(channel) {
        this.log.trace('node connected: ' + channel.node.name);
        this.tmi.join(channel.node.name.replace('#', ''));
    }
    onMessageHandler(target, context, message, self) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace('incomming message self: ' + self);
                if (self) {
                    return;
                }
                const channel = global.worker.channels.find(x => x.node.name === target.replace('#', ''));
                if (channel) {
                    if (!message.trim().toLowerCase().startsWith('!')) {
                        ++channel.countMessages;
                        global.worker.log.trace(`incomming real message count: ${channel.countMessages}`);
                        return;
                    }
                    global.worker.log.trace(`incomming message channel: ${channel.node.name})`);
                    global.worker.log.trace(`incomming message target: ${target} (Channel: ${channel.node.name})`);
                    global.worker.log.trace(`incomming message message: ${message}`);
                    const command = new command_1.Command(message, context);
                    const messages = yield channel.execute(command);
                    global.worker.log.trace(command);
                    channel.puffer.addMessages(messages);
                }
            }
            catch (ex) {
                global.worker.log.error(`exception ${ex.message}`);
            }
        });
    }
    onConnectedHandler(address, port) {
        this.log.info(`connected to ${address}:${port}`);
    }
    onDisconnectedHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            yield global.worker.restart();
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map