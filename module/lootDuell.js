import { HeroItem } from "../model/heroItem.js";
export class LootDuell {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName) {
        this.isSource = true;
        this.isTarget = true;
        this.isActive = true;
        this.isSelf = false;
        this.isTimeout = true;
        this.gold = 0;
        this.experience = 0;
        this.sourceHitpoints = 0;
        this.targetHitpoints = 0;
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    async execute(settings) {
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName);
        this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName);
        if (settings.getDataValue("isActive")) {
            if (this.sourceHero && this.sourceHero.getDataValue("isActive")) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHero ${this.sourceHero.getDataValue("name")}`);
                if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastDuell")), settings.getDataValue("minutes"))) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, timeout expired`);
                    if (this.targetHero && this.targetHero.getDataValue("isActive")) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHero ${this.targetHero.getDataValue("name")}`);
                        if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                            if (await this.startDuell()) {
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, succsess`);
                                await this.save(this.sourceHero);
                                await settings.increment('countUses', { by: 1 });
                                return true;
                            }
                            else {
                                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, failed`);
                                await this.save(this.targetHero);
                                await settings.increment('countUses', { by: 1 });
                            }
                        }
                        else
                            this.isSelf = true;
                    }
                    else
                        this.isTarget = false;
                }
                else
                    this.isTimeout = false;
            }
            else
                this.isSource = false;
        }
        else
            this.isActive = false;
        return false;
    }
    async save(hero) {
        this.sourceHero.setDataValue("lastDuell", new Date());
        this.sourceHero = await this.sourceHero.save();
        await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: hero.getDataValue("name") } });
        await hero.increment('experience', { by: this.experience });
        await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: hero.get() });
    }
    async startDuell() {
        const sourceTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue("name"));
        const targetTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue("name"));
        this.targetHitpoints = this.targetHero.getDataValue('hitpointsMax');
        this.sourceHitpoints = this.sourceHero.getDataValue('hitpointsMax');
        if (sourceTrait && targetTrait) {
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, targetHitpoints ${this.targetHitpoints}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, sourceHitpoints ${this.sourceHitpoints}`);
            while (this.targetHitpoints !== 0 && this.sourceHitpoints !== 0) {
                const sourceDamage = this.loot.getRandomNumber(Math.round(this.sourceHero.getDataValue("strength") / 2), this.sourceHero.getDataValue("strength"));
                this.targetHitpoints -= sourceDamage;
                if (this.targetHitpoints < 0) {
                    this.targetHitpoints = 0;
                }
                if (this.targetHitpoints > 0) {
                    const targetDamage = this.loot.getRandomNumber(Math.round(this.targetHero.getDataValue("strength") / 2), this.targetHero.getDataValue("strength"));
                    this.sourceHitpoints -= targetDamage;
                    if (this.sourceHitpoints < 0) {
                        this.sourceHitpoints = 0;
                    }
                }
            }
            const sourceWallet = await this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.sourceHero.getDataValue("name"));
            const strengthDifference = this.targetHero.getDataValue('strength') - this.sourceHero.getDataValue('strength');
            this.gold = 10 * ((this.sourceHero.getDataValue('strength') - strengthDifference) + sourceWallet.getDataValue("blood") + 1);
            this.gold = Math.round(this.gold * ((sourceTrait.getDataValue("goldMultipler") / 10) + 1));
            this.experience = 15 * (this.sourceHitpoints > 0 ? this.sourceHitpoints : this.targetHitpoints);
            if (this.targetHitpoints === 0) {
                return true;
            }
            return false;
        }
        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module duell, silence target win`);
        return false;
    }
}
//# sourceMappingURL=lootDuell.js.map