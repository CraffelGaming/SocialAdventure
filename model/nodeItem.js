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
let NodeItem = class NodeItem extends Model {
    constructor(name, displayName, language, isActive) {
        super();
        this.language = "DE-de";
        this.isActive = true;
        this.isLive = false;
        this.endpoint = '/';
        this.name = name;
        this.displayName = displayName;
        this.language = language;
        this.isActive = isActive;
    }
    static createTable({ sequelize }) {
        sequelize.define('node', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            isLive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            endpoint: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: '/'
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.node.belongsTo(sequelize.models.twitch, { as: 'twitch', foreignKey: 'name' });
        sequelize.models.node.belongsTo(sequelize.models.twitchUser, { as: 'twitchUser', foreignKey: 'name' });
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], NodeItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], NodeItem.prototype, "displayName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], NodeItem.prototype, "language", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], NodeItem.prototype, "isActive", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], NodeItem.prototype, "isLive", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], NodeItem.prototype, "endpoint", void 0);
NodeItem = __decorate([
    Table({ tableName: "node", modelName: "node" }),
    __metadata("design:paramtypes", [String, String, String, Boolean])
], NodeItem);
export { NodeItem };
//# sourceMappingURL=nodeItem.js.map