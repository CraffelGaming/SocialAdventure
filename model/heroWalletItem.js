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
exports.HeroWalletItem = void 0;
const sequelize_1 = require("sequelize");
const json = require("./heroWalletItem.json");
class HeroWalletItem {
    constructor() {
        this.heroName = "";
    }
    static initialize(sequelize) {
        sequelize.define('heroWallet', {
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 100
            },
            diamond: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            blood: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            lastBlood: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroWallet.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroWallet.count({ where: { heroName: item.heroName } })) === 0) {
                        yield sequelize.models.heroWallet.create(item);
                    }
                    else
                        yield sequelize.models.heroWallet.update(item, { where: { heroName: item.heroName } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.HeroWalletItem = HeroWalletItem;
module.exports.default = HeroWalletItem;
//# sourceMappingURL=heroWalletItem.js.map