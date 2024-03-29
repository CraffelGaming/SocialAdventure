import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel.js";
import { Command } from "../controller/command.js";
import { CommandItem } from "../model/commandItem.js";
import { TranslationItem } from "../model/translationItem.js";

export class Module {
    language: string;
    translation: Model<TranslationItem>[];
    basicTranslation: Model<TranslationItem>[];
    commands: Model<CommandItem>[];
    channel: Channel;
    lastRun: Date;
    name: string;

    //#region Construct
    constructor(translation: Model<TranslationItem>[], channel: Channel, name: string) {
        this.translation = translation;
        this.channel = channel;
        this.name = name;
    }
    //#endregion

    //#region Initialize
    async initialize() {
        this.basicTranslation = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'module', language: this.channel.node.getDataValue('language') }, order: [['handle', 'ASC']] }) as Model<TranslationItem>[];
        this.commands = await this.channel.database.sequelize.models.command.findAll({ where: { module: this.name }, order: [['command', 'ASC']] }) as Model<CommandItem>[];
    }
    //#endregion

    //#region Owner
    isOwner(command: Command) {
        let result = false;

        if (this.channel.node.getDataValue('name') === command.source)
            result = true;

        global.worker.log.trace(`is owner: ${result}`);
        return result;
    }
    //#endregion

    //#region Moderator
    isModerator(command: Command) {
        let result = false;

        if (this.channel.moderators && this.channel.moderators.length > 0) {
            if (this.channel.moderators.some(x => x.user_name.toLocaleLowerCase() === command.source.toLocaleLowerCase()))
                result = true;
        }

        global.worker.log.trace(`is moderator: ${result}`);
        return result;
    }
    //#endregion

    //#region Placeholder
    replacePlaceholder(command: Command, text: string): string {
        text = text.replace('$streamer', this.channel.node.getDataValue('name'));

        if (command != null) {
            text = text.replace('$source', command.source);
            text = text.replace('$target', command.target.length > 0 ? command.target : command.source);
            text = text.replace('$command', command.name);


            if (text.includes('$dice')) {
                if (command.parameters.length >= 2) {
                    const min = Number(command.parameters[0]);
                    const max = Number(command.parameters[1]);
                    if (!isNaN(min) && !isNaN(max))
                        text = text.replace('$dice', this.getRandomNumber(min, max).toString());
                    else text = text.replace('$dice', this.getRandomNumber(1, 6).toString());
                } else text = text.replace('$dice', this.getRandomNumber(1, 6).toString());
            }
        }

        return text;
    }
    //#endregion

    //#region Date
    getDateDifferenceSeconds(date: Date): number {
        return Math.floor((Date.now() - date.getTime()) / 1000);
    }

    getDateDifferenceMinutes(date: Date): number {
        return Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    }

    isDateTimeoutExpiredMinutes(date: Date, timeout: number): boolean {
        return this.getDateDifferenceMinutes(date) >= timeout;
    }

    isDateTimeoutExpiredSeconds(date: Date, timeout: number): boolean {
        return this.getDateDifferenceSeconds(date) >= timeout;
    }

    getDateTimeoutRemainingMinutes(date: Date, timeout: number): number {
        const diff = this.getDateDifferenceMinutes(date);
        return diff >= timeout ? 0 : timeout - diff;
    }

    getDateTimeoutRemainingSeconds(date: Date, timeout: number): number {
        const diff = this.getDateDifferenceMinutes(date);
        return diff >= timeout ? 0 : timeout - diff;
    }
    //#endregion

    //#region Random
    getRandomNumber(min: number, max: number): number {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        global.worker.log.trace(`node ${this.channel.node.getDataValue('name')}, new random number ${random} between ${min} and ${max}`);
        return random;
    }
    //#endregion
}