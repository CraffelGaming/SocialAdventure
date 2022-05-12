"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Channel = void 0;
const connection_1 = require("../database/connection");
class Channel {
    constructor(node) {
        this.node = node;
        this.database = new connection_1.Connection({ databaseName: Buffer.from(node.name).toString('base64') });
    }
}
exports.Channel = Channel;
module.exports.default = Channel;
//# sourceMappingURL=channel.js.map