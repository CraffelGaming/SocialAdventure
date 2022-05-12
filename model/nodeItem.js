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
exports.NodeItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./nodeItem.json");
class NodeItem {
    constructor(name, displayName, language, isActive) {
        this.name = name;
        this.displayName = displayName;
        this.language = language;
        this.isActive = isActive;
    }
    static initialize(sequelize) {
        sequelize.define('node', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false
            },
            endpoint: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: '/'
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.node.count({ where: { name: item.name } })) === 0) {
                        yield sequelize.models.node.create(item);
                    }
                    else
                        yield sequelize.models.node.update(item, { where: { name: item.name } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.NodeItem = NodeItem;
module.exports.default = NodeItem;
//# sourceMappingURL=nodeItem.js.map