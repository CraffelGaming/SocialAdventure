"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Puffer = void 0;
class Puffer {
    constructor(node) {
        this.messages = [];
        this.node = node;
    }
    addMessage(message) {
        if (message && message.length > 0) {
            global.worker.log.trace(`message push ${message}`);
            this.messages.push(message);
        }
    }
    addMessages(messages) {
        for (const key in messages) {
            if (messages.hasOwnProperty(key)) {
                global.worker.log.trace(messages[key]);
                if (messages[key] && messages[key].length > 0) {
                    global.worker.log.trace(`message push ${messages[key]}`);
                    this.messages.push(messages[key]);
                }
            }
        }
    }
    interval() {
        setInterval(() => {
            try {
                if (this.messages.length > 0) {
                    const message = this.messages.shift();
                    global.worker.log.trace(`message shift ${message}`);
                    global.worker.tmi.say(this.node.name, message);
                }
            }
            catch (ex) {
                global.worker.log.error(`message error ${ex}`);
            }
        }, 1000 * 1.4 // 1.4 Sekunde(n)
        );
    }
}
exports.Puffer = Puffer;
//# sourceMappingURL=puffer.js.map