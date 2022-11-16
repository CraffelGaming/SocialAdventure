import { AdventureItem } from "../model/adventureItem.js";
export class LootGive {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName, itemParameter) {
        this.isSource = true;
        this.isTarget = true;
        this.isItem = true;
        this.isAdventure = true;
        this.isTimeout = true;
        this.isSelf = true;
        this.isActive = true;
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    async execute(settings) {
        this.item = await this.getItem();
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName);
        this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName);
        if (settings.isActive) {
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, item ${this.item.getDataValue("value")}`);
                if (this.sourceHero && this.sourceHero.getDataValue("isActive")) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastGive")), settings.minutes)) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, timeout expired`);
                        if (this.targetHero) {
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, targetHero ${this.targetHero.getDataValue("name")}`);
                            if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                                this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle"), heroName: this.sourceHero.getDataValue("name") } });
                                if (this.adventure) {
                                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, adventure `);
                                    await this.adventure.destroy();
                                    const adventure = new AdventureItem(this.item.getDataValue("handle"), this.targetHero.getDataValue("name"));
                                    await AdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: adventure });
                                    this.sourceHero.setDataValue("lastGive", new Date());
                                    await this.sourceHero.save();
                                    return true;
                                }
                                else
                                    this.isAdventure = false;
                            }
                            else
                                this.isSelf = false;
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
                this.isItem = false;
        }
        else
            this.isActive = false;
        return false;
    }
    //#endregion
    //#region Item
    async getItem() {
        if (this.itemParameter && this.itemParameter.length > 0) {
            const itemHandle = Number(this.itemParameter);
            if (isNaN(itemHandle)) {
                return await this.loot.channel.database.sequelize.models.item.findOne({ where: { value: this.itemParameter } });
            }
            else {
                return await this.loot.channel.database.sequelize.models.item.findByPk(itemHandle);
            }
        }
        return null;
    }
}
//# sourceMappingURL=lootGive.js.map