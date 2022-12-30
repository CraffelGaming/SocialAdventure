import { RaidItem } from "../model/raidItem.js";
export class LootRaid {
    //#region Construct
    constructor(loot) {
        this.loot = loot;
    }
    //#endregion
    //#region Initialize
    async initialize() {
        this.raid = await this.loadRaid();
        if (!this.raid) {
            this.boss = await this.loadRandomBoss();
            const item = new RaidItem();
            item.raidBossHandle = this.boss.getDataValue('handle');
            item.hitpoints = this.boss.getDataValue('hitpoints');
            item.isActive = true;
            item.isDefeated = true;
            await RaidItem.put({ sequelize: this.loot.channel.database.sequelize, element: item });
            this.raid = await this.loadRaid();
        }
        else {
            this.boss = await this.loadBoss();
        }
        if (this.raid) {
            return true;
        }
        return false;
    }
    //#endregion
    //#region Boss
    async loadBosses() {
        return await this.loot.channel.database.sequelize.models.raidBoss.findAll({ where: { isActive: true } });
    }
    async loadRandomBoss() {
        const bosses = await this.loadBosses();
        if (bosses) {
            return bosses[this.loot.getRandomNumber(0, bosses.length - 1)];
        }
        return null;
    }
    async loadBoss() {
        return await this.loot.channel.database.sequelize.models.raidBoss.findOne({ where: { handle: this.raid.getDataValue('raidBossHandle') } });
    }
    //#endregion
    //#region Heroes
    async loadHeroes() {
        return await this.loot.channel.database.sequelize.models.raidHero.findAll({ where: { raidHandle: this.raid.getDataValue('handle') } });
    }
    async loadHero(heroName) {
        return await this.loot.channel.database.sequelize.models.raidHero.findOne({ where: { heroName } });
    }
    //#endregion
    //#region Raid
    async loadRaid() {
        return await this.loot.channel.database.sequelize.models.raid.findOne({ where: { isActive: true }, order: [['handle', 'ASC']] });
    }
}
//# sourceMappingURL=lootRaid.js.map