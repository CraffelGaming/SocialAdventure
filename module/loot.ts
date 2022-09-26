import { Op } from "sequelize";
import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { AdventureItem } from "../model/adventureItem";
import { HeroInventoryItem } from "../model/heroInventoryItem";
import { HeroItem } from "../model/heroItem";
import { HeroWalletItem } from "../model/heroWalletItem";
import { LootItem } from "../model/lootItem";
import { TranslationItem } from "../model/translationItem";
import { LootExploring } from "./lootExploring";
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
        this.timer = setInterval(
            async () => {
                const loot = this.settings.find(x =>x.command === "loot");
                if(loot.isActive){
                    global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} last run ${new Date(loot.lastRun)}...`);

                    if(this.isDateTimeoutExpiredMinutes(new Date(loot.lastRun),  loot.minutes)){
                        loot.lastRun = new Date();
                        loot.countRuns += 1;
                        await this.channel.database.sequelize.models.loot.update(loot, {where: {command: loot.command}});
                        global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} run after ${loot.minutes} Minutes.`);

                        const exploring = new LootExploring(this);
                        if(await exploring.execute()){
                            if(!exploring.isWinner){
                                this.channel.puffer.addMessage(TranslationItem.translate(this.translation, 'heroAdventureLoose')
                                                   .replace('$1', exploring.hero.getDataValue("name")));

                            } else {
                                this.channel.puffer.addMessage(TranslationItem.translate(this.translation, 'heroAdventureVictory')
                                                   .replace('$1', exploring.hero.getDataValue("name"))
                                                   .replace('$2', exploring.dungeon.getDataValue("name"))
                                                   .replace('$3', exploring.enemy.getDataValue("name"))
                                                   .replace('$4', exploring.gold.toString())
                                                   .replace('$5', exploring.experience.toString())
                                                   .replace('$6', exploring.item.getDataValue("value")));
                            }
                            await exploring.save();
                        } else {
                            global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed - missing exploring`);
                        }
                    } else {
                        global.worker.log.info(`node ${this.channel.node.name}, module ${loot.command} not executed`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} minutes: ${loot.minutes}`);
                        global.worker.log.trace(`node ${this.channel.node.name}, module ${loot.command} time elapsed: ${this.getDateTimeoutRemainingMinutes(new Date(loot.lastRun),  loot.minutes)}`);
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
            const loot = this.settings.find(x =>x.command === "loot");
            let value = await this.channel.database.sequelize.models.hero.findByPk(command.source) as Model<HeroItem>;

            if(!value){
                await HeroItem.put({sequelize: this.channel.database.sequelize, element: new HeroItem(command.source)})
                value = await this.channel.database.sequelize.models.hero.findByPk(command.source) as Model<HeroItem>;
                isNew = true;
            }
            if(this.isDateTimeoutExpiredMinutes(value.getDataValue("lastJoin"), loot.minutes)){
                if(!value.getDataValue("isActive")){
                    value.setDataValue("isActive",true);
                    value.setDataValue("lastJoin",new Date());

                    if(value.getDataValue("hitpoints") === 0){
                        value.setDataValue("hitpoints", value.getDataValue("hitpointsMax") / 2);
                    }

                    await value.save();

                    if(isNew) {
                        return TranslationItem.translate(this.translation, 'heroNewJoined').replace('$1', command.source);
                    } else return TranslationItem.translate(this.translation, 'heroJoined').replace('$1', command.source);

                } else return TranslationItem.translate(this.translation, 'heroAlreadyJoined').replace('$1', command.source);
            } else return TranslationItem.translate(this.translation, 'heroTimeoutJoined').replace('$1', command.source).replace('$2', this.getDateTimeoutRemainingMinutes(value.getDataValue("lastJoin"), loot.minutes).toString());
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

                    const adventures = await this.channel.database.sequelize.models.adventure.findAll({where: {heroName: hero.getDataValue("name")}}) as Model<AdventureItem>[];
                    for(const adventure in adventures){
                        if(adventures[adventure]){
                            HeroInventoryItem.transferAdventureToInventory({sequelize: this.channel.database.sequelize, adventure: adventures[adventure]});
                        }
                    }
                    await hero.save();
                    return TranslationItem.translate(this.translation, 'heroLeave').replace('$1', command.source);
                } else return TranslationItem.translate(this.translation, 'heroNotJoined').replace('$1', command.source);
            } else return TranslationItem.translate(this.translation, 'heroNotExists').replace('$1', command.source);
        } catch (ex){
            global.worker.log.error(`loot error - function leave - ${ex.message}`);
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
    //#endregion

    //#region Rank
    async rank(command: Command){
        const hero = this.getTargetHero(command);
        const gold = (await this.channel.database.sequelize.query(this.getRankStatement(hero,"heroName", "heroWallet", "gold")))[0][0] as any
        const experience = (await this.channel.database.sequelize.query(this.getRankStatement(hero,"name", "hero", "experience")))[0][0] as any;

        return TranslationItem.translate(this.translation, 'heroRank')
                              .replace('$1', hero)
                              .replace('$2', gold.rank)
                              .replace('$3', gold.gold)
                              .replace('$4', experience.rank)
                              .replace('$5', experience.experience);
    }

    getRankStatement(hero: string, heroColumn: string, table: string, column: string){
        return "SELECT rank, " + column + ", " + heroColumn + " FROM (" +
               "    SELECT" +
               "        ROW_NUMBER () OVER ( " +
               "            ORDER BY " + column + " DESC" +
               "        ) rank," + column + ", " + heroColumn +
               "    FROM " + table +
               " ) t" +
               " WHERE " + heroColumn + " = '" + hero + "'";
    }
    //#endregion

    //#region Clear
    async lootclear(command: Command){
        try{
            const heroes = await this.channel.database.sequelize.models.hero.findAll({where: {isActive: true}}) as Model<HeroItem>[];
            for(const hero in heroes){
                if(heroes[hero] !== undefined){
                    heroes[hero].setDataValue("isActive", false)

                    const adventures = await this.channel.database.sequelize.models.adventure.findAll({where: {heroName: heroes[hero].getDataValue("name")}}) as Model<AdventureItem>[];
                    for(const adventure in adventures){
                        if(adventures[adventure]){
                            HeroInventoryItem.transferAdventureToInventory({sequelize: this.channel.database.sequelize, adventure: adventures[adventure]});
                        }
                    }
                    await heroes[hero].save();
                }
            }
            return TranslationItem.translate(this.translation, "cleared");
        } catch (ex){
            global.worker.log.error(`loot error - function leave - ${ex.message}`);
        }
    }
    //#endregion

    //#region Start
    async lootstart(command: Command){
        const loot = this.settings.find(x =>x.command === "loot");

        if(!loot.isActive){
            loot.isActive = true;
            await this.channel.database.sequelize.models.say.update(loot, {where: {command: loot.command}});
            global.worker.log.trace(`module ${loot.command} set active: ${loot.isActive}`);
            return TranslationItem.translate(this.basicTranslation, "start");
        }
        else {
            global.worker.log.trace(`module ${loot.command} already started.`);
            return TranslationItem.translate(this.basicTranslation, "alreadyStarted");
        }
    }
    //#endregion

    //#region Stop
    async lootstop(command: Command){
        const loot = this.settings.find(x =>x.command === "loot");
        if(loot.isActive){
            loot.isActive = false;
            await this.channel.database.sequelize.models.say.update(loot, {where: {command: loot.command}});
            global.worker.log.trace(`module lootstop set active: ${loot.isActive}`);
            return TranslationItem.translate(this.basicTranslation, "stop");
        }
        else {
            global.worker.log.trace(`module ${loot.command} already stopped.`);
            return TranslationItem.translate(this.basicTranslation, "alreadyStopped");
        }
    }
    //#endregion

    //#region Hitpoints
    async hitpoints(command: Command){
        try{
            const hero = this.getTargetHero(command);
            const item = await this.channel.database.sequelize.models.hero.findByPk(hero) as Model<HeroItem>;

            if(item){
                return TranslationItem.translate(this.translation, 'heroHitpoints').replace('$1', hero).replace('$2', item.getDataValue("hitpoints").toString()).replace('$3', item.getDataValue("hitpointsMax").toString());
            } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
        } catch (ex){
            global.worker.log.error(`loot error - function hitpoints - ${ex.message}`);
        }
    }
    //#endregion

    //#region Adventure
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

    //#region Blood
    async blood(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero) as Model<HeroWalletItem>;

        if(item){
            const blood = this.settings.find(x =>x.command === "blood");

            if(this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes) || item.getDataValue("blood") < 1){
                const countHeroes = await this.getCountActiveHeroes();
                item.setDataValue("blood", this.getRandomNumber(1 + countHeroes, 10 + countHeroes));
                item.setDataValue("lastBlood", new Date());
                await item.save();
                return TranslationItem.translate(this.translation, 'heroBlood').replace('$1', hero).replace('$2', blood.minutes.toString()).replace('$3', item.getDataValue("blood").toString());
            } else return TranslationItem.translate(this.translation, 'heroNoBlood').replace('$1', hero).replace('$2', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString()).replace('$3', item.getDataValue("blood").toString());
        } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
    }

    async bloodpoints(command: Command){
        const hero = this.getTargetHero(command);
        const item = await this.channel.database.sequelize.models.heroWallet.findByPk(hero);

        if(item){
            const blood = this.settings.find(x =>x.command === "blood");

            if(item.getDataValue("blood") > 0 && this.isDateTimeoutExpiredMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes)){
                item.setDataValue("blood", 0);
                await item.save();
                return TranslationItem.translate(this.translation, 'heroNoBloodpoints').replace('$1', hero);
            } else return TranslationItem.translate(this.translation, 'heroBloodpoints').replace('$1', hero).replace('$2',  item.getDataValue("blood").toString()).replace('$3', this.getDateTimeoutRemainingMinutes(new Date(item.getDataValue("lastBlood")), blood.minutes).toString());
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
        const item = await this.channel.database.sequelize.models.hero.findByPk(hero) as Model<HeroItem>;

        if(item){
            const level = await this.channel.database.sequelize.models.level.findOne({
                where: { experienceMin :{[Op.lte]: item.getDataValue("experience")},
                experienceMax :{[Op.gte]: item.getDataValue("experience") }
            }});

            if(level){
                return TranslationItem.translate(this.translation, 'heroLevel').replace('$1', hero).replace('$2', level.getDataValue("handle").toString());
            } else return TranslationItem.translate(this.translation, 'heroJoin').replace('$1', hero);
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
    async hp(command: Command){
        return await this.hitpoints(command);
    }

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
}