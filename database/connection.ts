import { Sequelize } from 'sequelize-typescript'
import { VersionItem } from '../model/versionItem';

import * as fs from 'fs';
import * as path from 'path';

export class Connection {
    databaseName: string;
    databasePath: string;
    isNewDatabase: boolean;
    sequelize: Sequelize;

    constructor(databaseName: string, modelPath: string, migrationPath: string){
        this.databaseName = databaseName;
        this.databasePath = path.join(__dirname, this.databaseName + '.sqlite') ;
        this.isNewDatabase = !fs.existsSync(this.databasePath);
        this.sequelize = new Sequelize({ dialect: 'sqlite', storage: this.databasePath, models: [modelPath] });
    }

    async initialize(){
        try{
            await this.sequelize.authenticate();

            // VersionItem.initialize(this.sequelize);

            await this.sequelize.sync();
            await VersionItem.updateTable(this.sequelize);
            // await this.updater("migrations");

            return true;
        }  catch (ex){
            return false;
        }
    }

    /*
    async updater(folder){
        try{
            var updates = await this.sequelize.models.version.findAll({where: {isInstalled: false}});

            for (var update of updates) {
                if(!this.isNewDatabase){
                    var fileName = path.join(__dirname, folder, update.handle + '.js') ;
                    var file = require(fileName);
                    await file.up(this.sequelize.getQueryInterface(), this.sequelize);
                }
                update.isInstalled = true;
                await update.save();
            }
        } catch (ex) {
            console.error('UPDATE ERROR:', ex);
        }
    }
    */
}