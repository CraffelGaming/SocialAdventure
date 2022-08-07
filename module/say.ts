import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { SayItem } from "../model/sayItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";

export class Say extends Module {
    item: SayItem;

    constructor(translation: TranslationItem[], channel: Channel, item: SayItem){
        super(translation, channel);
        this.item = item;
    }

    initialize(){
        global.worker.log.trace('say initialize');
    }

    execute(command: Command){
        try{
            global.worker.log.trace('say execute');
            return this[command.name.replaceAll('!','')]();
        } catch(ex){
            return '';
        }
    }
}