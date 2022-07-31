import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./nodeItem.json');

export class NodeItem{
    name: string;
    displayName: string;
    language: string;
    isActive: boolean;
    endpoint : string;
    type: string;
    broadcasterType: string;
    description: string;
    profileImageUrl: string;
    viewCount: number;
    eMail: string;

    constructor(name? : string, displayName? : string, language? : string, isActive? : boolean){
        this.name = name;
        this.displayName = displayName;
        this.language = language;
        this.isActive = isActive;
    }

    static initialize(sequelize){
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
                allowNull: false
            },
            isActive: {
               type: DataTypes.BOOLEAN,
               allowNull: false
            },
            endpoint: {
               type: DataTypes.STRING,
               allowNull: false,
               defaultValue: '/'
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

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as NodeItem[];

            for(const item of items){
                if(await sequelize.models.node.count({where: {name: item.name}}) === 0){
                    await sequelize.models.node.create(item as any);
                } else await sequelize.models.node.update(item, {where: {name: item.name}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = NodeItem;