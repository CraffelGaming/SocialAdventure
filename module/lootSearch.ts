import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { LocationItem } from "../model/locationItem";
import { Loot } from "./loot";

export class LootSearch {
    dungeons: Model<LocationItem>[];
    hero: Model<HeroItem>;
    item: Model<ItemItem>;
    adventure: Model<AdventureItem>;
    itemHandle: number;
    loot: Loot;
    isFound: boolean = false;
    isFoundable: boolean = false;
    isExists: boolean = true;

    //#region Construct
    constructor(loot: Loot, itemHandle: number){
        this.itemHandle = itemHandle;
        this.loot = loot;
    }
    //#endregion

    //#region Find
    async find() : Promise<boolean>{
        this.item = await this.loot.channel.database.sequelize.models.item.findByPk(this.itemHandle) as Model<ItemItem>;

        if(this.item){
            this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.itemHandle }}) as Model<AdventureItem>;
            this.dungeons = await this.loot.channel.database.sequelize.models.location.findAll({where: { isActive: true, categoryHandle: this.item.getDataValue("categoryHandle")} }) as Model<LocationItem>[];

            if(this.adventure){
                this.hero = await this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: this.adventure.getDataValue("heroName") }}) as Model<HeroItem>;

                if(this.hero) {
                    this.isFound = true;
                    return true;
                }

            } else if(this.dungeons && this.dungeons.length > 0){
                this.isFoundable = true;
            }
        } else this.isExists = false;

        return false;
    }
    //#endregion
}