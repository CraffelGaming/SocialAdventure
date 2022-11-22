import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'sayItem.json')).toString());
@Table({ tableName: "say", modelName: "say"})
export class SayItem extends Model<SayItem>{
    @PrimaryKey
    @Column
    command: string;
    @Column
    minutes: number= 60;
    @Column
    help: string;
    @Column
    text: string;
    @Column
    isActive : boolean = true;
    @Column
    isLiveAutoControl : boolean = true;
    @Column
    lastRun: Date = new Date(2020, 1, 1);
    @Column
    delay: number = 5;
    @Column
    countUses: number = 0;
    @Column
    countRuns: number = 0;
    @Column
    isCounter : boolean = false;
    @Column
    isShoutout : boolean = false;
    @Column
    timeout: number = 10;
    @Column
    count: number = 0;
    @Column
    shortcuts: string;

    constructor(){
        super();
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
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isLiveAutoControl: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isShoutout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            lastRun: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
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
            },
            timeout: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            shortcuts: {
                type: DataTypes.STRING,
                allowNull: true
            }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(json)) as SayItem[];

            for(const item of items){
                if(await sequelize.models.say.count({where: {command: item.command}}) === 0){
                    await sequelize.models.say.create(item as any);
                } // else await sequelize.models.say.update(item, {where: {command: item.command}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}