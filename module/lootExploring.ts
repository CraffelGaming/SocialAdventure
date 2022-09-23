import { Model } from "sequelize-typescript";
import { Channel } from "../controller/channel";
import { Command } from "../controller/command";
import { AdventureItem } from "../model/adventureItem";
import { EnemyItem } from "../model/enemyItem";
import { HeroInventoryItem } from "../model/heroInventoryItem";
import { HeroItem } from "../model/heroItem";
import { HeroWalletItem } from "../model/heroWalletItem";
import { ItemItem } from "../model/itemItem";
import { LocationItem } from "../model/locationItem";
import { LootItem } from "../model/lootItem";
import { TranslationItem } from "../model/translationItem";
import { Loot } from "./loot";

export class LootExploring {
    dungeon: Model<LocationItem>;
    hero: Model<HeroItem>;
    item: Model<ItemItem>;
    wallet: Model<HeroWalletItem>;
    adventure: Model<AdventureItem>;
    enemy: Model<EnemyItem>;
    loot: Loot;
    experience: number = 0;
    gold: number = 0;
    damage: number = 0;
    isWinner: boolean = true;

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
            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, hero ${this.hero.getDataValue("name")}`);

            if(this.dungeon){
                this.item = await this.getItem(this.dungeon);
                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, dungeon ${this.dungeon.getDataValue("name")}`);

                if(this.item){
                    this.enemy = await this.getEnemy(this.dungeon);
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, item ${this.item.getDataValue("value")}`);

                    if(this.enemy){
                        global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, enemy ${this.enemy.getDataValue("name")}`);

                        this.wallet = await this.getWallet(this.dungeon);
                        this.experience = this.loot.getRandomNumber(this.enemy.getDataValue("experienceMin"), this.enemy.getDataValue("experienceMax")) + this.wallet.getDataValue("blood");
                        this.gold = this.loot.getRandomNumber(this.enemy.getDataValue("GoldMin"), this.enemy.getDataValue("GoldMax")) + this.wallet.getDataValue("blood");
                        this.fight();
                        return true;
                    }
                }
            }
        }

        return false;
    }
    //#endregion

    //#region Fight
    async fight(){
        let enemyHitpoints = this.enemy.getDataValue("hitpoints");
        const heroHitpoints = this.hero.getDataValue("hitpoints");

        global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyHitpoints ${enemyHitpoints}`);
        global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight heroHitpoints ${heroHitpoints}`);

        while(enemyHitpoints > 0 && heroHitpoints - this.damage > 0){
            const heroDamage = this.loot.getRandomNumber(Math.round(this.hero.getDataValue("strength") / 2), this.hero.getDataValue("strength"));
            enemyHitpoints -= heroDamage;

            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight heroDamage ${heroDamage}`);
            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyHitpoints ${enemyHitpoints}`);

            if(enemyHitpoints > 0){
                const enemyDamage = this.loot.getRandomNumber(Math.round(this.enemy.getDataValue("strength") / 2), this.enemy.getDataValue("strength"));
                this.damage += enemyDamage;

                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyDamage ${enemyDamage}`);
                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight complete damage ${this.damage}`);
            }
        }

        if(this.damage >= heroHitpoints){
            this.isWinner = false;
            this.damage = heroHitpoints;
        } else {
            this.isWinner = true;
        }

        global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight isWinner ${this.isWinner}`);
    }
    //#endregion

    //#region Save
    async save(){
        if(this.isWinner){
            const adventure = new AdventureItem();
            adventure.heroName = this.hero.getDataValue("name");
            adventure.itemHandle = this.item.getDataValue("handle");
            await this.loot.channel.database.sequelize.models.adventure.create(adventure as any);
            await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: this.hero.getDataValue("name") }});
            await this.loot.channel.database.sequelize.models.hero.increment('experience', { by: this.experience, where: { name: this.hero.getDataValue("name") }});
            await this.loot.channel.database.sequelize.models.hero.increment('hitpoints', { by: this.damage * -1, where: { name: this.hero.getDataValue("name") }});
            await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: this.hero.get()});
        } else {
            await this.loot.channel.database.sequelize.models.hero.increment('hitpoints', { by: this.damage * -1, where: { name: this.hero.getDataValue("name") }});
        }
    }
    //#endregion

    //#region Hero
    async getHero() : Promise<Model<HeroItem, HeroItem>>{
        let heroes = await this.loot.channel.database.sequelize.models.hero.findAll({where: { isActive: true} }) as Model<HeroItem>[];
        heroes = heroes.filter(x => x.getDataValue("hitpoints") > 0);

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

    //#region Wallet
    async getWallet(dungeon: Model<LocationItem>): Promise<Model<HeroWalletItem>>{
        const wallet = await this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.hero.getDataValue("name")) as Model<HeroWalletItem>;
        const blood = this.loot.settings.find(x =>x.command === "blood");
        if(wallet){
            if(this.loot.isDateTimeoutExpired(new Date(wallet.getDataValue("lastBlood")), blood.minutes)){
                wallet.setDataValue("blood", 0);
                wallet.save();
            }
            return wallet;
        }
        return null;
    }
    //#endregion
}