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
exports.TwitchUserItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let TwitchUserItem = class TwitchUserItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.viewCount = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('twitchUser', {
            channelName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            broadcasterType: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            profileImageUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            viewCount: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            eMail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "channelName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "displayName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "broadcasterType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "profileImageUrl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], TwitchUserItem.prototype, "viewCount", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TwitchUserItem.prototype, "eMail", void 0);
TwitchUserItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "twitchUser", modelName: "twitchUser" }),
    __metadata("design:paramtypes", [])
], TwitchUserItem);
exports.TwitchUserItem = TwitchUserItem;
module.exports.default = TwitchUserItem;
//# sourceMappingURL=twitchUserItem.js.map