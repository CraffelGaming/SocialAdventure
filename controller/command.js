"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Command = void 0;
class Command {
    constructor(message) {
        this.name = "";
        this.message = message;
        this.target = "";
        this.parameters = [];
        const parts = message.match(/(?:[^\s:"]+|"[^"]*")+/g);
        global.worker.log.trace(parts);
        for (const part in parts) {
            if (parts[part].trim().startsWith("!"))
                this.name = parts[part].trim().toLowerCase();
            else if (parts[part].startsWith("@"))
                this.target = parts[part].trim().toLowerCase();
            else
                this.parameters.push(parts[part].replaceAll('"', '').trim());
        }
    }
}
exports.Command = Command;
//# sourceMappingURL=command.js.map