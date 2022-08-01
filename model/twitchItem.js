"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchItem = void 0;
const sequelize_1 = require("sequelize");
class TwitchItem {
    constructor() {
        this.state = "";
        this.channelName = "";
        this.accessToken = "";
        this.refreshToken = "";
        this.scope = "";
        this.tokenType = "";
    }
    static initialize(sequelize) {
        sequelize.define('twitch', {
            state: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            channelName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true,
                primaryKey: true
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
}
exports.TwitchItem = TwitchItem;
module.exports.default = TwitchItem;
//# sourceMappingURL=twitchItem.js.map