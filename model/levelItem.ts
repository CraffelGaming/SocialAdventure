
import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./levelItem.json');

export class LevelItem{
    handle: number;
    experienceMin: number;
    experienceMax: number;

    constructor(handle? : number, experienceMin? : number, experienceMax? : number){
        this.handle = 0;
        this.experienceMin = 0;
        this.experienceMax = 0;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('level', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true
            },
            experienceMin: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            experienceMax: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as LevelItem[];

            for(const item of items){
                if(await sequelize.models.level.count({where: {handle: item.handle}}) === 0){
                    await sequelize.models.level.create(item as any);
                } else await sequelize.models.level.update(item, {where: {handle: item.handle}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = LevelItem;