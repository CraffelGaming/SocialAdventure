import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";

export class Loot extends Module {
    timer: NodeJS.Timer;

    //#region Construct
    constructor(translation: TranslationItem[], channel: Channel){
        super(translation, channel, 'loot');
        this.automation();
    }
    //#endregion

    //#region Execute
    async execute(command: Command){
        try{
            global.worker.log.trace('loot execute');
            const allowedCommand = this.commands.find(x => x.command === command.name);
            if(allowedCommand){
                if(!allowedCommand.isMaster || this.isOwner(command)){
                    return await this[command.name](command);
                } else global.worker.log.warn(`not owner dedection loot ${command.name} blocked`);
            } else {
                global.worker.log.warn(`hack dedection loot ${command.name} blocked`);
            }
        } catch(ex){
            global.worker.log.error(`loot error - function execute - ${ex.message}`);
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

    //#region Join / Leave
    async loot(command: Command){
        try{
            const value : [Model<HeroItem>, boolean] = await this.channel.database.sequelize.models.hero.findOrCreate({
                defaults: { isActive: true, lastJoin: new Date() },
                where: { name: command.source}
            }) as [Model<HeroItem>, boolean];

            if(value[1]){
                    return TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                } else {
                    if(!value[0].getDataValue("isActive")){
                        value[0].setDataValue("isActive",true);
                        value[0].setDataValue("lastJoin",new Date());
                        await value[0].save();
                        return TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);
                    } else return TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
                }
        } catch (ex){
            global.worker.log.error(`loot error - function loot - ${ex.message}`);
        }
    }

    async leave(command: Command){
        try{
            const hero = await this.channel.database.sequelize.models.hero.findByPk(command.source) as Model<HeroItem>;
            if(hero !== undefined){
                if(hero.getDataValue("isActive") === true){
                    hero.setDataValue("isActive", false)
                    await hero.save();
                    return TranslationItem.translate(this.translation, 'heroLeave').replace('$1', command.source);
                } else return TranslationItem.translate(this.translation, 'heroNotJoined').replace('$1', command.source);
            } else return TranslationItem.translate(this.translation, 'heroNotExists').replace('$1', command.source);
        } catch (ex){
            global.worker.log.error(`loot error - function leave - ${ex.message}`);
        }
    }
    //#endregion

    //#region Statistics
    async adventure(command: Command){
        try{
            const count = await this.channel.database.sequelize.models.hero.count({where: {isActive: true}});
            global.worker.log.trace(`loot adventure - count - ${count}`);
            return TranslationItem.translate(this.translation, 'heroCount').replace('$1', count.toString());
        } catch (ex){
            global.worker.log.error(`loot error - function adventure - ${ex.message}`);
        }
    }
    //#endregion

    //#region Commands
    inventory(command: Command){
        return 'inventory';
    }

    steal(command: Command){
        return 'steal';
    }

    give(command: Command){
        return 'give';
    }

    find(command: Command){
        return 'find';
    }

    gold(command: Command){
        return 'gold';
    }

    chest(command: Command){
        return 'chest';
    }

    level(command: Command){
        return 'level';
    }

    blut(command: Command){
        return 'blut';
    }

    rank(command: Command){
        return 'rank';
    }

    diamond(command: Command){
        return 'diamond';
    }

    lootstart(command: Command){
        return 'lootstart';
    }

    lootstop(command: Command){
        return 'lootstop';
    }

    lootclear(command: Command){
        return 'lootclear';
    }
    //#endregion

    //#region Shortcots
    inv(command: Command){
        this.inventory(command);
    }

    lvl(command: Command){
        this.level(command);
    }
    //#endregion
}