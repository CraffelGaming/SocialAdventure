"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loot = void 0;
const module_1 = require("./module");
class Loot extends module_1.Module {
    constructor(translation, channel) {
        super(translation, channel);
    }
    execute(command) {
        try {
            global.worker.log.trace('loot execute');
            return this[command.name]();
        }
        catch (ex) {
            return '';
        }
    }
    loot() {
        return 'Lootieloot';
    }
}
exports.Loot = Loot;
//# sourceMappingURL=loot.js.map