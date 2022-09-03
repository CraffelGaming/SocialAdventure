import { Column, Table, PrimaryKey, Sequelize, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
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
            const version = require('./../package.json').version;

            if(await sequelize.models.version.count({ where: { version } }) === 0){
                await sequelize.models.version.create({version});
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = VersionItem;