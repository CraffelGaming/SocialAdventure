import { Connection } from '../database/connection.js';
import path from 'path';
import { Channel } from './channel.js';
import tmi from 'tmi.js';
import { Command } from './command.js';
import { Twitch } from './twitch.js';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const tmiSettings = JSON.parse(fs.readFileSync(path.join(dirname, '../bot.json')).toString());
export class Worker {
    //#region Construct
    constructor(log) {
        this.log = log;
        this.pathModel = path.join(dirname, '..', 'model');
        this.pathMigration = path.join(dirname, '..', 'database', 'migrations');
        this.channels = [];
        this.tmi = new tmi.client(tmiSettings);
        this.twitch = new Twitch();
        this.log.trace('twitch chat client initialized');
        this.globalDatabase = new Connection({ databaseName: Buffer.from('global').toString('base64') });
        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);
    }
    //#endregion
    //#region Restart
    async restart() {
        try {
            global.worker.tmi = new tmi.client(tmiSettings);
            global.worker.channels = [];
            await global.worker.initialize();
        }
        catch (ex) {
            global.worker.log.error(`worker error - function restart - ${ex.message}`);
        }
    }
    //#endregion
    //#region Initialize
    async initialize() {
        try {
            await this.globalDatabase.initializeGlobal();
            // Twitch API bot login automation
            await this.connect();
            // Load default Translation
            this.translation = await this.globalDatabase.sequelize.models.translation.findAll({ where: { language: 'default' }, order: [['handle', 'ASC']] });
            for (const node of Object.values(await this.globalDatabase.sequelize.models.node.findAll({ include: [{
                        model: global.worker.globalDatabase.sequelize.models.twitchUser,
                        as: 'twitchUser',
                    }] }))) {
                await this.startNode(node); // no await needed
            }
            global.worker.log.info(`--------------------------------------`);
            global.worker.log.info(`---------- ALL NODES ADDED -----------`);
            global.worker.log.info(`--------------------------------------`);
        }
        catch (ex) {
            global.worker.log.error(`worker error - function initialize - ${ex.message}`);
        }
    }
    //#endregion
    //#region Node
    async startNode(node) {
        try {
            let channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
            if (channel == null) {
                this.log.trace('add Node ' + node.name);
                channel = new Channel(node, this.translation);
                await channel.initialize();
                // Register Channel to twitch
                await this.register(channel);
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
    }
    //#endregion
    //#region Twitch API client login on Webpage
    async login(request, response, callback) {
        try {
            const twitch = new Twitch();
            if (await twitch.login(request.session.state, request.query.code.toString())) {
                request.session.twitch = twitch.credential;
                request.session.userData = twitch.credentialUser;
            }
        }
        catch (ex) {
            global.worker.log.error(`worker error - function login - ${ex.message}`);
        }
        if (callback != null)
            callback(request, response);
    }
    //#endregion
    //#region Chatbot
    async connect() {
        try {
            this.botCredential = await Twitch.botAuthentification();
            this.tmi.on('message', this.onMessageHandler);
            this.tmi.on('connected', this.onConnectedHandler);
            this.tmi.on('disconnected', this.onDisconnectedHandler);
            await this.tmi.connect();
        }
        catch (ex) {
            global.worker.log.error(`worker error - function connect - ${ex.message}`);
        }
    }
    async register(channel) {
        try {
            if (channel?.node != null && this.tmi != null)
                this.log.trace('node connected: ' + channel.node.getDataValue('name'));
            await this.tmi.join(channel.node.getDataValue('name').replace('#', ''));
            this.log.trace(this.tmi);
        }
        catch (ex) {
            global.worker.log.error(`worker error - function register - ${ex.message}`);
        }
    }
    async onMessageHandler(target, context, message, self) {
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
                const command = new Command(message, context);
                const messages = await channel.execute(command);
                global.worker.log.trace(command);
                channel.puffer.addMessages(messages);
            }
        }
        catch (ex) {
            global.worker.log.error(`worker error - function onMessageHandler - ${ex.message}`);
        }
    }
    onConnectedHandler(address, port) {
        try {
            this.log.info(`connected to ${address}:${port}`);
        }
        catch (ex) {
            global.worker.log.error(`worker error - function onConnectedHandler - ${ex.message}`);
        }
    }
    async onDisconnectedHandler() {
        try {
            global.worker.log.warn(`worker warn - function onDisconnectedHandler - Reconnect Disabled`);
            // await global.worker.restart();
        }
        catch (ex) {
            global.worker.log.error(`worker error - function onDisconnectedHandler - ${ex.message}`);
        }
    }
}
//# sourceMappingURL=worker.js.map