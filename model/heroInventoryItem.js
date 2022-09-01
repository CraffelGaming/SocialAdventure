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
exports.HeroInventoryItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./heroInventoryItem.json");
class HeroInventoryItem {
    constructor() {
        this.itemHandle = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroInventory', {
            itemHandle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            isReload: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroInventory.count({ where: { itemHandle: item.itemHandle, heroName: item.heroName } })) === 0) {
                        yield sequelize.models.heroInventory.create(item);
                    }
                    else
                        yield sequelize.models.heroInventory.update(item, { where: { itemHandle: item.itemHandle, heroName: item.heroName } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.HeroInventoryItem = HeroInventoryItem;
module.exports.default = HeroInventoryItem;
//# sourceMappingURL=heroInventoryItem.js.map