var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
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
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            gold: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1000
            },
            diamond: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            blood: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            lastBlood: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroWallet.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.heroName !== null && element.heroName !== "") {
                if (await sequelize.models.heroWallet.count({ where: { heroName: element.heroName } }) === 0) {
                    await sequelize.models.heroWallet.create(element);
                }
                else
                    await sequelize.models.heroWallet.update(element, { where: { heroName: element.heroName } });
                return 201;
            }
            else
                return 406;
        }
        catch (ex) {
            global.worker.log.error(ex);
            return 500;
        }
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], HeroWalletItem.prototype, "heroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "gold", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "diamond", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroWalletItem.prototype, "blood", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], HeroWalletItem.prototype, "lastBlood", void 0);
HeroWalletItem = __decorate([
    Table({ tableName: "heroWallet", modelName: "heroWallet" }),
    __metadata("design:paramtypes", [String])
], HeroWalletItem);
export { HeroWalletItem };
//# sourceMappingURL=heroWalletItem.js.map