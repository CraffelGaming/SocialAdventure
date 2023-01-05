import sequelize from "sequelize";
import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem.js";
import { HeroItem } from "../model/heroItem.js";
import { HeroTraitItem } from "../model/heroTraitItem.js";
import { HeroWalletItem } from "../model/heroWalletItem.js";
import { ItemItem } from "../model/itemItem.js";
import { LootItem } from "../model/lootItem.js";
import { Loot } from "./loot.js";

export class LootDuell {
    targetHeroName: string;
    targetHero: Model<HeroItem>;
    sourceHeroName: string;
    sourceHero: Model<HeroItem>;
    loot: Loot;

    isSource: boolean = true;
    isTarget: boolean = true;
    isActive: boolean = true;
    isSelf: boolean = false;
    isTimeout: boolean = true;

    gold: number = 0;
    experience: number = 0;
    sourceHitpoints: number = 0;
    targetHitpoints: number = 0;

    //#region Construct
    constructor(loot: Loot, sourceHeroName: string, targetHeroName: string){
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(settings: Model<LootItem>) : Promise<boolean>{
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName) as Model<HeroItem>;
        this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName) as Model<HeroItem>;

        if(settings.getDataValue("isActive")){
            if(this.sourceHero && this.sourceHero.getDataValue("isActive")){
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHero ${this.sourceHero.getDataValue("name")}`);
                if(this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastDuell")), settings.getDataValue("minutes"))){
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, timeout expired`);
                    if(this.targetHero && this.targetHero.getDataValue("isActive")){
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHero ${this.targetHero.getDataValue("name")}`);
                        if(this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")){
                            if(await this.startDuell()){
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, succsess`);
                                await this.save(this.sourceHero);
                                await settings.increment('countUses', { by: 1 });
                                return true;
                            } else {
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, failed`);
                                await this.save(this.targetHero);
                                await settings.increment('countUses', { by: 1 });
                            }
                        } else this.isSelf = true;
                    } else this.isTarget = false;
                } else this.isTimeout = false;
            } else this.isSource = false;
        } else this.isActive = false;
        return false;
    }

    async save(hero: Model<HeroItem>){
        this.sourceHero.setDataValue("lastDuell", new Date());
        this.sourceHero = await this.sourceHero.save();

        await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: hero.getDataValue("name") }});
        await hero.increment('experience', { by: this.experience });
        await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: hero.get()});
    }

    async startDuell() : Promise<boolean>{
        const sourceTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue("name")) as Model<HeroTraitItem>;
        const targetTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue("name")) as Model<HeroTraitItem>;

        this.targetHitpoints = this.targetHero.getDataValue('hitpointsMax');
        this.sourceHitpoints = this.sourceHero.getDataValue('hitpointsMax');

        if(sourceTrait && targetTrait){
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHitpoints ${this.targetHitpoints}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHitpoints ${this.sourceHitpoints}`);

            while(this.targetHitpoints !== 0 && this.sourceHitpoints !== 0){
                const sourceDamage = this.loot.getRandomNumber(Math.round(this.sourceHero.getDataValue("strength") / 2), this.sourceHero.getDataValue("strength"));
                this.targetHitpoints -= sourceDamage;

                if(this.targetHitpoints < 0) {
                    this.targetHitpoints = 0;
                }

                if(this.targetHitpoints > 0) {
                    const targetDamage = this.loot.getRandomNumber(Math.round(this.targetHero.getDataValue("strength") / 2), this.targetHero.getDataValue("strength"));
                    this.sourceHitpoints -= targetDamage;

                    if(this.sourceHitpoints < 0) {
                        this.sourceHitpoints = 0;
                    }
                }
            }

            const sourceWallet = await this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.sourceHero.getDataValue("name")) as Model<HeroWalletItem>;
            const strengthDifference = this.targetHero.getDataValue('strength') - this.sourceHero.getDataValue('strength');
            this.gold = 10 * ((this.sourceHero.getDataValue('strength') - strengthDifference) + sourceWallet.getDataValue("blood") + 1);
            this.gold = Math.round(this.gold * ((sourceTrait.getDataValue("goldMultipler") / 10) + 1));

            this.experience = 15 * this.sourceHitpoints;

            if(this.targetHitpoints === 0) {
                return true;
            }

            return false;
        }

        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, silence target win`);
        return false;
    }
    //#endregion
}