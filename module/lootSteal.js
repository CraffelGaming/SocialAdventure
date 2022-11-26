import sequelize from "sequelize";
import { AdventureItem } from "../model/adventureItem.js";
export class LootSteal {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName = null, itemParameter = null) {
        this.isSource = true;
        this.isTarget = true;
        this.isItem = true;
        this.isItemHero = true;
        this.isItemHeroes = true;
        this.isAdventure = true;
        this.isTimeout = true;
        this.isSteal = true;
        this.isLoose = true;
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
        await this.loadElements();
        if (settings.getDataValue("isActive")) {
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, item ${this.item.getDataValue("value")}`);
                if (this.sourceHero && this.sourceHero.getDataValue("isActive")) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastSteal")), settings.getDataValue("minutes"))) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, timeout expired`);
                        if (this.targetHero) {
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, targetHero ${this.targetHero.getDataValue("name")}`);
                            if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                                if (this.adventure) {
                                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                    if (await this.isStealSuccess()) {
                                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, succsess`);
                                        await this.save(this.sourceHero, this.sourceHero);
                                        await settings.increment('countUses', { by: 1 });
                                        return true;
                                    }
                                    else {
                                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, failed`);
                                        this.isSteal = false;
                                        this.adventure = await this.getAdventure(this.sourceHero);
                                        await settings.increment('countUses', { by: 1 });
                                        if (this.adventure) {
                                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                            this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle"));
                                            if (this.isItem) {
                                                this.isLoose = false;
                                                await this.save(this.sourceHero, this.targetHero);
                                            }
                                        }
                                    }
                                }
                                else
                                    this.isAdventure = false;
                            }
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
    async save(source, target) {
        await this.adventure.destroy();
        const adventure = new AdventureItem(this.item.getDataValue("handle"), target.getDataValue("name"));
        await AdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: adventure });
        source.setDataValue("lastSteal", new Date());
        await source.save();
    }
    async loadElements() {
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName);
        if (this.itemParameter) {
            this.item = await this.getItem();
            if (this.item) {
                this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle") } });
                if (this.adventure) {
                    this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName"));
                }
            }
        }
        else if (this.targetHeroName) {
            this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName);
            if (this.targetHero) {
                this.adventure = await this.getAdventure(this.targetHero);
                if (this.adventure) {
                    this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle"));
                    if (!this.isItem)
                        this.isItemHero = false;
                }
                else
                    this.isItemHero = false;
            }
            this.isTarget = false;
        }
        else {
            this.adventure = await this.getAdventure();
            if (this.adventure) {
                this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName"));
                this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle"));
                if (!this.isItem)
                    this.isItemHeroes = false;
            }
            this.isItemHeroes = false;
        }
    }
    async isStealSuccess() {
        const sourceTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue("name"));
        const targetTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue("name"));
        let targetResult = 0;
        let sourceResult = 0;
        if (sourceTrait && targetTrait) {
            const sourceTrys = targetTrait.getDataValue("stealMultipler");
            const targetTrys = targetTrait.getDataValue("defenceMultipler");
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence sourceTrys ${sourceTrys}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence targetTrys ${targetTrys}`);
            for (let i = 1; i <= sourceTrys; i++) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source try ${i}`);
                const sourceDice = this.loot.getRandomNumber(0, 100);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source dice ${sourceDice}`);
                if (sourceDice > sourceResult) {
                    sourceResult = sourceDice;
                }
            }
            for (let i = 1; i <= targetTrys; i++) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target try ${i}`);
                const targetDice = this.loot.getRandomNumber(0, 100);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target dice ${targetDice}`);
                if (targetDice > targetResult) {
                    targetResult = targetDice;
                }
            }
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source result ${sourceResult}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target result ${targetResult}`);
            if (sourceResult >= targetResult) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source win`);
                return true;
            }
        }
        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target win`);
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
    //#endregion
    //#region Adventure
    async getAdventures(hero = null) {
        if (hero) {
            return await this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero.getDataValue("name") } });
        }
        else {
            return await this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: { [sequelize.Op.not]: this.sourceHero.getDataValue("name") } } });
        }
    }
    async getAdventure(hero = null) {
        const adventures = await this.getAdventures(hero);
        if (adventures.length > 0) {
            return adventures[this.loot.getRandomNumber(0, adventures.length - 1)];
        }
        return null;
    }
}
//# sourceMappingURL=lootSteal.js.map