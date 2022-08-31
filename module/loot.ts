import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";

export class Loot extends Module {
    heroes: HeroItem[];
    items: ItemItem[];
    timer: NodeJS.Timer;

    //#region Construct
    constructor(translation: TranslationItem[], channel: Channel){
        super(translation, channel, 'loot');
        this.automation();
    }
    //#endregion

    //#region Execute
    execute(command: Command){
        try{
            global.worker.log.trace('loot execute');
            const allowedCommand = this.commands.find(x => x.command === command.name);
            if(allowedCommand){
                if(!allowedCommand.isMaster || this.isOwner(command)){
                    return this[command.name]();
                } else global.worker.log.trace(`not owner dedection loot ${command.name} blocked`);
            } else {
                global.worker.log.trace(`hack dedection loot ${command.name} blocked`);
            }
        } catch(ex){
            global.worker.log.error(`loot error ${ex.message}`);
        }
        return '';
    }
    //#endregion

    //#region Automation
    automation(){
        this.timer = setInterval(
            async () => {
                global.worker.log.info(`node ${this.channel.node.name}, module loot run automtion Minutes.`);
                this.channel.puffer.addMessage("loot executed");
            },
            600000 // Alle 10 Minuten
        );
    }
    //#endregion

    //#region Commands
    inventory(){
        return 'inventory';
    }

    steal(){
        return 'steal';
    }

    give(){
        return 'give';
    }

    find(){
        return 'find';
    }

    leave(){
        return 'leave';
    }

    gold(){
        return 'gold';
    }

    chest(){
        return 'chest';
    }

    level(){
        return 'level';
    }

    adventure(){
        return 'adventure';
    }

    blut(){
        return 'blut';
    }

    rank(){
        return 'rank';
    }

    diamond(){
        return 'diamond';
    }

    lootstart(){
        return 'lootstart';
    }

    lootstop(){
        return 'lootstop';
    }

    lootclear(){
        return 'lootclear';
    }
    //#endregion

    //#region Shortcots
    inv(){
        this.inventory();
    }

    lvl(){
        this.level();
    }
    //#endregion
}