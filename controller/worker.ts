import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');
import { NodeItem } from '../model/nodeItem';
import { Channel } from './channel';
import tmi = require('tmi.js');
import tmiSettings = require('../bot.json');

export class Worker {
    pathModel: string;
    pathMigration: string
    globalDatabase: Connection;
    channels: Channel[];
    log: log4js.Logger;
    tmi: any;

    constructor(log: log4js.Logger){
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..','database', 'migrations');
        this.channels = [];
        this.tmi = new tmi.client(tmiSettings);

        this.log.trace('twitch chat client initialized');

        this.globalDatabase = new Connection({ databaseName: Buffer.from('global').toString('base64')});

        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);
    }

    async initialize(){
        await this.globalDatabase.initializeGlobal();

        // Connect client to twitch
        await this.connect();

        for(const item of Object.values(await this.globalDatabase.sequelize.models.node.findAll()) as unknown as NodeItem[]){
            this.log.trace('add Node ' + item.name);
            const channel = new Channel(item);
            channel.database.initialize();

            // Register Channel to twitch
            this.register(channel);

            this.channels.push(channel);
        }
    }

    async connect(){
        this.tmi.on('message', this.onMessageHandler);
        this.tmi.on('connected', this.onConnectedHandler);
        this.tmi.on('disconnected', this.onDisconnectedHandler);

        await this.tmi.connect();
    }

    register(channel: Channel){
        this.log.trace('node connected: ' + channel.node.name);
        this.tmi.join(channel.node.name.replace('#', ''));
    }

    onMessageHandler (target, context, message, self) {
        try{
            global.worker.log.trace('incomming message self: ' + self);

            if (self) { return; }
            if(!message.trim().toLowerCase().startsWith('!')) { return; }

            global.worker.log.trace('incomming message target: ' + target);
            global.worker.log.trace('incomming message message: ' + message);

            //TODO

        } catch (ex){
            global.worker.log.error(ex);
        }
    }

    onConnectedHandler (addr, port) {
        this.log.info(`bot connected to ${addr}:${port}`);
    }

    onDisconnectedHandler() {
        this.tmi.connect();
    }
}