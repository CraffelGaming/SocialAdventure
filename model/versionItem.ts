import { Column, Table, PrimaryKey, Sequelize, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const project = JSON.parse(fs.readFileSync(path.join(dirname, './../package.json')).toString());

@Table({ tableName: "version", modelName: "version"})
export class VersionItem extends Model<VersionItem>{
    @PrimaryKey
    @Column
    version: string;

    constructor(version : string){
        super();
        this.version = version;
    }

    static createTable({ sequelize }: { sequelize: Sequelize; }){
        sequelize.define('version', {
            version: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
             }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            if(await sequelize.models.version.count({ where: {version: project.version } }) === 0){
                await sequelize.models.version.create({version: project.version});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}