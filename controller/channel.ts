import { Connection } from '../database/connection';
import { NodeItem } from '../model/nodeItem';
import { Say } from '../module/say';
import { Loot } from '../module/loot';
import { Puffer } from './puffer';
import { SayItem } from '../model/sayItem';
import { Command } from './command';
import { TranslationItem } from '../model/translationItem';
import { Twitch } from './twitch';

export class Channel {
    countMessages: number;
    node: NodeItem;
    database: Connection;
    puffer: Puffer;
    say: Say[];
    loot: Loot;
    twitch: Twitch;
    stream: streamItem;
    isLive: boolean;

    //#region Construct
    constructor(node: NodeItem){
        this.node = node;
        this.countMessages = 0;
        this.twitch = new Twitch();
        this.twitch.load(this.node.getDataValue("name"));
        this.stream = null;
        this.isLive = false;
        this.database = new Connection({ databaseName: Buffer.from(node.name).toString('base64') });
        this.puffer = new Puffer(node),
        this.puffer.interval();
        this.say = [];

        this.streamWatcher();
    }
    //#endregion

    //#region Twitch API streamer login by node
    streamWatcher(){
        global.worker.log.info(`node ${this.node.name}, add streamWatcher`);
        setInterval(
            async () => {
                global.worker.log.info(`node ${this.node.name}, streamWatcher run`);
                try{
                   if(this.twitch){
                        const stream = await this.twitch.GetStream(this.twitch.twitchUser.getDataValue('id'));

                        if(stream && stream.type === 'live'){
                            if(!this.isLive){
                                global.worker.log.info(`node ${this.node.name}, streamWatcher is now live`);
                                this.isLive = true;
                            }
                        } else if (this.isLive){
                            global.worker.log.info(`node ${this.node.name}, streamWatcher is not longer live`);
                            this.isLive = false;
                        } else {
                            global.worker.log.info(`node ${this.node.name}, streamWatcher nothing changed`);
                        }
                   }
                } catch (ex){
                    global.worker.log.error(`message error ${ex}`);
                }
            },
            1000 * 60 // 1 Minute(n)
        );
    }
    //#endregion

    //#region Say
    async addSays(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'say', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]

        for(const item of Object.values(await this.database.sequelize.models.say.findAll({order: [ [ 'command', 'ASC' ]], raw: true})) as unknown as SayItem[]){
            const element = new Say(translation, this, item);
            await element.initialize();
            this.say.push(element);
            global.worker.log.info(`node ${this.node.name}, say add ${element.item.command}.`);
        }
    }

    async stopSays(){
        for(const item of this.say){
            if(item.item.isLiveAutoControl){
                await item.stop();
                global.worker.log.info(`node ${this.node.name}, stop module ${item.item.command}.`);
            }
        }
    }

    async startSays(){
        for(const item of this.say){
            if(item.item.isLiveAutoControl){
                await item.start();
                global.worker.log.info(`node ${this.node.name}, stop module ${item.item.command}.`);
            }
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
    //#endregion

    //#region Loot
    async addLoot(){
        const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: 'loot', language: this.node.language }, order: [ [ 'handle', 'ASC' ]], raw: true}) as unknown as TranslationItem[]
        this.loot = new Loot(translation, this);
        await this.loot.initialize();
        await this.loot.InitializeLoot();
    }

    async stopLoot(){
        if(this.loot.settings.find(x =>x.command === "loot").isLiveAutoControl){
            await this.loot.lootclear();
            await this.loot.lootstop();
        }
    }    
    
    async startLoot(){
        if(this.loot.settings.find(x =>x.command === "loot").isLiveAutoControl){
            await this.loot.lootstart();
        }
    }
    //#endregion

    //#region Execute
    async execute(command: Command){
        const messages : string[] = [];

        messages.push(await this.loot.execute(command));

        for(const key in Object.keys(this.say)){
            if (this.say.hasOwnProperty(key)) {
                messages.push(await this.say[key].execute(command))
            }
        }
        return messages;
    }
    //#endregion
}

module.exports.default = Channel;