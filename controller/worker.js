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
const command_1 = require("./command");
const twitch_1 = require("./twitch");
class Worker {
    //#region Construct
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
    //#endregion
    //#region Restart
    restart() {
        return __awaiter(this, void 0, void 0, function* () {
            global.worker.tmi = new tmi.client(tmiSettings);
            global.worker.channels = [];
            yield global.worker.initialize();
        });
    }
    //#endregion
    //#region Initialize
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.globalDatabase.initializeGlobal();
                // Twitch API bot login automation
                yield this.connect();
                // Load default Translation
                this.translation = (yield this.globalDatabase.sequelize.models.translation.findAll({ where: { language: 'default' }, order: [['handle', 'ASC']] }));
                for (const node of Object.values(yield this.globalDatabase.sequelize.models.node.findAll({ include: [{
                            model: global.worker.globalDatabase.sequelize.models.twitchUser,
                            as: 'twitchUser',
                        }] }))) {
                    this.startNode(node); // no await needed
                }
                global.worker.log.info(`--------------------------------------`);
                global.worker.log.info(`---------- ALL NODES ADDED -----------`);
                global.worker.log.info(`--------------------------------------`);
            }
            catch (ex) {
                global.worker.log.error(`worker error - function initialize - ${ex.message}`);
            }
        });
    }
    //#endregion
    //#region Node
    startNode(node) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
                if (channel == null) {
                    this.log.trace('add Node ' + node.name);
                    channel = new channel_1.Channel(node, this.translation);
                    yield channel.initialize();
                    // Register Channel to twitch
                    this.register(channel);
                    this.channels.push(channel);
                }
                else {
                    this.log.trace('Node already added ' + node.name);
                }
                return channel;
            }
            catch (ex) {
                global.worker.log.error(`worker error - function startNode - ${ex.message}`);
            }
            return null;
        });
    }
    //#endregion
    //#region Twitch API client login on Webpage
    login(request, response, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const twitch = new twitch_1.Twitch();
                if (yield twitch.login(request.session.state, request.query.code.toString())) {
                    request.session.twitch = twitch.credential;
                    request.session.userData = twitch.credentialUser;
                }
            }
            catch (ex) {
                global.worker.log.error(`worker error - function login - ${ex.message}`);
            }
            if (callback != null)
                callback(request, response);
        });
    }
    //#endregion
    //#region Chatbot
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.botCredential = yield twitch_1.Twitch.botAuthentification();
                this.tmi.on('message', this.onMessageHandler);
                this.tmi.on('connected', this.onConnectedHandler);
                this.tmi.on('disconnected', this.onDisconnectedHandler);
                yield this.tmi.connect();
            }
            catch (ex) {
                global.worker.log.error(`worker error - function connect - ${ex.message}`);
            }
        });
    }
    register(channel) {
        try {
            this.log.trace('node connected: ' + channel.node.getDataValue('name'));
            this.tmi.join(channel.node.getDataValue('name').replace('#', ''));
            this.log.trace(this.tmi);
        }
        catch (ex) {
            global.worker.log.error(`worker error - function register - ${ex.message}`);
        }
    }
    onMessageHandler(target, context, message, self) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.trace('incomming message self: ' + self);
                if (self) {
                    return;
                }
                const channel = global.worker.channels.find(x => x.node.getDataValue('name') === target.replace('#', ''));
                if (channel) {
                    if (!message.trim().toLowerCase().startsWith('!')) {
                        ++channel.countMessages;
                        global.worker.log.trace(`incomming real message count: ${channel.countMessages}`);
                        return;
                    }
                    global.worker.log.trace(`incomming message channel: ${channel.node.getDataValue('name')})`);
                    global.worker.log.trace(`incomming message target: ${target} (Channel: ${channel.node.getDataValue('name')})`);
                    global.worker.log.trace(`incomming message message: ${message}`);
                    const command = new command_1.Command(message, context);
                    const messages = yield channel.execute(command);
                    global.worker.log.trace(command);
                    channel.puffer.addMessages(messages);
                }
            }
            catch (ex) {
                global.worker.log.error(`worker error - function onMessageHandler - ${ex.message}`);
            }
        });
    }
    onConnectedHandler(address, port) {
        try {
            this.log.info(`connected to ${address}:${port}`);
        }
        catch (ex) {
            global.worker.log.error(`worker error - function onConnectedHandler - ${ex.message}`);
        }
    }
    onDisconnectedHandler() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                global.worker.log.warn(`worker warn - function onDisconnectedHandler - Reconnect Disabled`);
                // await global.worker.restart();
            }
            catch (ex) {
                global.worker.log.error(`worker error - function onDisconnectedHandler - ${ex.message}`);
            }
        });
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map