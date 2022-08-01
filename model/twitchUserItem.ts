import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');

export class TwitchUserItem{
    channelName: string;
    displayName: string;
    type: string;
    broadcasterType: string;
    description : string;
    profileImageUrl: string;
    viewCount : number;
    eMail: string;


    constructor(){
        this.channelName = "";
        this.displayName = "";
        this.type = "";
        this.broadcasterType = "";
        this.description = "";
        this.profileImageUrl = "";
        this.viewCount = 0;
        this.eMail = "";
    }

    static initialize(sequelize){
        sequelize.define('twitchUser', {
            channelName: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: DataTypes.STRING,
                allowNull: true
            },
            type: {
                type: DataTypes.STRING,
                allowNull: true
            },
            broadcasterType: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
               type: DataTypes.STRING,
               allowNull: true
            },
            profileImageUrl: {
              type: DataTypes.STRING,
              allowNull: true
            },
            viewCount: {
             type: DataTypes.INTEGER,
             allowNull: false,
             defaultValue: 0
            },
            eMail: {
             type: DataTypes.STRING,
             allowNull: true
            }
          }, {freezeTableName: true});
    }
}

module.exports.default = TwitchUserItem;