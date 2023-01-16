import { Model } from 'sequelize-typescript';
import { HeroInventoryItem } from '../model/heroInventoryItem.js';
import { HeroItem } from '../model/heroItem.js';
import { ItemItem } from '../model/itemItem.js';
import { RaidBossItem } from '../model/raidBossItem.js';
import { RaidHeroItem } from '../model/raidHeroItem.js';
import { RaidItem } from '../model/raidItem.js';
import { TranslationItem } from '../model/translationItem.js';
import { Loot } from './loot.js';

export class LootRaid {
    timer: NodeJS.Timer;
    loot: Loot;

    raid: Model<RaidItem>;
    boss: Model<RaidBossItem>;

    //#region Construct
    constructor(loot: Loot){
        this.loot = loot;
        this.automation();
    }
    //#endregion

    //#region Automation
    automation(){
        this.timer = setInterval(
            async () => {
                try {
                    const raid = this.loot.settings.find(x =>x.getDataValue('command') === 'raid');

                    if(raid.getDataValue('isActive')){
                        if(!this.raid) {
                            this.loot.channel.puffer.addMessage(await this.start());
                            raid.setDataValue('lastRun', new Date());
                            await raid.save();
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module raid started`);
                        } else if(!this.raid.getDataValue('isDefeated')) {
                            if(this.loot.isDateTimeoutExpiredMinutes(new Date(raid.getDataValue('lastRun')), raid.getDataValue('minutes'))){
                                raid.setDataValue('lastRun', new Date());
                                raid.setDataValue('countRuns', raid.getDataValue('countRuns') + 1);

                                await raid.save();
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module ${raid.getDataValue('command')} run after ${raid.getDataValue('minutes')} Minutes.`);

                                this.loot.channel.puffer.addMessage(await this.fight());
                            } else {
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module ${raid.getDataValue('command')} not executed`);
                                global.worker.log.trace(`node ${this.loot.channel.node.getDataValue('name')}, module ${raid.getDataValue('command')} minutes: ${raid.getDataValue('minutes')}`);
                                global.worker.log.trace(`node ${this.loot.channel.node.getDataValue('name')}, module ${raid.getDataValue('command')} time elapsed: ${this.loot.getDateTimeoutRemainingMinutes(new Date(raid.getDataValue('lastRun')), raid.getDataValue('minutes'))}`);
                            }
                        }
                    } else {
                        if(this.raid) {
                            this.loot.channel.puffer.addMessage(await this.stop());
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module raid stopped`);
                        } else {
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module raid not executed not active`);
                        }
                    }
                } catch(ex) {
                    global.worker.log.error(`node ${this.loot.channel.node.getDataValue('name')}, module raid automation error.`);
                    global.worker.log.error(`exception ${ex.message}`);
                }
            },
            60000 // Alle 60 Sekunden prüfen
        );
    }
    //#endregion

    //region Fight
    async fight() : Promise<string> {
        let result = '';
        let damage = 0;
        const defeatedHeroes = [];

        const raidHeroes = await this.loadRaidHeroes();
        const count = raidHeroes.length;

        if(count > 0) {
            for(const raidHero of raidHeroes){
                const hero = await this.loadHero(raidHero.getDataValue('heroName'));

                if(hero.getDataValue('hitpoints') > 0) {
                    const heroDamage = this.loot.getRandomNumber(Math.round(hero.getDataValue('strength') / 2), hero.getDataValue('strength')) * this.loot.getRandomNumber(1, Math.round(count / 2) + 1) + this.loot.getRandomNumber(Math.round(count / 2), count)

                    damage += Math.round(heroDamage);
                    await raidHero.increment('damage', { by: heroDamage });

                    let bossDamage = this.loot.getRandomNumber(Math.round(this.boss.getDataValue('strength') / 2), this.boss.getDataValue('strength'))

                    if(hero.getDataValue('hitpoints') <= bossDamage) {
                        bossDamage = hero.getDataValue('hitpoints');
                        defeatedHeroes.push(hero.getDataValue('name'));
                    }

                    await this.loot.channel.database.sequelize.models.hero.decrement('hitpoints', { by: bossDamage, where: { name: hero.getDataValue('name') }});
                }
            }
            let hitpoints = this.raid.getDataValue('hitpoints') - damage;

            if(hitpoints < 0) {
                hitpoints = 0;
            }

            this.raid.setDataValue('hitpoints', hitpoints);
            this.raid.save();

            if(hitpoints === 0) {
                result = await this.complete();
            } else result = TranslationItem.translate(this.loot.translation, 'raidFight')
                                           .replace('$1', count.toString())
                                           .replace('$2', this.boss.getDataValue('name'))
                                           .replace('$3', damage.toString())
                                           .replace('$4', this.raid.getDataValue('hitpoints').toString())
                                           .replace('$5', this.boss.getDataValue('hitpoints').toString())
                                           .replace('$6', TranslationItem.translate(this.loot.translation, 'raidDefeatedHeroes').replace('$1', defeatedHeroes.length > 0 ? defeatedHeroes.join(', ') : TranslationItem.translate(this.loot.translation, 'raidNoOne')))
        } else result = TranslationItem.translate(this.loot.translation, 'raidNoHero').replace('$1', this.boss.getDataValue('name'));

        return result;
    }
    //#endregion

    //#region Start
    async start() : Promise<string> {
        this.raid = await this.loadRaid();
        let result = '';

        if(!this.raid) {
            this.boss = await this.loadRandomBoss();

            if(this.boss) {
                const item = new RaidItem();
                item.raidBossHandle = this.boss.getDataValue('handle');
                item.hitpoints = this.boss.getDataValue('hitpoints');
                item.isActive = true;
                item.isDefeated = false;
                await RaidItem.put({sequelize: this.loot.channel.database.sequelize, element:  item});
                this.raid = await this.loadRaid();
            }
        } else {
            this.boss = await this.loadBoss();
        }

        if(this.raid) {
            result = TranslationItem.translate(this.loot.translation, 'raidStart').replace('$1',  this.boss.getDataValue('name'));
        }

        return result;
    }
    //#endregion

    //#region Stop
    async stop() : Promise<string> {
        let result = '';
        if(this.raid?.getDataValue('isActive')) {
            const raidHeroes = await this.loadRaidHeroes();
            for(const raidHero of raidHeroes){
                raidHero.setDataValue('isActive', false);
                await raidHero.save();
            }

            this.raid.setDataValue('isActive', false);
            await this.raid.save();

            if(!this.raid.getDataValue('isDefeated')) {
                result = TranslationItem.translate(this.loot.translation, 'raidStop').replace('$1',  this.boss.getDataValue('name'));
            }
        }

        this.boss = null;
        this.raid = null;

        return result;
    }
    //#endregion

    //#region Complete
    async complete() : Promise<string> {
        let isRewarded = false;
        let item: Model<ItemItem> = null;

        if(this.raid?.getDataValue('isActive')) {
            if(this.raid?.getDataValue('hitpoints') <= 0) {
                const raidHeroes = await this.loadRaidHeroes();
                item = await this.getItem(this.boss.getDataValue('categoryHandle'));

                for(const raidHero of raidHeroes){
                    if(!raidHero.getDataValue('isRewarded') && raidHero.getDataValue('isActive')){

                        await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.boss.getDataValue('gold'), where: { heroName: raidHero.getDataValue('heroName') }});
                        await this.loot.channel.database.sequelize.models.heroWallet.increment('diamond', { by: this.boss.getDataValue('diamond'), where: { heroName: raidHero.getDataValue('heroName') }});

                        const hero = await this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: raidHero.getDataValue('heroName')}}) as Model<HeroItem>;

                        if(hero){
                            await this.loot.channel.database.sequelize.models.hero.increment('experience', { by: this.boss.getDataValue('experience'), where: { name: raidHero.getDataValue('heroName') }});
                            await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: hero.get()});
                        }

                        if(item) {
                            HeroInventoryItem.transferItemToInventory({ sequelize: this.loot.channel.database.sequelize, item, heroName: raidHero.getDataValue('heroName') })
                        }

                        raidHero.setDataValue('isRewarded', true);
                        await raidHero.save();
                    }
                }
                isRewarded = true;
            }

            this.raid.setDataValue('isDefeated', true);
            this.raid.save();
        }

        if(isRewarded) {
            return TranslationItem.translate(this.loot.translation, 'raidCompleted')
                                  .replace('$1', this.boss.getDataValue('name'))
                                  .replace('$2', this.boss.getDataValue('diamond').toString())
                                  .replace('$3', this.boss.getDataValue('gold').toString())
                                  .replace('$4', this.boss.getDataValue('experience').toString())
                                  .replace('$5', item.getDataValue('value'))
        } else return TranslationItem.translate(this.loot.translation, 'raidCompletedError').replace('$1', this.boss.getDataValue('name'));
    }
    //#endregion

    //#region Boss
    async loadBosses() : Promise<Model<RaidBossItem>[]> {
        return await this.loot.channel.database.sequelize.models.raidBoss.findAll({ where: { isActive: true }}) as Model<RaidBossItem>[];
    }

    async loadRandomBoss() : Promise<Model<RaidBossItem>> {
        const bosses = await this.loadBosses();
        if(bosses) {
            return bosses[this.loot.getRandomNumber(0, bosses.length -1)];
        }
        return null;
    }

    async loadBoss() : Promise<Model<RaidBossItem>> {
        return await this.loot.channel.database.sequelize.models.raidBoss.findOne({ where: { handle: this.raid.getDataValue('raidBossHandle') }}) as Model<RaidBossItem>;
    }
    //#endregion

    //#region Heroes
    async loadRaidHeroes() : Promise<Model<RaidHeroItem>[]> {
        return await this.loot.channel.database.sequelize.models.raidHero.findAll({ where: { raidHandle: this.raid.getDataValue('handle') }}) as Model<RaidHeroItem>[];
    }

    async loadRaidHero(heroName: string) : Promise<Model<RaidHeroItem>> {
        return await this.loot.channel.database.sequelize.models.raidHero.findOne({ where: { heroName, isActive: true }}) as Model<RaidHeroItem>;
    }

    async loadHero(heroName: string) : Promise<Model<HeroItem>> {
        return await this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: heroName }}) as Model<HeroItem>;
    }
    //#endregion

    //#region Raid
    async loadRaid() : Promise<Model<RaidItem>> {
        return await this.loot.channel.database.sequelize.models.raid.findOne({ where: { isActive: true }, order: [ [ 'handle', 'ASC' ]]}) as Model<RaidItem>;
    }
    //#endregion

    //#region Item
    async getItems(categoryHandle: number): Promise<Model<ItemItem>[]>{
        return await this.loot.channel.database.sequelize.models.item.findAll({where: {  categoryHandle} }) as Model<ItemItem>[];
    }

    async getItem(categoryHandle: number): Promise<Model<ItemItem>>{
        const items = await this.getItems(categoryHandle);
        return items[this.loot.getRandomNumber(0, items.length -1)];
    }
    //#endregion
}