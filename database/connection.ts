import { Sequelize } from 'sequelize-typescript'
import { VersionItem } from '../model/versionItem';
import { NodeItem } from '../model/nodeItem';
import { MigrationItem } from '../model/migrationItem';
import { MenuItem } from '../model/menuItem';
import { TranslationItem } from '../model/translationItem';
import { TwitchItem } from '../model/twitchItem';
import { TwitchUserItem } from '../model/twitchUserItem';
import { LevelItem } from '../model/levelItem';

import * as fs from 'fs';
import * as path from 'path';

import jsonMigration = require('../model/migrationItem.json');
import jsonMigrationGlobal = require('../model/migrationGlobalItem.json');
import { SayItem } from '../model/sayItem';
import { HeroItem } from '../model/heroItem';
import { HeroTraitItem } from '../model/heroTraitItem';
import { HeroInventoryItem } from '../model/heroInventoryItem';
import { HeroWalletItem } from '../model/heroWalletItem';
import { ItemItem } from '../model/itemItem';
import { CommandItem } from '../model/commandItem';
import { ItemCategoryItem } from '../model/itemCategoryItem';
import { LocationItem } from '../model/locationItem';
import { EnemyItem } from '../model/enemyItem';

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

            MigrationItem.createTable({ sequelize: this.sequelize });
            VersionItem.createTable({ sequelize: this.sequelize });
            NodeItem.createTable({ sequelize: this.sequelize });
            MenuItem.createTable({ sequelize: this.sequelize });
            TranslationItem.createTable({ sequelize: this.sequelize });
            TwitchItem.createTable({ sequelize: this.sequelize });
            TwitchUserItem.createTable({ sequelize: this.sequelize });
            ItemCategoryItem.createTable({ sequelize: this.sequelize });
            ItemItem.createTable({ sequelize: this.sequelize });

            MenuItem.setAssociation({ sequelize: this.sequelize });

            await this.sequelize.sync();

            await MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigrationGlobal)) as MigrationItem[] });
            await VersionItem.updateTable({ sequelize: this.sequelize });
            await NodeItem.updateTable({ sequelize: this.sequelize });
            await MenuItem.updateTable({ sequelize: this.sequelize });
            await TranslationItem.updateTable({ sequelize: this.sequelize });
            await ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: true });
            await ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: true });

            ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
            ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: true });

            await this.updater("migrations/global");

            return true;
        }  catch (ex){
            return false;
        }
    }

    async initialize(){
        try{
            await this.sequelize.authenticate();

            MigrationItem.createTable({ sequelize: this.sequelize });
            VersionItem.createTable({ sequelize: this.sequelize });
            LevelItem.createTable({ sequelize: this.sequelize });
            SayItem.createTable({ sequelize: this.sequelize });
            HeroItem.createTable({ sequelize: this.sequelize });
            HeroTraitItem.createTable({ sequelize: this.sequelize });
            HeroWalletItem.createTable({ sequelize: this.sequelize });
            HeroInventoryItem.createTable({ sequelize: this.sequelize });
            ItemCategoryItem.createTable({ sequelize: this.sequelize });
            ItemItem.createTable({ sequelize: this.sequelize });
            LocationItem.createTable({ sequelize: this.sequelize });
            EnemyItem.createTable({ sequelize: this.sequelize });
            CommandItem.createTable({ sequelize: this.sequelize });

            await this.sequelize.sync();

            await MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigration)) as MigrationItem[] });
            await VersionItem.updateTable({ sequelize: this.sequelize });
            await LevelItem.updateTable({ sequelize: this.sequelize });
            await SayItem.updateTable({ sequelize: this.sequelize });
            await HeroItem.updateTable({ sequelize: this.sequelize });
            await HeroTraitItem.updateTable({ sequelize: this.sequelize });
            await HeroWalletItem.updateTable({ sequelize: this.sequelize });
            await HeroInventoryItem.updateTable({ sequelize: this.sequelize });
            await ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
            await ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
            await LocationItem.updateTable({ sequelize: this.sequelize });
            await EnemyItem.updateTable({ sequelize: this.sequelize });
            await CommandItem.updateTable({ sequelize: this.sequelize });

            HeroItem.setAssociation({ sequelize: this.sequelize });
            HeroTraitItem.setAssociation({ sequelize: this.sequelize });
            HeroWalletItem.setAssociation({ sequelize: this.sequelize });
            HeroInventoryItem.setAssociation({ sequelize: this.sequelize });
            ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
            ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: false });
            LocationItem.setAssociation({ sequelize: this.sequelize});

            await this.updater("migrations/general");

            return true;
        }  catch (ex){
            return false;
        }
    }

    async updater(folder: string){
        try{

            for(const item of Object.values(await this.sequelize.models.migration.findAll()) as unknown as MigrationItem[]){
                global.worker.log.trace('add Migration ' + item.name);

                if(!this.isNewDatabase && !item.isInstalled){
                    const fileName = path.join(__dirname, folder, item.name + '.js') ;
                    const file = require(fileName);
                    await file.up(this.sequelize.getQueryInterface(), this.sequelize);
                }
                item.isInstalled = true;
                await this.sequelize.models.migration.update({isInstalled: item.isInstalled}, {where: {name: item.name}});
            }
        } catch (ex) {
            global.worker.log.error(ex);
        }
    }
}