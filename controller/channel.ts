import { Connection } from '../database/connection';
import { NodeItem } from '../model/nodeItem';
import { Say } from '../module/say';
import { Loot } from '../module/loot';
import { Puffer } from './puffer';
import { SayItem } from '../model/sayItem';
import { Command } from './command';
import { TranslationItem } from '../model/translationItem';

export class Channel {
    countMessages: number;
    node: NodeItem;
    database: Connection;
    puffer: Puffer;
    say: Say[];
    loot: Loot;

    constructor(node: NodeItem){
        this.node = node;
        this.countMessages = 0;
        this.database = new Connection({ databaseName: Buffer.from(node.name).toString('base64') });
        this.puffer = new Puffer(node),
        this.puffer.interval();
        this.say = [];
    }

    async addSays(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'say', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]

        for(const item of Object.values(await this.database.sequelize.models.say.findAll({order: [ [ 'command', 'ASC' ]], raw: true})) as unknown as SayItem[]){
            const element = new Say(translation, this, item);
            await element.initialize();
            this.say.push(element);
            global.worker.log.info(`node ${this.node.name}, say add ${element.item.command}.`);
        }
    }

    async addSay(item: SayItem){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'say', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]
        const element = new Say(translation, this, item);
        await element.initialize();
        this.say.push(element);
        global.worker.log.info(`node ${this.node.name}, say add ${element.item.command}.`);
    }

    async removeSay(command: string){
        const index = this.say.findIndex(d => d.item.command === command);

        if(index > -1){
            global.worker.log.info(`node ${this.node.name}, say remove ${this.say[index].item.command}.`);
            this.say[index].remove();
            this.say.splice(index, 1)
        }
    }

    async addLoot(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'loot', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]
        this.loot = new Loot(translation, this);
        await this.loot.initialize();
    }

    async execute(command: Command){
        const messages : string[] = [];

        messages.push(this.loot.execute(command));

        for(const key in Object.keys(this.say)){
            if (this.say.hasOwnProperty(key)) {
                messages.push(await this.say[key].execute(command))
            }
        }
        return messages;
    }
}

module.exports.default = Channel;