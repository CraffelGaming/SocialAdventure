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
exports.HeroInventoryItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./heroInventoryItem.json");
let HeroInventoryItem = class HeroInventoryItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.quantity = 0;
        this.isReload = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('heroInventory', {
            itemHandle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            heroName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            quantity: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.heroInventory.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.heroInventory.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle' });
    }
    static transferAdventureToInventory({ sequelize, adventure }) {
        return __awaiter(this, void 0, void 0, function* () {
            const inventory = yield sequelize.models.heroInventory.findOne({ where: { itemHandle: adventure.getDataValue("itemHandle"), heroName: adventure.getDataValue("heroName") } });
            if (inventory) {
                yield sequelize.models.heroInventory.increment('quantity', { by: 1, where: { itemHandle: adventure.getDataValue("itemHandle"), heroName: adventure.getDataValue("heroName") } });
            }
            else {
                yield sequelize.models.heroInventory.create({ heroName: adventure.getDataValue("heroName"),
                    itemHandle: adventure.getDataValue("itemHandle") });
            }
            adventure.destroy();
        });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.heroInventory.count({ where: { itemHandle: item.itemHandle, heroName: item.heroName } })) === 0) {
                        yield sequelize.models.heroInventory.create(item);
                    }
                    else
                        yield sequelize.models.heroInventory.update(item, { where: { itemHandle: item.itemHandle, heroName: item.heroName } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroInventoryItem.prototype, "itemHandle", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HeroInventoryItem.prototype, "heroName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HeroInventoryItem.prototype, "quantity", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], HeroInventoryItem.prototype, "isReload", void 0);
HeroInventoryItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "heroInventory", modelName: "heroInventory" }),
    __metadata("design:paramtypes", [])
], HeroInventoryItem);
exports.HeroInventoryItem = HeroInventoryItem;
module.exports.default = HeroInventoryItem;
//# sourceMappingURL=heroInventoryItem.js.map