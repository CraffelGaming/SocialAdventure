import * as express from 'express';
import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');
import { NodeItem } from '../model/nodeItem';
import { Channel } from './channel';
import tmi = require('tmi.js');
import tmiSettings = require('../bot.json');
import twitchData = require('../twitch.json');
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
    botCredential: credentialItem;

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

    async restart(){
        global.worker.tmi = new tmi.client(tmiSettings);
        global.worker.channels = [];
        await global.worker.initialize();
    }

    async initialize(){
        await this.globalDatabase.initializeGlobal();

        // Connect client to twitch
        await this.connect();

        for(const node of Object.values(await this.globalDatabase.sequelize.models.node.findAll({include: [{
            model: global.worker.globalDatabase.sequelize.models.twitchUser,
            as: 'twitchUser',
        }]})) as unknown as NodeItem[]){
            this.startNode(node);
        }
    }

    async startNode(node: NodeItem) : Promise<Channel>{
        let channel = global.worker.channels.find(x => x.node.name === node.name);

        if(channel == null){
            this.log.trace('add Node ' + node.name);
            channel = new Channel(node);

            await channel.database.initialize();
            await channel.addSays();
            await channel.addLoot();

            // Register Channel to twitch
            this.register(channel);
            this.channels.push(channel);
        } else {
            this.log.trace('Node already added ' + node.name);
        }

        return channel;
    }

    //#region Twitch API
    async login(request: express.Request, response: express.Response, callback: any){
        const twitch = new Twitch();
        const credentials = await twitch.twitchAuthentification(request, response);

        if(credentials){
            const userData = await twitch.TwitchPush(request, response,"GET", "/users?client_id=" + twitchData.client_id);

            if(userData){
                await twitch.saveTwitch(request, response, userData);
                await twitch.saveTwitchUser(request, response, userData);
                request.session.userData = userData;
            }
        }
        callback(request, response);
    }
    //#endregion

    //#region Chatbot
    async connect(){
        const twitch = new Twitch();
        this.botCredential = await twitch.twitchBotAuthentification();

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

            const channel = global.worker.channels.find(x => x.node.name === target.replace('#',''))

            if(channel){
                if(!message.trim().toLowerCase().startsWith('!')) {
                    ++channel.countMessages;
                    global.worker.log.trace(`incomming real message count: ${channel.countMessages}`);
                    return;
                }

                global.worker.log.trace(`incomming message channel: ${channel.node.name})`);
                global.worker.log.trace(`incomming message target: ${target} (Channel: ${channel.node.name})`);
                global.worker.log.trace(`incomming message message: ${message}`);

                const command = new Command(message, context);
                const messages = await channel.execute(command);
                global.worker.log.trace(command);
                channel.puffer.addMessages(messages);
            }
        } catch (ex){
            global.worker.log.error(`exception ${ex.message}`);
        }
    }

    onConnectedHandler (address: string, port: number) {
        this.log.info(`connected to ${address}:${port}`);
    }

    async onDisconnectedHandler() {
        await global.worker.restart();
    }
    //#endregion
}