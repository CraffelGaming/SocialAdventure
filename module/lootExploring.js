"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LootExploring = void 0;
const adventureItem_1 = require("../model/adventureItem");
const heroItem_1 = require("../model/heroItem");
class LootExploring {
    //#region Construct
    constructor(loot) {
        this.experience = 0;
        this.gold = 0;
        this.damage = 0;
        this.isWinner = true;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hero = yield this.getHero();
            if (this.hero) {
                this.dungeon = yield this.getDungeon();
                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, hero ${this.hero.getDataValue("name")}`);
                if (this.dungeon) {
                    this.item = yield this.getItem(this.dungeon);
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, dungeon ${this.dungeon.getDataValue("name")}`);
                    if (this.item) {
                        this.enemy = yield this.getEnemy(this.dungeon);
                        global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, item ${this.item.getDataValue("value")}`);
                        if (this.enemy) {
                            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, enemy ${this.enemy.getDataValue("name")}`);
                            this.wallet = yield this.getWallet();
                            this.trait = yield this.getTrait();
                            this.experience = this.loot.getRandomNumber(this.enemy.getDataValue("experienceMin"), this.enemy.getDataValue("experienceMax")) + this.wallet.getDataValue("blood");
                            this.gold = this.loot.getRandomNumber(this.enemy.getDataValue("GoldMin"), this.enemy.getDataValue("GoldMax")) + this.wallet.getDataValue("blood");
                            this.gold = Math.round(this.gold * ((this.trait.getDataValue("goldMultipler") / 10) + 1));
                            this.fight();
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    }
    //#endregion
    //#region Fight
    fight() {
        return __awaiter(this, void 0, void 0, function* () {
            let enemyHitpoints = this.enemy.getDataValue("hitpoints");
            const heroHitpoints = this.hero.getDataValue("hitpoints");
            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyHitpoints ${enemyHitpoints}`);
            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight heroHitpoints ${heroHitpoints}`);
            while (enemyHitpoints > 0 && heroHitpoints - this.damage > 0) {
                const heroDamage = this.loot.getRandomNumber(Math.round(this.hero.getDataValue("strength") / 2), this.hero.getDataValue("strength"));
                enemyHitpoints -= heroDamage;
                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight heroDamage ${heroDamage}`);
                global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyHitpoints ${enemyHitpoints}`);
                if (enemyHitpoints > 0) {
                    const enemyDamage = this.loot.getRandomNumber(Math.round(this.enemy.getDataValue("strength") / 2), this.enemy.getDataValue("strength"));
                    this.damage += enemyDamage;
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight enemyDamage ${enemyDamage}`);
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight complete damage ${this.damage}`);
                }
            }
            if (this.damage >= heroHitpoints) {
                this.isWinner = false;
                this.damage = heroHitpoints;
            }
            else {
                this.isWinner = true;
            }
            global.worker.log.info(`node ${this.loot.channel.node.name}, module exploring, fight isWinner ${this.isWinner}`);
        });
    }
    //#endregion
    //#region Save
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isWinner) {
                const adventure = new adventureItem_1.AdventureItem();
                adventure.heroName = this.hero.getDataValue("name");
                adventure.itemHandle = this.item.getDataValue("handle");
                yield this.loot.channel.database.sequelize.models.adventure.create(adventure);
                yield this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: this.hero.getDataValue("name") } });
                yield this.loot.channel.database.sequelize.models.hero.increment('experience', { by: this.experience, where: { name: this.hero.getDataValue("name") } });
                yield this.loot.channel.database.sequelize.models.hero.decrement('hitpoints', { by: this.damage, where: { name: this.hero.getDataValue("name") } });
                yield heroItem_1.HeroItem.calculateHero({ sequelize: this.loot.channel.database.sequelize, element: this.hero.get() });
            }
            else {
                yield this.loot.channel.database.sequelize.models.hero.decrement('hitpoints', { by: this.damage, where: { name: this.hero.getDataValue("name") } });
            }
        });
    }
    //#endregion
    //#region Hero
    getHero() {
        return __awaiter(this, void 0, void 0, function* () {
            let heroes = yield this.loot.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } });
            heroes = heroes.filter(x => x.getDataValue("hitpoints") > 0);
            if (heroes.length > 0) {
                return heroes[this.loot.getRandomNumber(0, heroes.length - 1)];
            }
            return null;
        });
    }
    //#endregion
    //#region Dungeon
    getDungeon() {
        return __awaiter(this, void 0, void 0, function* () {
            const dungeons = yield this.loot.channel.database.sequelize.models.location.findAll({ where: { isActive: true } });
            const found = [];
            for (const dungeon in dungeons) {
                if ((yield this.getItems(dungeons[dungeon])).length > 0) {
                    found.push(dungeons[dungeon]);
                }
            }
            return found[this.loot.getRandomNumber(0, found.length - 1)];
            ;
        });
    }
    //#endregion
    //#region Item
    getItems(dungeon) {
        return __awaiter(this, void 0, void 0, function* () {
            const adventures = yield this.loot.channel.database.sequelize.models.adventure.findAll();
            let items = yield this.loot.channel.database.sequelize.models.item.findAll({ where: { categoryHandle: dungeon.getDataValue("categoryHandle") } });
            for (const adventure in adventures) {
                if (adventures[adventure]) {
                    items = items.filter(x => x.getDataValue("handle") !== adventures[adventure].getDataValue("itemHandle"));
                }
            }
            return items;
        });
    }
    getItem(dungeon) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = yield this.getItems(dungeon);
            return items[this.loot.getRandomNumber(0, items.length - 1)];
        });
    }
    //#endregion
    //#region Enemy
    getEnemy(dungeon) {
        return __awaiter(this, void 0, void 0, function* () {
            const enemies = yield this.loot.channel.database.sequelize.models.enemy.findAll({ where: { difficulty: dungeon.getDataValue("difficulty") } });
            if (enemies.length > 0) {
                return enemies[this.loot.getRandomNumber(0, enemies.length - 1)];
            }
            return null;
        });
    }
    //#endregion
    //#region Wallet
    getWallet() {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.loot.channel.database.sequelize.models.heroWallet.findByPk(this.hero.getDataValue("name"));
            const blood = this.loot.settings.find(x => x.command === "blood");
            if (wallet) {
                if (this.loot.isDateTimeoutExpiredMinutes(new Date(wallet.getDataValue("lastBlood")), blood.minutes)) {
                    wallet.setDataValue("blood", 0);
                    wallet.save();
                }
                return wallet;
            }
            return null;
        });
    }
    //#endregion
    //#region Trait
    getTrait() {
        return __awaiter(this, void 0, void 0, function* () {
            const trait = yield this.loot.channel.database.sequelize.models.heroTrait.findByPk(this.hero.getDataValue("name"));
            if (trait) {
                return trait;
            }
            return null;
        });
    }
}
exports.LootExploring = LootExploring;
//# sourceMappingURL=lootExploring.js.map