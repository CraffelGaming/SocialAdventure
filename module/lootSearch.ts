import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem.js";
import { HeroItem } from "../model/heroItem.js";
import { ItemItem } from "../model/itemItem.js";
import { LocationItem } from "../model/locationItem.js";
import { Loot } from "./loot.js";

export class LootSearch {
    dungeons: Model<LocationItem>[];
    hero: Model<HeroItem>;
    item: Model<ItemItem>;
    adventure: Model<AdventureItem>;
    itemParameter: string;
    loot: Loot;
    isFound: boolean = false;
    isFoundable: boolean = false;
    isExists: boolean = true;

    //#region Construct
    constructor(loot: Loot, itemParameter: string) {
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(): Promise<boolean> {
        this.item = await this.getItem();

        if (this.item) {
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, item ${this.item.getDataValue("value")}`);
            this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle") } }) as Model<AdventureItem>;
            this.dungeons = await this.loot.channel.database.sequelize.models.location.findAll({ where: { isActive: true, categoryHandle: this.item.getDataValue("categoryHandle") } }) as Model<LocationItem>[];

            if (this.adventure) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, adventure`);
                this.hero = await this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: this.adventure.getDataValue("heroName") } }) as Model<HeroItem>;

                if (this.hero) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, hero ${this.hero.getDataValue("name")}`);
                    this.isFound = true;
                    return true;
                }

            } else if (this.dungeons && this.dungeons.length > 0) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, dungeons`);
                this.isFoundable = true;
            }
        } else this.isExists = false;

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
}