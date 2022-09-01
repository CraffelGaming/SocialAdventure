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
exports.ItemItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./itemItem.json");
class ItemItem {
    constructor() {
        this.handle = 0;
        this.categoryHandle = 1;
    }
    static createTable({ sequelize }) {
        sequelize.define('item', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 50
            },
            categoryHandle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            },
            type: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize, isGlobal }) {
        if (!isGlobal) {
            sequelize.models.item.hasMany(sequelize.models.heroInventory, { as: 'inventory', foreignKey: 'itemhandle' });
        }
        sequelize.models.item.belongsTo(sequelize.models.itemCategory, { as: 'category', foreignKey: 'categoryHandle' });
    }
    static updateTable({ sequelize, isGlobal }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.item.count({ where: { handle: item.handle } })) === 0) {
                        if (isGlobal === true && item.categoryHandle !== 1) {
                            yield sequelize.models.item.create(item);
                        }
                        else if (isGlobal === false && item.categoryHandle === 1) {
                            yield sequelize.models.item.create(item);
                        }
                    }
                    else
                        yield sequelize.models.item.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.ItemItem = ItemItem;
module.exports.default = ItemItem;
//# sourceMappingURL=itemItem.js.map