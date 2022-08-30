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
exports.CommandItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./commandItem.json");
class CommandItem {
    constructor() {
        this.module = "";
        this.command = "";
        this.isMaster = false;
        this.translation = "";
    }
    static initialize(sequelize) {
        sequelize.define('command', {
            module: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            command: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            isMaster: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            translation: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.command.count({ where: { module: item.module, command: item.command } })) === 0) {
                        yield sequelize.models.command.create(item);
                    }
                    else
                        yield sequelize.models.command.update(item, { where: { module: item.module, command: item.command } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.CommandItem = CommandItem;
module.exports.default = CommandItem;
//# sourceMappingURL=commandItem.js.map