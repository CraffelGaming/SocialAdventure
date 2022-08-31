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
exports.Loot = void 0;
const module_1 = require("./module");
class Loot extends module_1.Module {
    //#region Construct
    constructor(translation, channel) {
        super(translation, channel, 'loot');
        this.automation();
    }
    //#endregion
    //#region Execute
    execute(command) {
        try {
            global.worker.log.trace('loot execute');
            const allowedCommand = this.commands.find(x => x.command === command.name);
            if (allowedCommand) {
                if (!allowedCommand.isMaster || this.isOwner(command)) {
                    return this[command.name]();
                }
                else
                    global.worker.log.trace(`not owner dedection loot ${command.name} blocked`);
            }
            else {
                global.worker.log.trace(`hack dedection loot ${command.name} blocked`);
            }
        }
        catch (ex) {
            global.worker.log.error(`loot error ${ex.message}`);
        }
        return '';
    }
    //#endregion
    //#region Automation
    automation() {
        this.timer = setInterval(() => __awaiter(this, void 0, void 0, function* () {
            global.worker.log.info(`node ${this.channel.node.name}, module loot run automtion Minutes.`);
            this.channel.puffer.addMessage("loot executed");
        }), 600000 // Alle 10 Minuten
        );
    }
    //#endregion
    //#region Commands
    inventory() {
        return 'inventory';
    }
    steal() {
        return 'steal';
    }
    give() {
        return 'give';
    }
    find() {
        return 'find';
    }
    leave() {
        return 'leave';
    }
    gold() {
        return 'gold';
    }
    chest() {
        return 'chest';
    }
    level() {
        return 'level';
    }
    adventure() {
        return 'adventure';
    }
    blut() {
        return 'blut';
    }
    rank() {
        return 'rank';
    }
    diamond() {
        return 'diamond';
    }
    lootstart() {
        return 'lootstart';
    }
    lootstop() {
        return 'lootstop';
    }
    lootclear() {
        return 'lootclear';
    }
    //#endregion
    //#region Shortcots
    inv() {
        this.inventory();
    }
    lvl() {
        this.level();
    }
}
exports.Loot = Loot;
//# sourceMappingURL=loot.js.map