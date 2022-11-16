export class LootSearch {
    //#region Construct
    constructor(loot, itemParameter) {
        this.isFound = false;
        this.isFoundable = false;
        this.isExists = true;
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    async execute() {
        this.item = await this.getItem();
        if (this.item) {
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, item ${this.item.getDataValue("value")}`);
            this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle") } });
            this.dungeons = await this.loot.channel.database.sequelize.models.location.findAll({ where: { isActive: true, categoryHandle: this.item.getDataValue("categoryHandle") } });
            if (this.adventure) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, adventure`);
                this.hero = await this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: this.adventure.getDataValue("heroName") } });
                if (this.hero) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, hero ${this.hero.getDataValue("name")}`);
                    this.isFound = true;
                    return true;
                }
            }
            else if (this.dungeons && this.dungeons.length > 0) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, dungeons`);
                this.isFoundable = true;
            }
        }
        else
            this.isExists = false;
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
//# sourceMappingURL=lootSearch.js.map