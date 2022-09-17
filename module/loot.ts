import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { AdventureItem } from "../model/adventureItem";
import { HeroInventoryItem } from "../model/heroInventoryItem";
import { HeroItem } from "../model/heroItem";
import { HeroWalletItem } from "../model/heroWalletItem";
import { LootItem } from "../model/lootItem";
import { TranslationItem } from "../model/translationItem";
import { Module } from "./module";
export class Loot extends Module {
    timer: NodeJS.Timer;
    settings: LootItem[];

    //#region Construct
    constructor(translation: TranslationItem[], channel: Channel){
        super(translation, channel, 'loot');
    }
    //#endregion

    //#region Initialize
    async InitializeLoot(){
        this.settings = await this.channel.database.sequelize.models.loot.findAll({order: [ [ 'command', 'ASC' ]], raw: true}) as unknown as LootItem[];
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
        const loot = this.settings.find(x =>x.command === "loot");

        this.timer = setInterval(
            async () => {
                if(loot.isActive){
                    const date = new Date();
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} last run ${new Date(loot.lastRun)}...`);
                    const timeDifference = Math.floor((date.getTime() - new Date(loot.lastRun).getTime()) / 60000)
                    if(timeDifference >= loot.minutes){
                        loot.lastRun = date;
                        loot.countRuns += 1;
                        await this.channel.database.sequelize.models.loot.update(loot, {where: {command: loot.command}});
                        global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} run after ${loot.minutes} Minutes.`);
                        this.channel.puffer.addMessage("loot executed");
                    } else {
                        global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} minutes: ${loot.minutes}`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} time elapsed: ${timeDifference}`);
                    }
                }
            },
            60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion

    //#region Join / Leave
    async loot(command: Command){
        try{
            let isNew = false;
            let value = await this.channel.database.sequelize.models.hero.findByPk(command.source) as Model<HeroItem>;

            if(!value){
                await HeroItem.put({sequelize: this.channel.database.sequelize, element: new HeroItem(command.source)})
                value = await this.channel.database.sequelize.models.hero.findByPk(command.source) as Model<HeroItem>;
                isNew = true;
            }

            if(!value.getDataValue("isActive")){
                value.setDataValue("isActive",true);
                value.setDataValue("lastJoin",new Date());
                await value.save();

                if(isNew) {
                    return TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                } else return TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);
            } else return TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
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
    steal(command: Command){
        return 'steal';
    }

    give(command: Command){
        return 'give';
    }

    find(command: Command){
        return 'find';
    }

    rank(command: Command){
        return 'rank';
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

    //#region Blood
    async blood(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero, {raw: true});

        if(item){
            const blood = this.settings.find(x =>x.command === "blood");
            const date = new Date();
            const timeDifference = Math.floor((date.getTime() - new Date(item.getDataValue("lastBlood")).getTime()) / 60000);

            if(timeDifference >= blood.minutes || item.getDataValue("blood") < 1){
                const countHeroes = await this.getCountActiveHeroes();
                item.setDataValue("blood", this.getRandomNumber(1 + countHeroes, 10 + countHeroes));
                item.setDataValue("lastBlood", date);
                await item.save();
                return TranslationItem.translate(this.translation, 'heroBlood').replace('$1', hero).replace('$2', blood.minutes.toString()).replace('$3', item.getDataValue("blood").toString());
            } else return TranslationItem.translate(this.translation, 'heroNoBlood').replace('$1', hero).replace('$2', (blood.minutes - timeDifference).toString()).replace('$3', item.getDataValue("blood").toString());
        } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
    }

    async bloodpoints(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero, {raw: true});

        if(item){
            const blood = this.settings.find(x =>x.command === "blood");
            const date = new Date();
            const timeDifference = Math.floor((date.getTime() - new Date(item.getDataValue("lastBlood")).getTime()) / 60000)

            if(item.getDataValue("blood") > 0 && timeDifference >= blood.minutes){
                item.setDataValue("blood", 0);
                await item.save();
                return TranslationItem.translate(this.translation, 'heroNoBloodpoints').replace('$1', hero);
            } else return TranslationItem.translate(this.translation, 'heroBloodpoints').replace('$1', hero).replace('$2',  item.getDataValue("blood").toString()).replace('$3', (blood.minutes - timeDifference).toString());
        } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
    }
    //#endregion

    //#region Chest
    async chest(command: Command){
        const hero = this.getTargetHero(command);
        let count = 0;

        for(const item of Object.values(await this.channel.database.sequelize.models.heroInventory.findAll({where: {heroName: hero}, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]] })) as unknown as HeroInventoryItem[]){
            count += item.quantity;
        }

        if (count > 0){
            return TranslationItem.translate(this.translation, 'heroChest').replace('$1', hero).replace('$2', count.toString());
        } else return TranslationItem.translate(this.translation, 'heroNoChest').replace('$1', hero);
    }
    //#endregion

    //#region Inventory
    async inventory(command: Command){
        const hero = this.getTargetHero(command);

        const items = await this.channel.database.sequelize.models.adventure.findAll({where: {heroName: hero}, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], include: [{
            model: this.channel.database.sequelize.models.hero,
            as: 'hero',
        }, {
            model: this.channel.database.sequelize.models.item,
            as: 'item',
        }] });

        if (items && items.length > 0){
            return TranslationItem.translate(this.translation, 'heroItem').replace('$1', hero).replace('$2', items.map(a => a.getDataValue("item").getDataValue("value")).toString());
        } else return TranslationItem.translate(this.translation, 'heroNoItem').replace('$1', hero);
    }
    //#endregion

    //#region Level
    async level(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.hero.findByPk(hero);

        if(item && item.getDataValue("level") > 0){
            return TranslationItem.translate(this.translation, 'heroLevel').replace('$1', hero).replace('$2', item.getDataValue("level").toString());
        } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
    }
    //#endregion

    //#region Gold
    async gold(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);

        if(item && item.getDataValue("gold") > 0){
            return TranslationItem.translate(this.translation, 'heroGold').replace('$1', hero).replace('$2', item.getDataValue("gold").toString());
        } else return TranslationItem.translate(this.translation, 'heroNoGold').replace('$1', hero);
    }
    //#endregion

    //#region Diamant
    async diamond(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);

        if(item && item.getDataValue("diamond") > 0){
            return TranslationItem.translate(this.translation, 'heroDiamond').replace('$1', hero).replace('$2', item.getDataValue("diamond").toString());
        } else return TranslationItem.translate(this.translation, 'heroNoDiamond').replace('$1', hero);
    }
    //#endregion

    //#region Shortcuts
    async inv(command: Command){
        return await this.inventory(command);
    }

    async lvl(command: Command){
        return await this.level(command);
    }

    async blut(command: Command){
        return await this.level(command);
    }
    //#endregion

    //#region Hero
    getTargetHero(command: Command){
        let hero = command.source;

        if(command.target && command.target.length > 0)
            hero = command.target;

        return hero;
    }

    async getCountActiveHeroes(){
        return await this.channel.database.sequelize.models.hero.count({where: { isActive: true }});;
    }
    //#endregion

    //#region Random
    getRandomNumber(min: number, max: number): number {
        const random = Math.floor(Math.random() * (max - min + 1) + min);
        global.worker.log.trace(`node ${this.channel.node.name}, new random number ${random} between ${min} and ${max}`);
        return random;
    }
    //#endregion
}