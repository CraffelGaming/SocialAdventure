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
let TwitchItem = class TwitchItem extends Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
        sequelize.define('twitch', {
            channelName: {
                type: DataTypes.STRING,
                allowNull: true,
                primaryKey: true
            },
            state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            accessToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            refreshToken: {
                type: DataTypes.STRING,
                allowNull: true
            },
            scope: {
                type: DataTypes.STRING,
                allowNull: true
            },
            tokenType: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.twitch.hasOne(sequelize.models.node, { as: 'node', foreignKey: 'name' });
        sequelize.models.twitch.hasMany(sequelize.models.stateStorage, { as: 'storage', foreignKey: 'channelName' });
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "channelName", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "state", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "accessToken", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "refreshToken", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "scope", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "tokenType", void 0);
TwitchItem = __decorate([
    Table({ tableName: "twitch", modelName: "twitch" }),
    __metadata("design:paramtypes", [])
], TwitchItem);
export { TwitchItem };
//# sourceMappingURL=twitchItem.js.map