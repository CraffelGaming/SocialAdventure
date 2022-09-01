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
exports.HeroTraitItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./heroTraitItem.json");
class HeroTraitItem {
    constructor() {
        this.heroName = "";
    }
    static createTable({ sequelize }) {
        sequelize.define('heroTrait', {
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            goldMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            stealMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            defenceMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            },
            workMultipler: {
                type: sequelize_1.DataTypes.DOUBLE,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroTrait.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroTrait.count({ where: { heroName: item.heroName } })) === 0) {
                        yield sequelize.models.heroTrait.create(item);
                    }
                    else
                        yield sequelize.models.heroTrait.update(item, { where: { heroName: item.heroName } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.HeroTraitItem = HeroTraitItem;
module.exports.default = HeroTraitItem;
//# sourceMappingURL=heroTraitItem.js.map