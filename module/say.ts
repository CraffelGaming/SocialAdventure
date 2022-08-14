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

    async execute(command: Command){
        try{
            global.worker.log.trace('say execute');

            if(command.name.startsWith(this.item.command)){
                command.name = command.name.replace(this.item.command, "");
                if(command.name.length === 0) command.name = "shout";
                return await this[command.name](command);
            }

        } catch(ex){
            return '';
        }
    }

    async start(command: Command){
        if(!this.item.isActive){
            this.item.isActive = true;
            await this.channel.database.sequelize.models.say.update(this.item, {where: {command: this.item.command}});
            return TranslationItem.translate(this.basicTranslation, "start");
        }
        else {
            return TranslationItem.translate(this.basicTranslation, "alreadyStarted");
        }
    }

    async stop(command: Command){
        if(this.item.isActive){
            this.item.isActive = false;
            await this.channel.database.sequelize.models.say.update(this.item, {where: {command: this.item.command}});
            return TranslationItem.translate(this.basicTranslation, "stop");
        }
        else {
            return TranslationItem.translate(this.basicTranslation, "alreadyStopped");
        }
    }

    async interval(command: Command){
        if(command.parameters.length > 0){
               const interval =  parseInt(command.parameters[0], 10);
               if(!isNaN(interval)){
                    this.item.minutes = interval;
                    await this.channel.database.sequelize.models.say.update(this.item as any, {where: {command: this.item.command}});
                    return TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
               } else {
                    return TranslationItem.translate(this.basicTranslation, "noInterval");
               }
        } else {
            return TranslationItem.translate(this.basicTranslation, "noParameter");
        }
    }

    async text(command: Command){
        return 'text';
    }

    async shout(command: Command){
        if(this.item.isActive){
            if(this.item.text && this.item.text.length !== 0){
                return this.item.text;
             }
             else {
                return TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.command);
             }
        } else {
            return TranslationItem.translate(this.basicTranslation, "notRunning");
        }
    }
}