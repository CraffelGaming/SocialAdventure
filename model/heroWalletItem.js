"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
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
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let HeroWalletItem = class HeroWalletItem {
    constructor(heroName) {
        this.gold = 1000;
        this.diamond = 0;
        this.blood = 0;
        this.lastBlood = new Date(2020, 1, 1);
        this.heroName = heroName;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroWallet', {
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            gold: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1000
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
    static put({ sequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (element.heroName !== null && element.heroName !== "") {
                    if ((yield sequelize.models.heroWallet.count({ where: { heroName: element.heroName } })) === 0) {
                        yield sequelize.models.heroWallet.create(element);
                    }
                    else
                        yield sequelize.models.heroWallet.update(element, { where: { heroName: element.heroName } });
                    return 201;
                }
                else
                    return 406;
            }
            catch (ex) {
                global.worker.log.error(ex);
                return 500;
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HeroWalletItem.prototype, "heroName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "gold", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "diamond", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "blood", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], HeroWalletItem.prototype, "lastBlood", void 0);
HeroWalletItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "heroWallet", modelName: "heroWallet" }),
    __metadata("design:paramtypes", [String])
], HeroWalletItem);
exports.HeroWalletItem = HeroWalletItem;
module.exports.default = HeroWalletItem;
//# sourceMappingURL=heroWalletItem.js.map