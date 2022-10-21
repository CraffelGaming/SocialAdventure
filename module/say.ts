import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { SayItem } from "../model/sayItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";
import twitchData from '../twitch.json';
export class Say extends Module {
    item: SayItem;
    countMessages: number;
    timer: NodeJS.Timer;
    lastCount: Date;

    //#region Construct
    constructor(translation: TranslationItem[], channel: Channel, item: SayItem){
        super(translation, channel, 'say');
        this.countMessages = 0;
        this.lastCount = new Date();
        this.item = item;
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
            global.worker.log.error(`module ${this.item.command} error function remove - ${ex.message}`);
        }
    }
    //#endregion

    //#region Execute
    async execute(command: Command){
        try{
            global.worker.log.trace(`module ${this.item.command} say execute`);

            // START Verbessern...
            if(this.item.isShoutout) {
                global.worker.log.trace(`module ${this.item.command} isShoutout ${this.item.isShoutout}`);
                this.commands.find(x => x.command === '').isModerator = true;
            }
            // ENDE

            if(command.name.startsWith(this.item.command)){
                command.name = command.name.replace(this.item.command, "");

                const allowedCommand = this.commands.find(x => x.command === command.name);
                if(allowedCommand){
                    if(!allowedCommand.isMaster && !allowedCommand.isModerator || this.isOwner(command) || allowedCommand.isModerator && this.isModerator(command)){
                        if(this.item.isActive || allowedCommand.isMaster && this.isOwner(command)) {
                            if(command.name.length === 0) command.name = "shout";
                            command.name = command.name.replace("+", "plus");
                            command.name = command.name.replace("-", "minus");
                            return await this[command.name](command);
                        } else {
                            global.worker.log.trace(`module loot not active`);
                        }

                    } else global.worker.log.warn(`not owner dedection ${this.item.command} ${command.name} blocked`);
                } else global.worker.log.warn(`hack dedection ${this.item.command} ${command.name} blocked`);
            }
        } catch(ex){
            global.worker.log.error(`module ${this.item.command} error ${ex.message}`);
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
                    if(this.item.isActive && this.item.minutes > 0){
                        const delayDifference = this.channel.countMessages - this.countMessages;
                        if(delayDifference >= this.item.delay){
                            global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} last run ${new Date(this.item.lastRun)}...`);

                            if(this.isDateTimeoutExpiredMinutes(new Date(this.item.lastRun), this.item.minutes)){
                                this.item.lastRun = new Date();
                                this.item.countRuns += 1;
                                this.countMessages = this.channel.countMessages;
                                await this.channel.database.sequelize.models.say.update(this.item, {where: {command: this.item.command}});
                                global.worker.log.info(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} run after ${this.item.minutes} Minutes.`);
                                this.channel.puffer.addMessage(this.replacePlaceholder(null, this.item.text));
                            } else {
                                global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed minutes: ${this.item.minutes}`);
                                global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed time elapsed: ${this.getDateDifferenceMinutes(new Date(this.item.lastRun))}`);
                            }
                        } else {
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed delay: ${this.item.delay}`);
                            global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed delay diference: ${delayDifference}`);
                        }
                    } else {
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed active: ${this.item.isActive}`);
                        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} not executed minutes: ${this.item.minutes}`);
                    }
                } catch(ex){
                    global.worker.log.error(`node ${this.channel.node.getDataValue('name')}, module ${this.item.command} automation error.`);
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
            if(this.item.text.includes('$counter') && this.item.isCounter && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.timeout)){
                this.lastCount = new Date();

                if(command.parameters.length > 0){
                    const amount = Number(command.parameters[0]);
                    if(!isNaN(amount)){
                        this.item.count += amount;
                    } else ++this.item.count;
                } else ++this.item.count;

                await this.channel.database.sequelize.models.say.increment('count', { by: 1, where: { command: this.item.command }});
                await this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: {command: this.item.command}});
                return this.replacePlaceholder(command, this.item.text.replace('$counter', this.item.count.toString()));
            }
            return '';
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function plus - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10001');
        }
    }

    async minus(command: Command){
        try {
            if(this.item.text.includes('$counter') && this.item.isCounter && this.isDateTimeoutExpiredSeconds(this.lastCount, this.item.timeout)){
                this.lastCount = new Date();

                if(command.parameters.length > 0){
                    const amount = Number(command.parameters[0]);
                    if(!isNaN(amount)){
                        this.item.count -= amount;
                    } else --this.item.count;
                } else --this.item.count;

                if(this.item.count < 0)
                    this.item.count = 0;

                await this.channel.database.sequelize.models.say.decrement('count', { by: 1, where: { command: this.item.command }});
                await this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: {command: this.item.command}});
                return this.replacePlaceholder(command, this.item.text.replace('$counter', this.item.count.toString()));
            }
            return '';
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function minus - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10002');
        }
    }

    async start(command: Command = null){
        try {
            if(!this.item.isActive){
                this.item.isActive = true;
                this.item.count = 0;
                await this.channel.database.sequelize.models.say.update(this.item, {where: {command: this.item.command}});
                global.worker.log.trace(`module ${this.item.command} set active: ${this.item.isActive}`);
                return TranslationItem.translate(this.basicTranslation, "start");
            }
            else {
                global.worker.log.trace(`module ${this.item.command} already started.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStarted");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function start - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-100003');
        }
    }

    async stop(command: Command = null){
        try {
            if(this.item.isActive){
                this.item.isActive = false;
                await this.channel.database.sequelize.models.say.update(this.item, {where: {command: this.item.command}});
                global.worker.log.trace(`module ${this.item.command} set active: ${this.item.isActive}`);
                return TranslationItem.translate(this.basicTranslation, "stop");
            }
            else {
                global.worker.log.trace(`module ${this.item.command} already stopped.`);
                return TranslationItem.translate(this.basicTranslation, "alreadyStopped");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function stop - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10004');
        }
    }

    async interval(command: Command){
        try {
            if(command.parameters.length > 0){
                const interval =  parseInt(command.parameters[0], 10);
                if(!isNaN(interval) && interval > -1){
                     this.item.minutes = interval;
                     await this.channel.database.sequelize.models.say.update(this.item as any, {where: {command: this.item.command}});
                     return TranslationItem.translate(this.basicTranslation, "intervalChanged").replace("<interval>", command.parameters[0]);
                } else {
                     global.worker.log.trace(`module ${this.item.command} wrong interval parameter.`);
                     return TranslationItem.translate(this.basicTranslation, "noInterval");
                }
         } else {
             global.worker.log.trace(`module ${this.item.command} missing interval parameter.`);
             return TranslationItem.translate(this.basicTranslation, "noParameter");
         }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function interval - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10005');
        }
    }

    async delay(command: Command){
        try {
            if(command.parameters.length > 0){
                const delay =  parseInt(command.parameters[0], 10);
                if(!isNaN(delay) && delay > -1){
                    this.item.delay = delay;
                    await this.channel.database.sequelize.models.say.update(this.item as any, {where: {command: this.item.command}});
                    return TranslationItem.translate(this.basicTranslation, "delayChanged").replace("<delay>", command.parameters[0]);
                } else {
                    global.worker.log.trace(`module ${this.item.command} wrong delay parameter.`);
                    return TranslationItem.translate(this.basicTranslation, "noDelay");
                }
            } else {
                global.worker.log.trace(`module ${this.item.command} missing delay parameter.`);
                return TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function delay - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10006');
        }
    }

    async text(command: Command){
        try {
            if(command.parameters.length > 0) {
                this.item.text = command.parameters[0];
                await this.channel.database.sequelize.models.say.update(this.item as any, {where: {command: this.item.command}});
                global.worker.log.trace(`module ${this.item.command} text changed active: ${this.item.text}`);
                return TranslationItem.translate(this.basicTranslation, "textChanged").replace("<text>", command.parameters[0]);
            } else {
                global.worker.log.trace(`module ${this.item.command} missing text parameter.`);
                return TranslationItem.translate(this.basicTranslation, "noParameter");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function text - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10007');
        }
    }

    async shout(command: Command){
        try {
            let text = '';
            if(this.item.isActive){
                if(this.item.text && this.item.text.length !== 0){
                    text += this.item.text;
                    await this.channel.database.sequelize.models.say.increment('countUses', { by: 1, where: {command: this.item.command}});
                    global.worker.log.trace(`module ${this.item.command} shout executed`);

                    if(this.item.isCounter){
                        text = text.replace('$counter', this.item.count.toString());
                    }

                    if(this.item.isShoutout){
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
                    }
                    return this.replacePlaceholder(command, text);
                 }
                 else {
                    global.worker.log.trace(`module ${this.item.command} shout nothign to say`);
                    return TranslationItem.translate(this.basicTranslation, "nothingToSay").replace("<module>", this.item.command);
                 }
            } else {
                global.worker.log.trace(`module ${this.item.command} not running`);
                return TranslationItem.translate(this.basicTranslation, "notRunning");
            }
        } catch(ex) {
            global.worker.log.error(`module ${this.item.command} error function start - ${ex.message}`);
            return TranslationItem.translate(this.basicTranslation, "ohNo").replace('$1', 'E-10008');
        }
    }
    //#endregion
}