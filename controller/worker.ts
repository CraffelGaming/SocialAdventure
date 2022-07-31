import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');
import { NodeItem } from '../model/nodeItem';
import { Channel } from './channel';
export class Worker {
    pathModel: string;
    pathMigration: string
    globalDatabase: Connection;
    channels: Channel[];
    log: log4js.Logger;

    constructor(log: log4js.Logger){
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..','database', 'migrations');
        this.channels = [];

        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);

        this.globalDatabase = new Connection({ databaseName: Buffer.from('global').toString('base64')});
    }

    async initialize(){
        await this.globalDatabase.initializeGlobal();

        for(const item of Object.values(await this.globalDatabase.sequelize.models.node.findAll()) as unknown as NodeItem[]){
            this.log.trace('add Node ' + item.name);
            const channel = new Channel(item);
            channel.database.initialize();
            this.channels.push(channel);
        }
    }

    connect(client: any){
        for(const channel of this.channels){
            this.log.trace('node connected: ' + channel.node.name);
            client.join(channel.node.name.replace('#', ''));
        }
    }
}