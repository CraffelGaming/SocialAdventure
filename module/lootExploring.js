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
class LootExploring {
    //#region Construct
    constructor(loot) {
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.hero = yield this.getHero();
            if (this.hero) {
                this.dungeon = yield this.getDungeon();
                if (this.dungeon) {
                    this.item = yield this.getItem(this.dungeon);
                    if (this.item) {
                        this.enemy = yield this.getEnemy(this.dungeon);
                        if (this.enemy) {
                            this.experience = this.loot.getRandomNumber(this.enemy.getDataValue("experienceMin"), this.enemy.getDataValue("experienceMax"));
                            this.gold = this.loot.getRandomNumber(this.enemy.getDataValue("GoldMin"), this.enemy.getDataValue("GoldMax"));
                            return true;
                        }
                    }
                }
            }
            return false;
        });
    }
    //#endregion
    //#region Save
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const adventure = new adventureItem_1.AdventureItem();
            adventure.heroName = this.hero.getDataValue("name");
            adventure.itemHandle = this.item.getDataValue("handle");
            yield this.loot.channel.database.sequelize.models.adventure.create(adventure);
            yield this.loot.channel.database.sequelize.models.heroWallet.increment('gold', { by: this.gold, where: { heroName: this.hero.getDataValue("name") } });
            yield this.loot.channel.database.sequelize.models.hero.increment('experience', { by: this.experience, where: { name: this.hero.getDataValue("name") } });
        });
    }
    //#endregion
    //#region Execute
    getHero() {
        return __awaiter(this, void 0, void 0, function* () {
            const heroes = yield this.loot.channel.database.sequelize.models.hero.findAll({ where: { isActive: true } });
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
}
exports.LootExploring = LootExploring;
//# sourceMappingURL=lootExploring.js.map