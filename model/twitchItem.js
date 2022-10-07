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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let TwitchItem = class TwitchItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
        sequelize.define('twitch', {
            channelName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                primaryKey: true
            },
            state: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            accessToken: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            refreshToken: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            scope: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            tokenType: {
                type: sequelize_1.DataTypes.STRING,
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
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "channelName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "state", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "accessToken", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "refreshToken", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "scope", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchItem.prototype, "tokenType", void 0);
TwitchItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "twitch", modelName: "twitch" }),
    __metadata("design:paramtypes", [])
], TwitchItem);
exports.TwitchItem = TwitchItem;
module.exports.default = TwitchItem;
//# sourceMappingURL=twitchItem.js.map