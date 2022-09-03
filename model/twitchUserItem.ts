import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');
@Table({ tableName: "twitchUser", modelName: "twitchUser"})
export class TwitchUserItem extends Model<TwitchUserItem>{
    @PrimaryKey
    @Column
    channelName: string;
    @Column
    displayName: string;
    @Column
    type: string;
    @Column
    broadcasterType: string;
    @Column
    description : string;
    @Column
    profileImageUrl: string;
    @Column
    viewCount : number = 0;
    @Column
    eMail: string;


    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
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