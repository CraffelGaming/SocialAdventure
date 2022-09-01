import { Column, Table, Model, Sequelize } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';

export class VersionItem{
    version: string;

    constructor(version : string){
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
            const item = new VersionItem(require('./../package.json').version);
            if(await sequelize.models.version.count({ where: { version: item.version } }) === 0){
                await sequelize.models.version.create(item as any);
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = VersionItem;