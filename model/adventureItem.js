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
let AdventureItem = class AdventureItem {
    constructor(itemHandle, heroName) {
        this.itemHandle = itemHandle;
        this.heroName = heroName;
    }
    static createTable({ sequelize }) {
        sequelize.define('adventure', {
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
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.adventure.belongsTo(sequelize.models.hero, { as: 'hero', foreignKey: 'heroName' });
        sequelize.models.adventure.belongsTo(sequelize.models.item, { as: 'item', foreignKey: 'itemHandle' });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.heroName != null && element.itemHandle > 0) {
                const item = await sequelize.models.adventure.findOne({ where: { heroName: element.heroName, itemHandle: element.itemHandle } });
                if (!item) {
                    await sequelize.models.adventure.create(element);
                    return 201;
                }
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
    __metadata("design:type", Number)
], AdventureItem.prototype, "itemHandle", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], AdventureItem.prototype, "heroName", void 0);
AdventureItem = __decorate([
    Table({ tableName: "adventure", modelName: "adventure" }),
    __metadata("design:paramtypes", [Number, String])
], AdventureItem);
export { AdventureItem };
//# sourceMappingURL=adventureItem.js.map