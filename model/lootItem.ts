import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'lootItem.json')).toString());
@Table({ tableName: "loot", modelName: "loot"})
export class LootItem extends Model<LootItem>{
    @PrimaryKey
    @Column
    command: string;
    @Column
    minutes: number= 60;
    @Column
    isActive : boolean = true;
    @Column
    isLiveAutoControl : boolean = true;
    @Column
    countUses: number = 0;
    @Column
    countRuns: number = 0;
    @Column
    lastRun: Date = new Date(2020, 1, 1);

    constructor(){
        super();
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('loot', {
            command: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            minutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            lastRun: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: new Date(2020, 1, 1)
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
            const items = JSON.parse(JSON.stringify(json)) as LootItem[];

            for(const item of items){
                if(await sequelize.models.loot.count({where: {command: item.command}}) === 0){
                    await sequelize.models.loot.create(item as any);
                } // else await sequelize.models.loot.update(item, {where: {command: item.command}});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}