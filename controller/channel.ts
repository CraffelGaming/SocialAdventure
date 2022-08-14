import { Connection } from '../database/connection';
import { NodeItem } from '../model/nodeItem';
import { Say } from '../module/say';
import { Loot } from '../module/loot';
import { Puffer } from './puffer';
import { SayItem } from '../model/sayItem';
import { HeroItem } from '../model/heroItem';
import { ItemItem } from '../model/itemItem';
import { Command } from './command';
import { TranslationItem } from '../model/translationItem';

export class Channel {
    node: NodeItem;
    database: Connection;
    puffer: Puffer;
    say: Say[];
    loot: Loot;

    constructor(node: NodeItem){
        this.node = node;
        this.database = new Connection({ databaseName: Buffer.from(node.name).toString('base64') });
        this.puffer = new Puffer(node),
        this.puffer.interval();
        this.say = [];
    }

    async addSay(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'say', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]

        for(const item of Object.values(await this.database.sequelize.models.say.findAll({order: [ [ 'command', 'ASC' ]], raw: true})) as unknown as SayItem[]){
            const element = new Say(translation, this, item)
            await element.initialize();
            this.say.push(element);
        }
        // global.worker.log.trace(this.say);
    }

    async addLoot(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'loot', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]
        this.loot = new Loot(translation, this);
        await this.loot.initialize();
        // global.worker.log.trace(this.loot);
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