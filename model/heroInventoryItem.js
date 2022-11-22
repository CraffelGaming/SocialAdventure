var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
let HeroInventoryItem = class HeroInventoryItem extends Model {
    constructor() {
        super();
        this.quantity = 0;
        this.isReload = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroInventory', {
            itemHandle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle' });
    }
    static async transferAdventureToInventory({ sequelize, adventure }) {
        const inventory = await sequelize.models.heroInventory.findOne({ where: { itemHandle: adventure.getDataValue("itemHandle"), heroName: adventure.getDataValue("heroName") } });
        if (inventory) {
            await sequelize.models.heroInventory.increment('quantity', { by: 1, where: { itemHandle: adventure.getDataValue("itemHandle"), heroName: adventure.getDataValue("heroName") } });
        }
        else {
            await sequelize.models.heroInventory.create({ heroName: adventure.getDataValue("heroName"),
                itemHandle: adventure.getDataValue("itemHandle") });
        }
        adventure.destroy();
    }
    static async transferItemToInventory({ sequelize, item, heroName }) {
        const inventory = await sequelize.models.heroInventory.findOne({ where: { itemHandle: item.getDataValue("handle"), heroName } });
        if (inventory) {
            await sequelize.models.heroInventory.increment('quantity', { by: 1, where: { itemHandle: item.getDataValue("handle"), heroName } });
        }
        else {
            await sequelize.models.heroInventory.create({ heroName,
                itemHandle: item.getDataValue("handle") });
        }
    }
    static async sell({ sequelize, itemHandle, heroName, quantity }) {
        try {
            const inventory = await sequelize.models.heroInventory.findOne({ where: { heroName, itemHandle } });
            const hero = await sequelize.models.hero.findByPk(heroName);
            const item = await sequelize.models.item.findByPk(itemHandle);
            const heroWallet = await sequelize.models.heroWallet.findByPk(heroName);
            if (inventory && hero && heroWallet && item && quantity > 0) {
                if (quantity > inventory.getDataValue('quantity')) {
                    quantity = inventory.getDataValue('quantity');
                }
                await heroWallet.increment('gold', { by: quantity * item.getDataValue("gold") });
                if (quantity >= inventory.getDataValue('quantity')) {
                    inventory.destroy();
                }
                else {
                    await inventory.decrement('quantity', { by: quantity });
                }
                return 200;
            }
            else
                return 404;
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
    __metadata("design:type", Number)
], HeroInventoryItem.prototype, "itemHandle", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], HeroInventoryItem.prototype, "heroName", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], HeroInventoryItem.prototype, "quantity", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], HeroInventoryItem.prototype, "isReload", void 0);
HeroInventoryItem = __decorate([
    Table({ tableName: "heroInventory", modelName: "heroInventory" }),
    __metadata("design:paramtypes", [])
], HeroInventoryItem);
export { HeroInventoryItem };
//# sourceMappingURL=heroInventoryItem.js.map