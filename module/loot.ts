import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";

export class Loot extends Module {
    heroes: HeroItem[];
    items: ItemItem[];

    constructor(translation: TranslationItem[], channel: Channel){
        super(translation, channel);
    }


    initialize(){
        global.worker.log.trace('loot initialize');
    }

    execute(command: Command){
        try{
            global.worker.log.trace('loot execute');
            return this[command.name.replaceAll('!','')]();
        } catch(ex){
            return '';
        }
    }

    loot(){
        return 'Lootieloot';
    }
}