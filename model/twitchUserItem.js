"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwitchUserItem = void 0;
const sequelize_1 = require("sequelize");
class TwitchUserItem {
    constructor() {
        this.channelName = "";
        this.displayName = "";
        this.type = "";
        this.broadcasterType = "";
        this.description = "";
        this.profileImageUrl = "";
        this.viewCount = 0;
        this.eMail = "";
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
}
exports.TwitchUserItem = TwitchUserItem;
module.exports.default = TwitchUserItem;
//# sourceMappingURL=twitchUserItem.js.map