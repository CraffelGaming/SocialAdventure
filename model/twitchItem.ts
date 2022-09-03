import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');
@Table({ tableName: "twitch", modelName: "twitch"})
export class TwitchItem extends Model<TwitchItem>{
    @PrimaryKey
    @Column
    channelName: string;
    @Column
    state: string;
    @Column
    accessToken: string;
    @Column
    refreshToken: string;
    @Column
    scope : string;
    @Column
    tokenType: string;

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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
          }, {freezeTableName: true});
    }
}

module.exports.default = TwitchItem;