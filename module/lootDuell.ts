import sequelize from 'sequelize';
import { Model } from 'sequelize-typescript';
import { HeroItem } from '../model/heroItem.js';
import { HeroTraitItem } from '../model/heroTraitItem.js';
import { HeroWalletItem } from '../model/heroWalletItem.js';
import { HistoryDuellItem } from '../model/historyDuellItem.js';
import { LootItem } from '../model/lootItem.js';
import { Loot } from './loot.js';

export class LootDuell {
    item: HistoryDuellItem;

    targetHero: Model<HeroItem>;
    sourceHero: Model<HeroItem>;
    loot: Loot;

    isSource: boolean = true;
    isTarget: boolean = true;
    isActive: boolean = true;
    isSelf: boolean = false;
    isTimeout: boolean = true;

    //#region Construct
    constructor(loot: Loot, sourceHeroName: string, targetHeroName: string) {
        this.item = new HistoryDuellItem(sourceHeroName, targetHeroName);
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(settings: Model<LootItem>): Promise<boolean> {
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.item.sourceHeroName) as Model<HeroItem>;

        if (this.item.targetHeroName?.length > 0) {
            this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.item.targetHeroName) as Model<HeroItem>;
        } else {
            this.targetHero = await this.getHero();
            this.item.targetHeroName = this.targetHero?.getDataValue('name');
        }

        if (settings.getDataValue('isActive')) {
            if (this.sourceHero && this.sourceHero.getDataValue('isActive')) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHero ${this.sourceHero.getDataValue('name')}`);
                if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue('lastDuell')), settings.getDataValue('minutes'))) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, timeout expired`);
                    if (this.targetHero && this.targetHero.getDataValue('isActive')) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHero ${this.targetHero.getDataValue('name')}`);
                        if (this.sourceHero.getDataValue('name') !== this.targetHero.getDataValue('name')) {
                            if (await this.startDuell()) {
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

    async save(hero: Model<HeroItem>) {
        this.sourceHero.setDataValue('lastDuell', new Date());
        this.sourceHero = await this.sourceHero.save();
        HistoryDuellItem.put({ sequelize: this.loot.channel.database.sequelize, element: this.item });
        await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.item.gold, where: { heroName: hero.getDataValue('name') } });
        await hero.increment('experience', { by: this.item.experience });
        await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: hero.get() });
    }

    async startDuell(): Promise<boolean> {
        const sourceTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue('name')) as Model<HeroTraitItem>;
        const targetTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue('name')) as Model<HeroTraitItem>;

        this.item.targetHitpoints = this.targetHero.getDataValue('hitpointsMax');
        this.item.sourceHitpoints = this.sourceHero.getDataValue('hitpointsMax');

        if (sourceTrait && targetTrait) {
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHitpoints ${this.item.targetHitpoints}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHitpoints ${this.item.sourceHitpoints}`);

            while (this.item.targetHitpoints !== 0 && this.item.sourceHitpoints !== 0) {
                let sourceDamage = this.loot.getRandomNumber(Math.round(this.sourceHero.getDataValue('strength') / 2), this.sourceHero.getDataValue('strength'));
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, source damage before defence ${sourceDamage}`);
                sourceDamage = Math.round(sourceDamage / 100 * (100 - (sourceTrait.getDataValue("defenceMultipler") / 2 + 1)));
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, source damage after defence ${sourceDamage}`);

                this.item.targetHitpoints -= sourceDamage;

                if (this.item.targetHitpoints < 0) {
                    this.item.targetHitpoints = 0;
                }

                if (this.item.targetHitpoints > 0) {
                    let targetDamage = this.loot.getRandomNumber(Math.round(this.targetHero.getDataValue('strength') / 2), this.targetHero.getDataValue('strength'));
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, target damage before defence ${targetDamage}`);
                    targetDamage = Math.round(targetDamage / 100 * (100 - (targetTrait.getDataValue("defenceMultipler") / 2 + 1)));
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, target damage after defence ${targetDamage}`);
                    this.item.sourceHitpoints -= targetDamage;

                    if (this.item.sourceHitpoints < 0) {
                        this.item.sourceHitpoints = 0;
                    }
                }
            }

            const sourceWallet = await this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.sourceHero.getDataValue('name')) as Model<HeroWalletItem>;
            const strengthDifference = this.targetHero.getDataValue('strength') - this.sourceHero.getDataValue('strength');

            this.item.gold = 10 * ((this.sourceHero.getDataValue('strength') - strengthDifference) + sourceWallet.getDataValue('blood') + 1);
            this.item.gold = Math.round(this.item.gold * ((sourceTrait.getDataValue('goldMultipler') / 10) + 1));

            const hitpoints = this.item.sourceHitpoints > 0 ? this.item.sourceHitpoints : this.item.targetHitpoints;
            this.item.experience = 15 * this.loot.getRandomNumber(hitpoints / 2, hitpoints);

            if (this.item.targetHitpoints === 0) {
                return true;
            }

            return false;
        }

        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, silence target win`);
        return false;
    }
    //#endregion

    //#region Adventure
    async getHeroes(): Promise<Model<HeroItem>[]> {
        return await this.loot.channel.database.sequelize.models.hero.findAll({ where: { isActive: true, name: { [sequelize.Op.not]: this.sourceHero.getDataValue("name") } } }) as Model<HeroItem>[];
    }

    async getHero(): Promise<Model<HeroItem>> {
        const heroes = await this.getHeroes();

        if (heroes.length > 0) {
            return heroes[this.loot.getRandomNumber(0, heroes.length - 1)];
        }

        return null;
    }
    //#endregion
}