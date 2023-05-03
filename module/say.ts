import { Channel } from "../controller/channel.js";
import { Command } from "../controller/command.js";
import { SayItem } from "../model/sayItem.js";
import { TranslationItem } from "../model/translationItem.js";
import { Module } from "./module.js";
import { Model } from "sequelize-typescript";
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const twitchData = JSON.parse(fs.readFileSync(path.join(dirname, '/../', 'twitch.json')).toString());

export class Say extends Module {
    item: Model<SayItem>;
    countMessages: number;
    timer: NodeJS.Timer;
    lastCount: Date;
    shortcuts: string[];

    //#region Construct
    constructor(translation: Model<TranslationItem>[], channel: Channel, item: Model<SayItem>){
        super(translation, channel, 'say');
        this.countMessages = 0;
        this.lastCount = new Date();
        this.item = item;

        if(this.item.getDataValue('shortcuts'))
            this.shortcuts = this.item.getDataValue('shortcuts').split(' ');

        this.automation();
    }
    //#endregion

    //#region Remove
    remove(){
        try {
            if(this.timer != null){
                clearInterval(this.timer);
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function remove - ${ex.message}`);
        }
    }
    //#endregion

    //#region Execute
    async execute(command: Command){
        let isExecute = false;
        try{
            global.worker.log.trace(`module ${this.item.getDataValue("command")} say execute`);

            if(command.name.startsWith(this.item.getDataValue("command"))){
                command.name = command.name.replace(this.item.getDataValue("command"), '');
                isExecute = true;
            } else {
                if(this.shortcuts){
                    for(const shortcut of this.shortcuts){
                        if(command.name.startsWith(shortcut)){
                            command.name = command.name.replace(shortcut, '');
                            isExecute = true;
                            break;
                        }
                    }
                }
            }

            if(isExecute){
                const allowedCommand = this.commands.find(x => x.getDataValue('command') === command.name);

                if(allowedCommand){
                    const isAllowed = !allowedCommand.getDataValue('isMaster') && !allowedCommand.getDataValue('isModerator') || this.isOwner(command) || allowedCommand.getDataValue('isModerator') && this.isModerator(command);
                    const isAdmin = allowedCommand.getDataValue('isMaster') && this.isOwner(command) || allowedCommand.getDataValue('isModerator') && this.isModerator(command);

                    if(isAllowed){
                        if(this.item.getDataValue("isActive") || isAdmin) {
                            if(command.name.length === 0) command.name = "shout";
                            command.name = command.name.replace("+", "plus");
                            command.name = command.name.replace("-", "minus");
                            return await this[command.name](command);
                        } else {
                            global.worker.log.trace(`module loot not active`);
                        }
                    } else global.worker.log.warn(`not owner dedection ${this.item.getDataValue("command")} ${command.name} blocked`);
                } else global.worker.log.warn(`hack dedection ${this.item.getDataValue("command")} ${command.name} blocked`);
            }
        } catch(ex){
            global.worker.log.error(`module ${this.item.getDataValue("command")} error ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10000');
        }
        return '';
    }
    //#endregion

    //#region Automation
    automation(){
        this.timer = setInterval(
            async () => {
                try {
                    if(this.item.getDataValue("isActive") && this.item.getDataValue("minutes") > 0){
                        const delayDifference = this.channel.countMessages - this.countMessages;
                        if(delayDifference >= this.item.getDataValue("delay")){
                            global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} last run ${new Date(this.item.getDataValue("lastRun"))}...`);

                            if(this.isDateTimeoutExpiredMinutes(new Date(this.item.getDataValue("lastRun")), this.item.getDataValue("minutes"))){
                                this.item.setDataValue("lastRun", new Date());
                                this.item.setDataValue("countRuns", this.item.getDataValue("countRuns") + 1);
                                this.countMessages = this.channel.countMessages;
                                await this.item.save();
                                global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} run after ${this.item.getDataValue("minutes")} Minutes.`);
                                this.channel.puffer.addMessage(this.replacePlaceholder(null, this.item.getDataValue("text")));
                            } else {
                                global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed minutes: ${this.item.getDataValue("minutes")}`);
                                global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed time elapsed: ${this.getDateDifferenceMinutes(new Date(this.item.getDataValue("lastRun")))}`);
                            }
                        } else {
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed delay: ${this.item.getDataValue("delay")}`);
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed delay diference: ${delayDifference}`);
                        }
                    } else {
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed active: ${this.item.getDataValue("isActive")}`);
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} not executed minutes: ${this.item.getDataValue("minutes")}`);
                    }
                } catch(ex){
                    global.worker.log.error(`node ${this.channel.node.getDataValue('name')}, module ${this.item.getDataValue("command")} automation error.`);
                    global.worker.log.error(`exception ${ex.message}`);
                }
            },
            60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion

    //#region Commands
    async plus(command: Command){
        try {
            if(this.item.getDataValue("text").includes('$counter') && this.item.getDataValue("isCounter") && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.getDataValue("timeout"))){
                this.lastCount = new Date();

                if(command.parameters.length > 0){
                    const amount = Number(command.parameters[0]);
                    if(!isNaN(amount)){
                        this.item.setDataValue("count", this.item.getDataValue("count") + amount);
                    } else this.item.setDataValue("count", this.item.getDataValue("count") + 1);
                } else this.item.setDataValue("count", this.item.getDataValue("count") + 1);
                this.item.setDataValue("countUses", this.item.getDataValue("countUses") + 1);
                await this.item.save();

                return this.replacePlaceholder(command, this.item.getDataValue("text").replace('$counter', this.item.getDataValue("count").toString()));
            }
            return '';
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function plus - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10001');
        }
    }

    async minus(command: Command){
        try {
            if(this.item.getDataValue("text").includes('$counter') && this.item.getDataValue("isCounter") && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.getDataValue("timeout"))){
                this.lastCount = new Date();

                if(command.parameters.length > 0){
                    const amount = Number(command.parameters[0]);
                    if(!isNaN(amount)){
                        this.item.setDataValue("count", this.item.getDataValue("count") - amount);
                    } else this.item.setDataValue("count", this.item.getDataValue("count") - 1);
                } else this.item.setDataValue("count", this.item.getDataValue("count") - 1);

                if(this.item.getDataValue("count") < 0){
                    this.item.setDataValue("count", 0);
                }

                this.item.setDataValue("countUses", this.item.getDataValue("countUses") + 1);
                await this.item.save();

                return this.replacePlaceholder(command, this.item.getDataValue("text").replace('$counter', this.item.getDataValue("count").toString()));
            }
            return '';
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function minus - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10002');
        }
    }

    async start(command: Command = null){
        try {
            if(!this.item.getDataValue("isActive")){
                this.item.setDataValue("isActive", true);
                this.item.setDataValue("count", 0);
                this.item.setDataValue("lastRun", new Date());

                await this.item.save();
                global.worker.log.trace(`module ${this.item.getDataValue("command")} set active: ${this.item.getDataValue("isActive")}`);
                return TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} already started.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function start - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-100003');
        }
    }

    async stop(command: Command = null){
        try {
            if(this.item.getDataValue("isActive")){
                this.item.setDataValue("isActive", false);
                await this.item.save();
                global.worker.log.trace(`module ${this.item.getDataValue("command")} set active: ${this.item.getDataValue("isActive")}`);
                return TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} already stopped.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function stop - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10004');
        }
    }

    async interval(command: Command){
        try {
            if(command.parameters.length > 0){
                const interval =  parseInt(command.parameters[0], 10);
                if(!isNaN(interval) && interval > -1){
                     this.item.setDataValue("minutes", interval);
                     await  this.item.save();
                     return TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
                } else {
                     global.worker.log.trace(`module ${this.item.getDataValue("command")} wrong interval parameter.`);
                     return TranslationItem.translate(this.basicTranslation, "noInterval");
                }
         } else {
             global.worker.log.trace(`module ${this.item.getDataValue("command")} missing interval parameter.`);
             return TranslationItem.translate(this.basicTranslation, "noParameter");
         }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function interval - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10005');
        }
    }

    async delay(command: Command){
        try {
            if(command.parameters.length > 0){
                const delay =  parseInt(command.parameters[0], 10);
                if(!isNaN(delay) && delay > -1){
                    this.item.setDataValue("delay", delay);
                    await this.item.save();
                    return TranslationItem.translate(this.basicTranslation, "delayChanged").replace("<delay>", command.parameters[0]);
                } else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} wrong delay parameter.`);
                    return TranslationItem.translate(this.basicTranslation, "noDelay");
                }
            } else {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} missing delay parameter.`);
                return TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function delay - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10006');
        }
    }

    async text(command: Command){
        try {
            if(this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.getDataValue("timeout"))){
                if(command.parameters.length > 0) {
                    this.item.setDataValue("text", command.parameters[0]);
                    await  this.item.save();
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} text changed active: ${this.item.getDataValue("text")}`);
                    return TranslationItem.translate(this.basicTranslation, "textChanged").replace("<text>", command.parameters[0]);
                } else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} missing text parameter.`);
                    return TranslationItem.translate(this.basicTranslation, "noParameter");
                }
            } else {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} timeout not expired.`);
                return '';
            }
        
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function text - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10007');
        }
    }

    async shout(command: Command){
        try {
            let text = '';
            if(this.item.getDataValue("isActive")){
                if(this.item.getDataValue("text") && this.item.getDataValue("text").length !== 0){
                    text += this.item.getDataValue("text");
                    await this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: {command: this.item.getDataValue("command")}});
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} shout executed`);

                    if(this.item.getDataValue("isCounter")){
                        text = text.replace('$counter', this.item.getDataValue("count").toString());
                    }

                    if(this.item.getDataValue("isShoutout")){
                        if(command.target) {
                            const raider = await this.channel.twitch.getUserByName(command.target);
                            if(raider){
                                const raiderChannel = await this.channel.twitch.GetChannel(raider.id);

                                if(raiderChannel){
                                    text = text.replace('$raider', raider.display_name);
                                    text = text.replace('$raiderGame', raiderChannel.game_name);
                                    text = text.replace('$raiderTitle', raiderChannel.title);
                                    text = text.replace('$raiderUrl', twitchData.url_twitch + raider.login);
                                }
                            }
                        } else {
                            global.worker.log.trace(`module ${this.item.getDataValue("command")} shout shoutout need target`);
                            return TranslationItem.translate(this.basicTranslation, "shoutoutNeedTarget").replace("$1", command.source);
                        }
                    }
                    return this.replacePlaceholder(command, text);
                 }
                 else {
                    global.worker.log.trace(`module ${this.item.getDataValue("command")} shout nothign to say`);
                    return TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.getDataValue("command"));
                 }
            } else {
                global.worker.log.trace(`module ${this.item.getDataValue("command")} not running`);
                return TranslationItem.translate(this.basicTranslation, "notRunning");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.getDataValue("command")} error function start - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10008');
        }
    }
    //#endregion
}