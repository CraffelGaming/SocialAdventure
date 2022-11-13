import * as express from 'express';
import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');
import { NodeItem } from '../model/nodeItem';
import { Channel } from './channel';
import tmi = require('tmi.js');
import tmiSettings = require('../bot.json');
import { Command } from './command';
import { Twitch } from './twitch';
import { TranslationItem } from '../model/translationItem';
import { Model } from 'sequelize';
export class Worker {
    pathModel: string;
    pathMigration: string
    globalDatabase: Connection;
    channels: Channel[];
    log: log4js.Logger;
    tmi: any;
    twitch: Twitch;
    botCredential: credentialItem;
    translation: Model<TranslationItem>[];

    //#region Construct
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
    //#endregion

    //#region Restart
    async restart(){
        global.worker.tmi = new tmi.client(tmiSettings);
        global.worker.channels = [];
        await global.worker.initialize();
    }
    //#endregion

    //#region Initialize
    async initialize(){
        try {
            await this.globalDatabase.initializeGlobal();

            // Twitch API bot login automation
            await this.connect();

            // Load default Translation
            this.translation = await this.globalDatabase.sequelize.models.translation.findAll({where: { language: 'default' }, order: [ [ 'handle', 'ASC' ]]}) as Model<TranslationItem>[];

            for(const node of Object.values(await this.globalDatabase.sequelize.models.node.findAll({include: [{
                model: global.worker.globalDatabase.sequelize.models.twitchUser,
                as: 'twitchUser',
            }]})) as unknown as NodeItem[]){
                this.startNode(node); // no await needed
            }
            global.worker.log.info(`--------------------------------------`);
            global.worker.log.info(`---------- ALL NODES ADDED -----------`);
            global.worker.log.info(`--------------------------------------`);
        } catch(ex) {
            global.worker.log.error(`worker error - function initialize - ${ex.message}`);
        }
    }
    //#endregion

    //#region Node
    async startNode(node: NodeItem) : Promise<Channel>{
        try {
            let channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);

            if(channel == null){
                this.log.trace('add Node ' + node.name);
                channel = new Channel(node, this.translation);
                await channel.initialize();

                // Register Channel to twitch
                this.register(channel);
                this.channels.push(channel);
            } else {
                this.log.trace('Node already added ' + node.name);
            }

            return channel;

        } catch(ex) {
            global.worker.log.error(`worker error - function startNode - ${ex.message}`);
        }

        return null;
    }
    //#endregion

    //#region Twitch API client login on Webpage
    async login(request: express.Request, response: express.Response, callback: any){
        try {
            const twitch = new Twitch();
            if(await twitch.login(request.session.state, request.query.code.toString())){
                request.session.twitch =  twitch.credential;
                request.session.userData = twitch.credentialUser;
            }
        } catch(ex) {
            global.worker.log.error(`worker error - function login - ${ex.message}`);
        }

        if(callback != null)
            callback(request, response);
    }
    //#endregion

    //#region Chatbot
    async connect(){
        try {
            this.botCredential = await Twitch.botAuthentification();

            this.tmi.on('message', this.onMessageHandler);
            this.tmi.on('connected', this.onConnectedHandler);
            this.tmi.on('disconnected', this.onDisconnectedHandler);

            await this.tmi.connect();
        } catch(ex) {
            global.worker.log.error(`worker error - function connect - ${ex.message}`);
        }
    }

    register(channel: Channel){
        try {
            this.log.trace('node connected: ' + channel.node.getDataValue('name'));
            this.tmi.join(channel.node.getDataValue('name').replace('#', ''));
            this.log.trace(this.tmi);
        } catch(ex) {
            global.worker.log.error(`worker error - function register - ${ex.message}`);
        }
    }

    async onMessageHandler (target : string, context : any, message : string, self: boolean) {
        try{
            global.worker.log.trace('incomming message self: ' + self);

            if (self) { return; }

            const channel = global.worker.channels.find(x => x.node.getDataValue('name') === target.replace('#',''))

            if(channel){
                if(!message.trim().toLowerCase().startsWith('!')) {
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
        } catch (ex){
            global.worker.log.error(`worker error - function onMessageHandler - ${ex.message}`);
        }
    }

    onConnectedHandler (address: string, port: number) {
        try {
            this.log.info(`connected to ${address}:${port}`);
        } catch(ex) {
            global.worker.log.error(`worker error - function onConnectedHandler - ${ex.message}`);
        }

    }

    async onDisconnectedHandler() {
        try {
            global.worker.log.warn(`worker warn - function onDisconnectedHandler - Reconnect Disabled`);
            //await global.worker.restart();
        } catch(ex) {
            global.worker.log.error(`worker error - function onDisconnectedHandler - ${ex.message}`);
        }
    }
    //#endregion
}