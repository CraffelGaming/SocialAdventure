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
exports.LootSearch = void 0;
class LootSearch {
    //#region Construct
    constructor(loot, itemHandle) {
        this.isFound = false;
        this.isFoundable = false;
        this.isExists = true;
        this.itemHandle = itemHandle;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.itemHandle));
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, item ${this.item.getDataValue("value")}`);
                this.adventure = (yield this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.itemHandle } }));
                this.dungeons = (yield this.loot.channel.database.sequelize.models.location.findAll({ where: { isActive: true, categoryHandle: this.item.getDataValue("categoryHandle") } }));
                if (this.adventure) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, adventure`);
                    this.hero = (yield this.loot.channel.database.sequelize.models.hero.findOne({ where: { name: this.adventure.getDataValue("heroName") } }));
                    if (this.hero) {
                        global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, hero ${this.hero.getDataValue("name")}`);
                        this.isFound = true;
                        return true;
                    }
                }
                else if (this.dungeons && this.dungeons.length > 0) {
                    global.worker.log.info(`node ${this.loot.channel.node.getDataValue('name')}, module search, dungeons`);
                    this.isFoundable = true;
                }
            }
            else
                this.isExists = false;
            return false;
        });
    }
}
exports.LootSearch = LootSearch;
//# sourceMappingURL=lootSearch.js.map