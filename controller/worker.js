"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Worker = void 0;
const connection_1 = require("../database/connection");
const path = require("path");
const channel_1 = require("./channel");
class Worker {
    constructor(log) {
        this.log = log;
        this.pathModel = path.join(__dirname, '..', 'model');
        this.pathMigration = path.join(__dirname, '..', 'database', 'migrations');
        this.channels = [];
        this.log.trace('basic model path: ' + this.pathModel);
        this.log.trace('basic migration path: ' + this.pathMigration);
        this.globalDatabase = new connection_1.Connection({ databaseName: Buffer.from('global').toString('base64') });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.globalDatabase.initializeGlobal();
            for (const item of Object.values(yield this.globalDatabase.sequelize.models.node.findAll())) {
                this.log.trace('add Node ' + item.name);
                const channel = new channel_1.Channel(item);
                channel.database.initialize();
                this.channels.push(channel);
            }
        });
    }
    connect(client) {
        for (const channel of this.channels) {
            this.log.trace('node connected: ' + channel.node.name);
            client.join(channel.node.name.replace('#', ''));
        }
    }
}
exports.Worker = Worker;
//# sourceMappingURL=worker.js.map