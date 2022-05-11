import { Connection } from '../database/connection';
import log4js = require('log4js');
import path = require('path');

export class Worker {
    globalDatabase: Connection;
    constructor(log: log4js.Logger){
        const model = path.join(__dirname, '..', 'model');
        const migration = path.join(__dirname, '..','database', 'migrations');

        log.trace('Model Path: ' + model);
        log.trace('Migration Path: ' + migration);

        this.globalDatabase = new Connection(Buffer.from('global').toString('base64'), model, migration);
    }

    async initialize(){
        await this.globalDatabase.initialize();
    }
}