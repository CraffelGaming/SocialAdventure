import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { LootItem } from "../model/lootItem";
import { Loot } from "./loot";

export class LootGive {
    item: Model<ItemItem>;
    adventure: Model<AdventureItem>;
    itemParameter: string;
    targetHeroName: string;
    targetHero: Model<HeroItem>;
    sourceHeroName: string;
    sourceHero: Model<HeroItem>;
    loot: Loot;

    isSource: boolean = true;
    isTarget: boolean = true;
    isItem: boolean = true;
    isAdventure: boolean = true;
    isTimeout: boolean = true;
    isSelf: boolean = true;
    isActive: boolean = true;

    //#region Construct
    constructor(loot: Loot, sourceHeroName: string, targetHeroName: string, itemParameter: string){
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.itemParameter = itemParameter;
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(settings: LootItem) : Promise<boolean>{
        this.item =  await this.getItem();
        this.sourceHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName) as Model<HeroItem>;
        this.targetHero = await this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName) as Model<HeroItem>;

        if(settings.isActive){
            if(this.item){
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, item ${this.item.getDataValue("value")}`);
                if(this.sourceHero){
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if(this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastGive")), settings.minutes)){
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, timeout expired`);
                        if(this.targetHero){
                            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, targetHero ${this.targetHero.getDataValue("name")}`);
                            if(this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")){
                                this.adventure = await this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle"), heroName: this.sourceHero.getDataValue("name") }}) as Model<AdventureItem>;
                                if(this.adventure){
                                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module give, adventure `);
                                    await this.adventure.destroy();
                                    const adventure = new AdventureItem(this.item.getDataValue("handle"), this.targetHero.getDataValue("name"));
                                    await AdventureItem.put({sequelize: this.loot.channel.database.sequelize, element: adventure});
                                    this.sourceHero.setDataValue("lastGive", new Date());
                                    await this.sourceHero.save();
                                    return true;
                                } else this.isAdventure = false;
                            } else this.isSelf = false;
                        } else this.isTarget = false;
                    } else this.isTimeout = false;
                } else this.isSource = false;
            } else this.isItem = false;
        } else this.isActive = false;

        return false;
    }
    //#endregion

    //#region Item
    async getItem(){
        if(this.itemParameter && this.itemParameter.length > 0){
            const itemHandle = Number(this.itemParameter);
            if(isNaN(itemHandle)){
                return await this.loot.channel.database.sequelize.models.item.findOne({ where: { value: this.itemParameter }}) as Model<ItemItem>;
            } else {
                return await this.loot.channel.database.sequelize.models.item.findByPk(itemHandle) as Model<ItemItem>;
            }
        }
        return null;
    }
    //#endregion
}