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
exports.LevelItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./levelItem.json");
class LevelItem {
    constructor(handle, experienceMin, experienceMax) {
        this.handle = 0;
        this.experienceMin = 0;
        this.experienceMax = 0;
    }
    static initialize(sequelize) {
        sequelize.define('level', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            experienceMin: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            experienceMax: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.level.count({ where: { handle: item.handle } })) === 0) {
                        yield sequelize.models.level.create(item);
                    }
                    else
                        yield sequelize.models.level.update(item, { where: { handle: item.handle } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.LevelItem = LevelItem;
module.exports.default = LevelItem;
//# sourceMappingURL=levelItem.js.map