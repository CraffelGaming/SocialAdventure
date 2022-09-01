import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import json = require('./sayItem.json');

export class SayItem{
    command: string;
    minutes: number;
    help: string;
    text: string;
    isActive : boolean;
    lastRun: Date;
    delay: number;
    countUses: number;
    countRuns: number;

    constructor(){
        this.command = "";
        this.minutes = 60;
        this.help = "";
        this.text = "";
        this.isActive = true;
        this.delay = 5;
        this.countUses = 0;
        this.countRuns = 0;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('say', {
            command: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
            minutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 60
            },
            help: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: true
            },
            lastRun: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(2020, 1, 1)
            },
            delay: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            countUses: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            countRuns: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as SayItem[];

            for(const item of items){
                if(await sequelize.models.say.count({where: {command: item.command}}) === 0){
                    await sequelize.models.say.create(item as any);
                } else await sequelize.models.say.update(item, {where: {command: item.command}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = SayItem;