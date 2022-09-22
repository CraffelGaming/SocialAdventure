import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { AdventureItem } from "../model/adventureItem";
import { EnemyItem } from "../model/enemyItem";
import { HeroInventoryItem } from "../model/heroInventoryItem";
import { HeroItem } from "../model/heroItem";
import { ItemItem } from "../model/itemItem";
import { LocationItem } from "../model/locationItem";
import { LootItem } from "../model/lootItem";
import { TranslationItem } from "../model/translationItem";
import { Loot } from "./loot";

export class LootExploring {
    dungeon: Model<LocationItem>;
    hero: Model<HeroItem>;
    item: Model<ItemItem>;
    adventure: Model<AdventureItem>;
    enemy: Model<EnemyItem>;
    loot: Loot;
    experience: number;
    gold: number;

    //#region Construct
    constructor(loot: Loot){
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute() : Promise<boolean>{
        this.hero = await this.getHero();

        if(this.hero){
            this.dungeon = await this.getDungeon();

            if(this.dungeon){
                this.item = await this.getItem(this.dungeon);

                if(this.item){
                    this.enemy = await this.getEnemy(this.dungeon);

                    if(this.enemy){
                        this.experience = this.loot.getRandomNumber(this.enemy.getDataValue("experienceMin"), this.enemy.getDataValue("experienceMax"));
                        this.gold = this.loot.getRandomNumber(this.enemy.getDataValue("GoldMin"), this.enemy.getDataValue("GoldMax"));
                        return true;
                    }
                }
            }
        }

        return false;
    }
    //#endregion

    //#region Save
    async save(){
        const adventure = new AdventureItem();
        adventure.heroName = this.hero.getDataValue("name");
        adventure.itemHandle = this.item.getDataValue("handle");
        await this.loot.channel.database.sequelize.models.adventure.create(adventure as any);
        await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: this.hero.getDataValue("name") }});
        await this.loot.channel.database.sequelize.models.hero.increment('experience', { by: this.experience, where: { name: this.hero.getDataValue("name") }});
    }
    //#endregion

    //#region Execute
    async getHero() : Promise<Model<HeroItem, HeroItem>>{
        const heroes = await this.loot.channel.database.sequelize.models.hero.findAll({where: { isActive: true} }) as Model<HeroItem>[];

        if(heroes.length > 0){
            return heroes[this.loot.getRandomNumber(0, heroes.length -1)];
        }
        return null;
    }
    //#endregion

    //#region Dungeon
    async getDungeon(): Promise<Model<LocationItem>>{
        const dungeons = await this.loot.channel.database.sequelize.models.location.findAll({where: { isActive: true} }) as Model<LocationItem>[];
        const found: Model<LocationItem>[] = [];

        for(const dungeon in dungeons){
            if((await this.getItems(dungeons[dungeon])).length > 0){
                found.push(dungeons[dungeon])
            }
        }

        return found[this.loot.getRandomNumber(0, found.length -1)];;
    }
    //#endregion

    //#region Item
    async getItems(dungeon: Model<LocationItem>): Promise<Model<ItemItem>[]>{
        const adventures = await this.loot.channel.database.sequelize.models.adventure.findAll() as Model<AdventureItem>[];
        let items = await this.loot.channel.database.sequelize.models.item.findAll({where: { categoryHandle: dungeon.getDataValue("categoryHandle")} }) as Model<ItemItem>[];

        for(const adventure in adventures){
            if(adventures[adventure]){
                items = items.filter(x => x.getDataValue("handle") !== adventures[adventure].getDataValue("itemHandle"))
            }
        }
        return items;

    }

    async getItem(dungeon: Model<LocationItem>): Promise<Model<ItemItem>>{
        const items = await this.getItems(dungeon);
        return items[this.loot.getRandomNumber(0, items.length -1)];
    }
    //#endregion

    //#region Enemy
    async getEnemy(dungeon: Model<LocationItem>): Promise<Model<EnemyItem>>{
        const enemies = await this.loot.channel.database.sequelize.models.enemy.findAll({where: { difficulty: dungeon.getDataValue("difficulty")} }) as Model<EnemyItem>[];

        if(enemies.length > 0){
            return enemies[this.loot.getRandomNumber(0, enemies.length -1)];
        }

        return null;
    }
    //#endregion

}