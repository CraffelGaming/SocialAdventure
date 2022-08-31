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
exports.ItemCategoryItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./itemCategoryItem.json");
class ItemCategoryItem {
    constructor() {
        this.handle = 0;
        this.value = "";
    }
    static initialize(sequelize) {
        sequelize.define('itemCategory', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'items', foreignKey: 'categoryHandle' });
    }
    static updateTable({ sequelize, isGlobal }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.itemCategory.count({ where: { handle: item.handle } })) === 0) {
                        if (isGlobal === true && item.handle !== 1) {
                            yield sequelize.models.itemCategory.create(item);
                        }
                        else if (isGlobal === false && item.handle === 1) {
                            yield sequelize.models.itemCategory.create(item);
                        }
                    }
                    else
                        yield sequelize.models.itemCategory.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.ItemCategoryItem = ItemCategoryItem;
module.exports.default = ItemCategoryItem;
//# sourceMappingURL=itemCategoryItem.js.map