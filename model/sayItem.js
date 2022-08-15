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
exports.SayItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./sayItem.json");
class SayItem {
    constructor() {
        this.command = "";
        this.minutes = 60;
        this.help = "";
        this.text = "";
        this.isActive = true;
        this.delay = 5;
    }
    static initialize(sequelize) {
        sequelize.define('say', {
            command: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            text: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            minutes: {
                type: sequelize_1.DataTypes.DECIMAL,
                allowNull: false,
                defaultValue: 60
            },
            help: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: true
            },
            lastRun: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(2020, 1, 1)
            },
            delay: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.say.count({ where: { command: item.command } })) === 0) {
                        yield sequelize.models.say.create(item);
                    }
                    else
                        yield sequelize.models.say.update(item, { where: { command: item.command } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.SayItem = SayItem;
module.exports.default = SayItem;
//# sourceMappingURL=sayItem.js.map