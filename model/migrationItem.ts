import { Column, Table, Model, Sequelize, PrimaryKey, DataType, AutoIncrement } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import jsonMigration = require('./migrationItem.json');
import jsonMigrationGlobal = require('./migrationGlobalItem.json');

export class MigrationItem{
    name: string;
    isInstalled: boolean;

    constructor(name? : string, isInstalled? : boolean){
        this.name = name;
        this.isInstalled = isInstalled;
    }

    static initialize(sequelize){
        sequelize.define('migration', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            isInstalled: {
               type: DataTypes.BOOLEAN,
               allowNull: false,
               defaultValue: false
           }
          }, {freezeTableName: true});
    }

    static async updateTable({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(jsonMigration)) as MigrationItem[];

            for(const item of items){
                if(await sequelize.models.migration.count({where: {name: item.name}}) === 0){
                    await sequelize.models.migration.create(item as any);
                }
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }

    static async updateTableGlobal({ sequelize }: { sequelize: Sequelize; }): Promise<void>{
        try{
            const items = JSON.parse(JSON.stringify(jsonMigrationGlobal)) as MigrationItem[];

            for(const item of items){
                if(await sequelize.models.migration.count({where: {name: item.name}}) === 0){
                    await sequelize.models.migration.create(item as any);
                }
            }
        } catch(ex){
            global.worker.log.error(ex);
        }
    }
}

module.exports.default = MigrationItem;