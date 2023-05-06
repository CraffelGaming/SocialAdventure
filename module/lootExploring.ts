import { Model } from "sequelize-typescript";
import { AdventureItem } from "../model/adventureItem.js";
import { EnemyItem } from "../model/enemyItem.js";
import { HeroItem } from "../model/heroItem.js";
import { HeroTraitItem } from "../model/heroTraitItem.js";
import { HeroWalletItem } from "../model/heroWalletItem.js";
import { HistoryAdventureItem } from "../model/historyAdventureItem.js";
import { ItemItem } from "../model/itemItem.js";
import { LocationItem } from "../model/locationItem.js";
import { Loot } from "./loot";

export class LootExploring {
    adventureItem: HistoryAdventureItem;
    dungeon: Model<LocationItem>;
    hero: Model<HeroItem>;
    item: Model<ItemItem>;
    wallet: Model<HeroWalletItem>;
    trait: Model<HeroTraitItem>;
    adventure: Model<AdventureItem>;
    enemy: Model<EnemyItem>;
    loot: Loot;

    //#region Construct
    constructor(loot: Loot) {
        this.adventureItem = new HistoryAdventureItem();
        this.loot = loot;
    }
    //#endregion

    //#region Execute
    async execute(): Promise<boolean> {
        this.hero = await this.getHero();

        if (this.hero) {
            this.adventureItem.heroName = this.hero.getDataValue('name');
            this.dungeon = await this.getDungeon();
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, hero ${this.hero.getDataValue("name")}`);

            if (this.dungeon) {
                this.item = await this.getItem(this.dungeon);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, dungeon ${this.dungeon.getDataValue("name")}`);

                if (this.item) {
                    this.adventureItem.itemName = this.item.getDataValue('value');
                    this.enemy = await this.getEnemy(this.dungeon);
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, item ${this.item.getDataValue("value")}`);

                    if (this.enemy) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, enemy ${this.enemy.getDataValue("name")}`);
                        this.adventureItem.enemyName = this.enemy.getDataValue('name');
                        this.wallet = await this.getWallet();
                        this.trait = await this.getTrait();
                        this.adventureItem.experience = this.loot.getRandomNumber(this.enemy.getDataValue("experienceMin"), this.enemy.getDataValue("experienceMax")) + this.wallet.getDataValue("blood");
                        this.adventureItem.gold = this.loot.getRandomNumber(this.enemy.getDataValue("goldMin"), this.enemy.getDataValue("goldMax")) + this.wallet.getDataValue("blood");
                        this.adventureItem.gold = Math.round(this.adventureItem.gold * ((this.trait.getDataValue("goldMultipler") / 10) + 1));
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
    async fight() {
        this.adventureItem.enemyHitpointsStart = this.enemy.getDataValue("hitpoints");
        this.adventureItem.enemyHitpointsEnd = this.enemy.getDataValue("hitpoints");
        this.adventureItem.heroHitpointsStart = this.hero.getDataValue("hitpoints");
        this.adventureItem.heroHitpointsEnd = this.hero.getDataValue("hitpoints");

        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight enemyHitpoints ${this.adventureItem.enemyHitpointsStart}`);
        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight heroHitpoints ${this.adventureItem.heroHitpointsStart}`);

        while (this.adventureItem.enemyHitpointsEnd > 0 && this.adventureItem.heroHitpointsStart - this.adventureItem.enemyDamage > 0) {
            const heroDamage = this.loot.getRandomNumber(Math.round(this.hero.getDataValue("strength") / 2), this.hero.getDataValue("strength"));
            this.adventureItem.enemyHitpointsEnd -= heroDamage;
            this.adventureItem.heroDamage += heroDamage;

            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight heroDamage ${heroDamage}`);
            global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight enemyHitpoints ${this.adventureItem.enemyHitpointsEnd}`);

            if (this.adventureItem.enemyHitpointsEnd > 0) {
                let enemyDamage = this.loot.getRandomNumber(Math.round(this.enemy.getDataValue("strength") / 2), this.enemy.getDataValue("strength"));

                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight enemyDamage before defence ${enemyDamage}`);

                enemyDamage = Math.round(enemyDamage / 100 * (100 - (this.trait.getDataValue("defenceMultipler") / 2 + 1)));
                this.adventureItem.enemyDamage += enemyDamage;

                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight enemyDamage after defence ${enemyDamage}`);
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight complete damage ${this.adventureItem.enemyDamage}`);
            }
        }

        if (this.adventureItem.enemyDamage >= this.adventureItem.heroHitpointsStart) {
            this.adventureItem.isSuccess = false;
            this.adventureItem.enemyDamage = this.adventureItem.heroHitpointsStart;
        } else {
            this.adventureItem.isSuccess = true;
        }
        this.adventureItem.heroHitpointsEnd -= this.adventureItem.enemyDamage;

        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module exploring, fight isWinner ${this.adventureItem.isSuccess}`);
    }
    //#endregion

    //#region Save
    async save() {
        if (this.adventureItem.isSuccess) {
            const adventure = new AdventureItem(this.item.getDataValue("handle"), this.hero.getDataValue("name"));

            await this.loot.channel.database.sequelize.models.adventure.create(adventure as any);
            await this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.adventureItem.gold, where: { heroName: this.hero.getDataValue("name") } });
            await this.hero.increment('experience', { by: this.adventureItem.experience });
            await this.hero.decrement('hitpoints', { by: this.adventureItem.enemyDamage });
            await HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: this.hero.get() });

            HistoryAdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: this.adventureItem })
        } else {
            await this.loot.channel.database.sequelize.models.hero.decrement('hitpoints', { by: this.adventureItem.enemyDamage, where: { name: this.hero.getDataValue("name") } });
        }
    }
    //#endregion

    //#region Hero
    async getHero(): Promise<Model<HeroItem, HeroItem>> {
        let heroes = await this.loot.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } }) as Model<HeroItem>[];
        heroes = heroes.filter(x => x.getDataValue("hitpoints") > 0);

        if (heroes.length > 0) {
            return heroes[this.loot.getRandomNumber(0, heroes.length - 1)];
        }
        return null;
    }
    //#endregion

    //#region Dungeon
    async getDungeons(): Promise<Model<LocationItem>[]> {
        const dungeons = await this.loot.channel.database.sequelize.models.location.findAll({ where: { isActive: true } }) as Model<LocationItem>[];
        const found: Model<LocationItem>[] = [];

        for (const dungeon in dungeons) {
            if ((await this.getItems(dungeons[dungeon])).length > 0) {
                found.push(dungeons[dungeon])
            }
        }

        return found;
    }

    async getDungeon(): Promise<Model<LocationItem>> {
        const found = await this.getDungeons();
        return found[this.loot.getRandomNumber(0, found.length - 1)];;
    }
    //#endregion

    //#region Item
    async getItems(dungeon: Model<LocationItem>): Promise<Model<ItemItem>[]> {
        const adventures = await this.loot.channel.database.sequelize.models.adventure.findAll() as Model<AdventureItem>[];
        let items = await this.loot.channel.database.sequelize.models.item.findAll({ where: { categoryHandle: dungeon.getDataValue("categoryHandle") } }) as Model<ItemItem>[];

        for (const adventure in adventures) {
            if (adventures[adventure]) {
                items = items.filter(x => x.getDataValue("handle") !== adventures[adventure].getDataValue("itemHandle"))
            }
        }
        return items;

    }

    async getItem(dungeon: Model<LocationItem>): Promise<Model<ItemItem>> {
        const items = await this.getItems(dungeon);
        return items[this.loot.getRandomNumber(0, items.length - 1)];
    }
    //#endregion

    //#region Enemy
    async getEnemy(dungeon: Model<LocationItem>): Promise<Model<EnemyItem>> {
        const enemies = await this.loot.channel.database.sequelize.models.enemy.findAll({ where: { difficulty: dungeon.getDataValue("difficulty") } }) as Model<EnemyItem>[];

        if (enemies.length > 0) {
            return enemies[this.loot.getRandomNumber(0, enemies.length - 1)];
        }

        return null;
    }
    //#endregion

    //#region Wallet
    async getWallet(): Promise<Model<HeroWalletItem>> {
        const wallet = await this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.hero.getDataValue("name")) as Model<HeroWalletItem>;
        const blood = this.loot.settings.find(x => x.getDataValue("command") === "blood");
        if (wallet) {
            if (this.loot.isDateTimeoutExpiredMinutes(new Date(wallet.getDataValue("lastBlood")), blood.getDataValue("minutes"))) {
                wallet.setDataValue("blood", 0);
                wallet.save();
            }
            return wallet;
        }
        return null;
    }
    //#endregion

    //#region Trait
    async getTrait(): Promise<Model<HeroTraitItem>> {
        const trait = await this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.hero.getDataValue("name")) as Model<HeroTraitItem>;
        if (trait) {
            return trait;
        }
        return null;
    }
    //#endregion
}