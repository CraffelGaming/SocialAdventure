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
exports.LootGive = void 0;
const adventureItem_1 = require("../model/adventureItem");
class LootGive {
    //#region Construct
    constructor(loot, sourceHeroName, targetHeroName, itemHandle) {
        this.isSource = true;
        this.isTarget = true;
        this.isItem = true;
        this.isAdventure = true;
        this.isTimeout = true;
        this.isSelf = true;
        this.sourceHeroName = sourceHeroName;
        this.targetHeroName = targetHeroName;
        this.itemHandle = itemHandle;
        this.loot = loot;
    }
    //#endregion
    //#region Execute
    execute(settings) {
        return __awaiter(this, void 0, void 0, function* () {
            this.item = (yield this.loot.channel.database.sequelize.models.item.findByPk(this.itemHandle));
            this.sourceHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.sourceHeroName));
            this.targetHero = (yield this.loot.channel.database.sequelize.models.hero.findByPk(this.targetHeroName));
            if (this.item) {
                global.worker.log.info(`node ${this.loot.channel.node.name}, module give, item ${this.item.getDataValue("value")}`);
                if (this.sourceHero) {
                    global.worker.log.info(`node ${this.loot.channel.node.name}, module give, sourceHero ${this.sourceHero.getDataValue("name")}`);
                    if (this.loot.isDateTimeoutExpiredMinutes(new Date(this.sourceHero.getDataValue("lastGive")), settings.minutes)) {
                        global.worker.log.info(`node ${this.loot.channel.node.name}, module give, timeout expired`);
                        if (this.targetHero) {
                            global.worker.log.info(`node ${this.loot.channel.node.name}, module give, targetHero ${this.targetHero.getDataValue("name")}`);
                            if (this.sourceHero.getDataValue("name") !== this.targetHero.getDataValue("name")) {
                                this.adventure = (yield this.loot.channel.database.sequelize.models.adventure.findOne({ where: { itemHandle: this.item.getDataValue("handle"), heroName: this.sourceHero.getDataValue("name") } }));
                                if (this.adventure) {
                                    global.worker.log.info(`node ${this.loot.channel.node.name}, module give, adventure `);
                                    yield this.adventure.destroy();
                                    const adventure = new adventureItem_1.AdventureItem(this.item.getDataValue("handle"), this.targetHero.getDataValue("name"));
                                    yield adventureItem_1.AdventureItem.put({ sequelize: this.loot.channel.database.sequelize, element: adventure });
                                    this.sourceHero.setDataValue("lastGive", new Date());
                                    yield this.sourceHero.save();
                                    return true;
                                }
                                else
                                    this.isAdventure = false;
                            }
                            else
                                this.isSelf = false;
                        }
                        else
                            this.isTarget = false;
                    }
                    else
                        this.isTimeout = false;
                }
                else
                    this.isSource = false;
            }
            else
                this.isItem = false;
            return false;
        });
    }
}
exports.LootGive = LootGive;
//# sourceMappingURL=lootGive.js.map