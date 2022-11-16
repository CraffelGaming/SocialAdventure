
import { Column, Table, Model, Sequelize, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'levelItem.json')).toString());
@Table({ tableName: "level", modelName: "level"})
export class LevelItem extends Model<LevelItem>{
    @PrimaryKey
    @Column
    handle: number;
    @Column
    experienceMin: number;
    @Column
    experienceMax: number;

    constructor(){
        super();
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