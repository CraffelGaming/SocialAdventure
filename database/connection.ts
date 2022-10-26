import { Sequelize } from 'sequelize-typescript'

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
import { AdventureItem } from '../model/adventureItem';
import { LootItem } from '../model/lootItem';
import { HealingPotionItem } from '../model/healingPotionItem';
import { TrainerItem } from '../model/trainerItem';
import { DailyItem } from '../model/dailyItem';
import { PromotionItem } from '../model/promotionItem';
import { HeroPromotionItem } from '../model/heroPromotionItem';
import { HelpItem } from '../model/helpItem';
import { VersionItem } from '../model/versionItem';
import { NodeItem } from '../model/nodeItem';
import { MigrationItem } from '../model/migrationItem';
import { MenuItem } from '../model/menuItem';
import { TranslationItem } from '../model/translationItem';
import { TwitchItem } from '../model/twitchItem';
import { TwitchUserItem } from '../model/twitchUserItem';
import { LevelItem } from '../model/levelItem';
import { PlaceholderItem } from '../model/placeholderItem';
import { ValidationItem } from '../model/validationItem';
import { StateStorageItem } from '../model/stateStorageItem';
import { Model } from 'sequelize';
export class Connection {
    databaseName: string;
    databasePath: string;
    isNewDatabase: boolean;
    sequelize: Sequelize;

    constructor({ databaseName}: { databaseName: string;}){
        this.databaseName = databaseName;
        this.databasePath = path.join(__dirname, this.databaseName + '.sqlite') ;
        this.isNewDatabase = !fs.existsSync(this.databasePath);
        this.sequelize = new Sequelize({ dialect: 'sqlite', storage: this.databasePath, logging: false });
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
            HelpItem.createTable({ sequelize: this.sequelize });
            PlaceholderItem.createTable({ sequelize: this.sequelize });
            ValidationItem.createTable({ sequelize: this.sequelize });
            StateStorageItem.createTable({ sequelize: this.sequelize });

            MenuItem.setAssociation({ sequelize: this.sequelize });
            NodeItem.setAssociation({ sequelize: this.sequelize });
            TwitchItem.setAssociation({ sequelize: this.sequelize });
            TwitchUserItem.setAssociation({ sequelize: this.sequelize });
            StateStorageItem.setAssociation({ sequelize: this.sequelize });

            await this.sequelize.sync();
            await MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigrationGlobal)) as MigrationItem[] });
            await this.updater("migrations/global");

            await VersionItem.updateTable({ sequelize: this.sequelize });
            await MenuItem.updateTable({ sequelize: this.sequelize });
            await TranslationItem.updateTable({ sequelize: this.sequelize });
            await ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: true });
            await ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: true });
            await PlaceholderItem.updateTable({ sequelize: this.sequelize });
            await ValidationItem.updateTable({ sequelize: this.sequelize });

            ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
            ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: true });

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
            AdventureItem.createTable({ sequelize: this.sequelize });
            LootItem.createTable({ sequelize: this.sequelize });
            HealingPotionItem.createTable({ sequelize: this.sequelize });
            TrainerItem.createTable({ sequelize: this.sequelize });
            DailyItem.createTable({ sequelize: this.sequelize });
            PromotionItem.createTable({ sequelize: this.sequelize });
            HeroPromotionItem.createTable({ sequelize: this.sequelize });

            await this.sequelize.sync();

            await MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigration)) as MigrationItem[] });
            await this.updater("migrations/general");

            await VersionItem.updateTable({ sequelize: this.sequelize });
            await LevelItem.updateTable({ sequelize: this.sequelize });
            await SayItem.updateTable({ sequelize: this.sequelize });
            await ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
            await ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
            await LocationItem.updateTable({ sequelize: this.sequelize });
            await EnemyItem.updateTable({ sequelize: this.sequelize });
            await CommandItem.updateTable({ sequelize: this.sequelize });
            await LootItem.updateTable({ sequelize: this.sequelize });
            await HealingPotionItem.updateTable({ sequelize: this.sequelize });
            await TrainerItem.updateTable({ sequelize: this.sequelize });
            await DailyItem.updateTable({ sequelize: this.sequelize });
            await PromotionItem.updateTable({ sequelize: this.sequelize });

            HeroItem.setAssociation({ sequelize: this.sequelize });
            HeroTraitItem.setAssociation({ sequelize: this.sequelize });
            HeroWalletItem.setAssociation({ sequelize: this.sequelize });
            HeroInventoryItem.setAssociation({ sequelize: this.sequelize });
            ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
            ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: false });
            LocationItem.setAssociation({ sequelize: this.sequelize});
            AdventureItem.setAssociation({ sequelize: this.sequelize});
            PromotionItem.setAssociation({ sequelize: this.sequelize});
            HeroPromotionItem.setAssociation({ sequelize: this.sequelize});

            return true;
        }  catch (ex){
            return false;
        }
    }

    async updater(folder: string){
        try{
            const migrations = await this.sequelize.models.migration.findAll() as Model<MigrationItem>[];
            for(const item of migrations ){
                global.worker.log.trace('add Migration ' + item.getDataValue('name'));

                if(!this.isNewDatabase && !item.getDataValue('isInstalled')){
                    const fileName = path.join(__dirname, folder, item.getDataValue('name') + '.js') ;
                    const file = require(fileName);
                    await file.up(this.sequelize.getQueryInterface(), this.sequelize);
                }
                item.setDataValue('isInstalled', true);
                item.save();
            }
        } catch (ex) {
            global.worker.log.error(`exception ${ex.message}`);
        }
    }
}