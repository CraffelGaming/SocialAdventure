import { Sequelize } from 'sequelize-typescript'
import { VersionItem } from '../model/versionItem';
import { NodeItem } from '../model/nodeItem';

import * as fs from 'fs';
import * as path from 'path';
import { MigrationItem } from '../model/migrationItem';

export class Connection {
    databaseName: string;
    databasePath: string;
    isNewDatabase: boolean;
    sequelize: Sequelize;

    constructor({ databaseName}: { databaseName: string;}){
        this.databaseName = databaseName;
        this.databasePath = path.join(__dirname, this.databaseName + '.sqlite') ;
        this.isNewDatabase = !fs.existsSync(this.databasePath);
        this.sequelize = new Sequelize({ dialect: 'sqlite', storage: this.databasePath });
    }

    async initializeGlobal(){
        try{
            await this.sequelize.authenticate();

            MigrationItem.initialize(this.sequelize);
            VersionItem.initialize(this.sequelize);
            NodeItem.initialize(this.sequelize);

            await this.sequelize.sync();

            await MigrationItem.updateTableGlobal({ sequelize: this.sequelize });
            await VersionItem.updateTable({ sequelize: this.sequelize });
            await NodeItem.updateTable({ sequelize: this.sequelize });

            await this.updater("migrations/global");

            return true;
        }  catch (ex){
            return false;
        }
    }

    async initialize(){
        try{
            await this.sequelize.authenticate();

            MigrationItem.initialize(this.sequelize);
            VersionItem.initialize(this.sequelize);

            await this.sequelize.sync();

            await MigrationItem.updateTable({ sequelize: this.sequelize });
            await VersionItem.updateTable({ sequelize: this.sequelize });

            await this.updater("migrations/general");

            return true;
        }  catch (ex){
            return false;
        }
    }

    async updater(folder){
        try{

            for(const item of Object.values(await this.sequelize.models.migration.findAll()) as unknown as MigrationItem[]){
                global.worker.log.trace('add Migration ' + item.name);

                if(!this.isNewDatabase){
                    const fileName = path.join(__dirname, folder, item.name + '.js') ;
                    const file = require(fileName);
                    await file.up(this.sequelize.getQueryInterface(), this.sequelize);
                }
                item.isInstalled = true;
                await this.sequelize.models.migration.update(item, {where: {name: item.name}});
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }
}