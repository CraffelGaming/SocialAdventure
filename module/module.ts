import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { TranslationItem } from "../model/translationItem";

export class Module {
    language: string;
    translation: TranslationItem[];
    basicTranslation: TranslationItem[];
    channel: Channel;
    lastRun: Date;

    constructor(translation : TranslationItem[], channel: Channel){
        this.translation = translation;
        this.channel = channel;

    }

    async initialize(){
        this.basicTranslation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'module', language: this.channel.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[];
    }

    isOwner(command : Command){
        let result = false;

        if(this.channel.node.name === command.source)
            result = true;

        global.worker.log.trace(`is owner: ${result}`);
        return result;
    }
}