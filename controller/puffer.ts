import { NodeItem } from "../model/nodeItem";

export class Puffer {
    messages: string[];
    node: NodeItem;

    constructor(node: NodeItem){
        this.messages = [];
        this.node = node;
    }

    addMessage(message : string){
        if(message && message.length > 0){
            global.worker.log.trace(`message push ${message}`);
            this.messages.push(message);
        }
    }
    addMessages(messages : string[]){

        for(const key in messages){
            if (messages.hasOwnProperty(key)) {
                global.worker.log.trace(messages[key]);
                if(messages[key] && messages[key].length > 0){
                    global.worker.log.trace(`message push ${messages[key]}`);
                    this.messages.push(messages[key]);
                }
            }
        }
    }
    interval(){
        setInterval(
            () => {
                try{
                    if(this.messages.length > 0){
                        const message = this.messages.shift();
                        global.worker.log.trace(`message shift ${message}`);
                        global.worker.tmi.say(this.node.name, message);
                    }
                } catch (ex){
                    global.worker.log.error(`message error ${ex}`);
                }
            },
            1000 * 1.4 // 1.4 Sekunde(n)
        );
    }
}