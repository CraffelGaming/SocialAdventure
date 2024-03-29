import sequelize from "sequelize";
import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem.js";
import { HeroItem } from "../model/heroItem.js";
import { HeroTraitItem } from "../model/heroTraitItem.js";
import { HistoryStealItem } from "../model/historyStealItem.js";
import { ItemItem } from "../model/itemItem.js";
import { LootItem } from "../model/lootItem.js";
import { Loot } from "./loot.js";

export class LootSteal {
    stealItem: HistoryStealItem;

    item: Model<ItemItem>;
    adventure: Model<AdventureItem>;
    targetHero: Model<HeroItem>;
    sourceHero: Model<HeroItem>;
    loot: Loot;
    itemParameter: string;
    isSource: boolean = true;
    isTarget: boolean = true;
    isItem: boolean = true;
    isItemHero: boolean = true;
    isItemHeroes: boolean = true;
    isAdventure: boolean = true;
    isTimeout: boolean = true;
    isLoose: boolean = true;
    isSelf: boolean = false;
    isActive: boolean = true;

    //#region Construct
    constructor(loot: Loot, sourceHeroName: string, targetHeroName: string = null, itemParameter: string = null) {
        this.stealItem = new HistoryStealItem(sourceHeroName, targetHeroName);
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(settings: Model<LootItem>): Promise<boolean> {
        await this.loadElements();

        if (settings.getDataValue("isActive")) {
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, item ${this.item.getDataValue("value")}`);
                if (this.sourceHero && this.sourceHero.getDataValue("isActive")) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastSteal")), settings.getDataValue("minutes"))) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, timeout expired`);
                        if (this.targetHero && this.targetHero.getDataValue("isActive")) {
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, targetHero ${this.targetHero.getDataValue("name")}`);
                            if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                                if (this.adventure) {
                                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                    if (await this.isStealSuccess()) {
                                        this.stealItem.isSuccess = true;
                                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, succsess`);
                                        await this.save(this.sourceHero, this.sourceHero);
                                        await settings.increment('countUses', { by: 1 });
                                        return true;
                                    } else {
                                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, failed`);
                                        this.stealItem.isSuccess = false;
                                        this.adventure = await this.getAdventure(this.sourceHero);
                                        await settings.increment('countUses', { by: 1 });

                                        if (this.adventure) {
                                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, adventure`);
                                            this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")) as Model<ItemItem>;
                                            if (this.isItem) {
                                                this.isLoose = false;
                                                await this.save(this.sourceHero, this.targetHero);
                                            }
                                        } else {
                                            HistoryStealItem.put({ sequelize: this.loot.channel.database.sequelize, element: this.stealItem });
                                        }
                                    }
                                } else this.isAdventure = false;
                            } else this.isSelf = true;
                        } else this.isTarget = false;
                    } else this.isTimeout = false;
                } else this.isSource = false;
            } else this.isItem = false;
        } else this.isActive = false;
        return false;
    }

    async save(source: Model<HeroItem>, target: Model<HeroItem>) {
        await this.adventure.destroy();
        const adventure = new AdventureItem(this.item.getDataValue("handle"), target.getDataValue("name"));
        await AdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: adventure });
        source.setDataValue("lastSteal", new Date());
        await source.save();

        this.stealItem.itemName = this.item?.getDataValue('value');
        HistoryStealItem.put({ sequelize: this.loot.channel.database.sequelize, element: this.stealItem });
    }

    async loadElements() {
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.stealItem.sourceHeroName) as Model<HeroItem>;

        if (this.itemParameter) {
            this.item = await this.getItem();
            if (this.item) {
                this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle") } }) as Model<AdventureItem>;
                if (this.adventure) {
                    this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName")) as Model<HeroItem>;
                }
            }
        } else if (this.stealItem.targetHeroName) {
            this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.stealItem.targetHeroName) as Model<HeroItem>;

            if (this.targetHero) {
                this.adventure = await this.getAdventure(this.targetHero);
                if (this.adventure) {
                    this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")) as Model<ItemItem>;

                    if (!this.isItem)
                        this.isItemHero = false;
                } else this.isItemHero = false;
            } this.isTarget = false;
        } else {
            this.adventure = await this.getAdventure();
            if (this.adventure) {
                this.stealItem.targetHeroName = this.adventure.getDataValue("heroName");
                this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.adventure.getDataValue("heroName")) as Model<HeroItem>;
                this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.adventure.getDataValue("itemHandle")) as Model<ItemItem>;

                if (!this.isItem) {
                    this.isItemHeroes = false;
                }
            } else this.isItemHeroes = false;
        }
    }

    async isStealSuccess(): Promise<boolean> {
        const sourceTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.sourceHero.getDataValue("name")) as Model<HeroTraitItem>;
        const targetTrait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.targetHero.getDataValue("name")) as Model<HeroTraitItem>;

        if (sourceTrait && targetTrait) {
            this.stealItem.rollSourceCount = targetTrait.getDataValue("stealMultipler");
            this.stealItem.rollTargetCount = targetTrait.getDataValue("perceptionMultipler");

            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence sourceTrys ${this.stealItem.rollSourceCount}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence targetTrys ${this.stealItem.rollTargetCount}`);


            for (let i = 1; i <= this.stealItem.rollSourceCount; i++) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source try ${i}`);
                const sourceDice = this.loot.getRandomNumber(0, 100);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source dice ${sourceDice}`);
                if (sourceDice > this.stealItem.rollSource) {
                    this.stealItem.rollSource = sourceDice;
                }
            }

            for (let i = 1; i <= this.stealItem.rollTargetCount; i++) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target try ${i}`);
                const targetDice = this.loot.getRandomNumber(0, 100);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target dice ${targetDice}`);
                if (targetDice > this.stealItem.rollTarget) {
                    this.stealItem.rollTarget = targetDice;
                }
            }

            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence source result ${this.stealItem.rollSource}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module steal, silence target result ${this.stealItem.rollTarget}`);

            if (this.stealItem.rollSource >= this.stealItem.rollTarget) {
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
                return await this.loot.channel.database.sequelize.models.item.findOne({ where: { value: this.itemParameter } }) as Model<ItemItem>;
            } else {
                return await this.loot.channel.database.sequelize.models.item.findByPk(itemHandle) as Model<ItemItem>;
            }
        }
        return null;
    }
    //#endregion

    //#region Adventure
    async getAdventures(hero: Model<HeroItem> = null): Promise<Model<AdventureItem>[]> {
        if (hero) {
            return await this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: hero.getDataValue("name") } }) as Model<AdventureItem>[];
        } else {
            return await this.loot.channel.database.sequelize.models.adventure.findAll({ where: { heroName: { [sequelize.Op.not]: this.sourceHero.getDataValue("name") } } }) as Model<AdventureItem>[];
        }
    }

    async getAdventure(hero: Model<HeroItem> = null): Promise<Model<AdventureItem>> {
        const adventures = await this.getAdventures(hero);

        if (adventures.length > 0) {
            return adventures[this.loot.getRandomNumber(0, adventures.length - 1)];
        }

        return null;
    }
    //#endregion
}