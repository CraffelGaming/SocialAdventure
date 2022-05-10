import { Connection } from '../database/connection';

export class Worker {
    globalDatabase: Connection;
    constructor(){
        this.globalDatabase = new Connection(Buffer.from('global').toString('base64'), "../model", "../database/migrations");
    }

    async initialize(){
        await this.globalDatabase.initialize();
    }
}