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
exports.MenuItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./menuItem.json");
class MenuItem {
    constructor(endpoint, name, order) {
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
    }
    static initialize(sequelize) {
        sequelize.define('menu', {
            endpoint: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            order: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.menu.hasMany(sequelize.models.menu, { as: 'childs', foreignKey: 'parentEndpoint' });
        sequelize.models.menu.belongsTo(sequelize.models.menu, { as: 'parent', foreignKey: 'parentEndpoint' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.menu.count({ where: { endpoint: item.endpoint } })) === 0) {
                        yield sequelize.models.menu.create(item);
                    }
                    else
                        yield sequelize.models.menu.update(item, { where: { endpoint: item.endpoint } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.MenuItem = MenuItem;
module.exports.default = MenuItem;
//# sourceMappingURL=menuItem.js.map