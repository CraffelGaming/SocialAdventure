"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Say = void 0;
const module_1 = require("./module");
class Say extends module_1.Module {
    constructor(translation, channel, item) {
        super(translation, channel);
        this.item = item;
    }
    initialize() {
        global.worker.log.trace('say initialize');
    }
    execute(command) {
        try {
            global.worker.log.trace('say execute');
            return this[command.name.replaceAll('!', '')]();
        }
        catch (ex) {
            return '';
        }
    }
}
exports.Say = Say;
//# sourceMappingURL=say.js.map