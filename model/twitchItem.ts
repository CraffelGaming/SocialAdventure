import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');

export class TwitchItem{
    state: string;
    channelName: string;
    accessToken: string;
    refreshToken: string;
    scope : string;
    tokenType: string;


    constructor(){
        this.state = "";
        this.channelName = "";
        this.accessToken = "";
        this.refreshToken = "";
        this.scope = "";
        this.tokenType = "";
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('twitch', {
            state: {
                type: DataTypes.STRING,
                allowNull: false
            },
            channelName: {
                type: DataTypes.STRING,
                allowNull: true,
                primaryKey: true
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
          }, {freezeTableName: true});
    }
}

module.exports.default = TwitchItem;