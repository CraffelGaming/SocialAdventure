import { Connection } from '../database/connection';
import { NodeItem } from '../model/nodeItem';

export class Channel {
    node: NodeItem;
    database: Connection;

    constructor( node: NodeItem){
        this.node = node;
        this.database = new Connection({ databaseName: Buffer.from(node.name).toString('base64') });
    }
}

module.exports.default = Channel;