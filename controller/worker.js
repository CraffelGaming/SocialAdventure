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
const twitch_1 = require("./twitch");
const command_1 = require("./command");
class Worker {
    constructor(log) {
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..', 'database', 'migrations');
        this.channels = [];
        this.tmi = new tmi.client(tmiSettings);
        this.twitch = new twitch_1.Twitch(log);
        this.log.trace('twitch chat client initialized');
        this.globalDatabase = new connection_1.Connection({ databaseName: Buffer.from('global').toString('base64') });
        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.globalDatabase.initializeGlobal();
            // Connect client to twitch
            yield this.connect();
            for (const item of Object.values(yield this.globalDatabase.sequelize.models.node.findAll())) {
                this.log.trace('add Node ' + item.name);
                const channel = new channel_1.Channel(item);
                channel.database.initialize();
                // Register Channel to twitch
                this.register(channel);
                this.channels.push(channel);
            }
        });
    }
    //#region Twitch API
    login(request, response, callback) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.app.get('twitch');
            this.log.trace(data);
            const twitch = new twitch_1.Twitch(this.log);
            const credentials = yield twitch.twitchAuthentification(request, response);
            if (credentials) {
                const userData = yield twitch.TwitchPush(request, response, "GET", "/users?client_id=" + data.client_id);
                if (userData) {
                    yield twitch.saveTwitch(request, response, userData);
                    yield twitch.saveTwitchUser(request, response, userData);
                }
            }
            callback(request, response);
        });
    }
    //#endregion
    //#region Chatbot
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
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
        try {
            global.worker.log.trace('incomming message self: ' + self);
            if (self) {
                return;
            }
            if (!message.trim().toLowerCase().startsWith('!')) {
                return;
            }
            global.worker.log.trace('incomming message target: ' + target);
            global.worker.log.trace('incomming message message: ' + message);
            const channel = global.worker.channels.find(x => x.node.name === target.replace('#', ''));
            if (channel) {
                const command = new command_1.Command(message);
                global.worker.log.trace(command);
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    onConnectedHandler(address, port) {
        this.log.info(`bot connected to ${address}:${port}`);
    }
    onDisconnectedHandler() {
        this.tmi.connect();
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map