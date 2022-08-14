import * as express from 'express';
import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');
import { NodeItem } from '../model/nodeItem';
import { Channel } from './channel';
import tmi = require('tmi.js');
import tmiSettings = require('../bot.json');
import { Twitch } from './twitch';
import { Command } from './command';

export class Worker {
    pathModel: string;
    pathMigration: string
    globalDatabase: Connection;
    channels: Channel[];
    log: log4js.Logger;
    tmi: any;
    twitch: Twitch;

    constructor(log: log4js.Logger){
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..','database', 'migrations');
        this.channels = [];
        this.tmi = new tmi.client(tmiSettings);
        this.twitch = new Twitch();
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

            await channel.database.initialize();
            await channel.addSay();
            await channel.addLoot();

            // Register Channel to twitch
            this.register(channel);
            this.channels.push(channel);
        }
    }

    //#region Twitch API
    async login(request: express.Request, response: express.Response, callback: any){
        const data = request.app.get('twitch');
        this.log.trace(data);

        const twitch = new Twitch();
        const credentials = await twitch.twitchAuthentification(request, response);

        if(credentials){
            const userData = await twitch.TwitchPush(request, response,"GET", "/users?client_id=" + data.client_id);

            if(userData){
                await twitch.saveTwitch(request, response, userData);
                await twitch.saveTwitchUser(request, response, userData);
            }
        }
        callback(request, response);
    }
    //#endregion

    //#region Chatbot
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

    async onMessageHandler (target : string, context : any, message : string, self: boolean) {
        try{
            global.worker.log.trace('incomming message self: ' + self);

            if (self) { return; }
            if(!message.trim().toLowerCase().startsWith('!')) { return; }

            global.worker.log.trace('incomming message target: ' + target);
            global.worker.log.trace('incomming message message: ' + message);

            const channel = global.worker.channels.find(x => x.node.name === target.replace('#',''))

            if(channel){
                const command = new Command(message, context);
                const messages = await channel.execute(command);
                global.worker.log.trace(command);
                channel.puffer.addMessages(messages);
            }
        } catch (ex){
            global.worker.log.error(ex);
        }
    }

    onConnectedHandler (address: string, port: number) {
        this.log.info(`bot connected to ${address}:${port}`);
    }

    onDisconnectedHandler() {
        this.tmi.connect();
    }
    //#endregion
}