import { Sequelize } from 'sequelize-typescript'
import * as fs from 'fs';
import * as path from 'path';
import { SayItem } from '../model/sayItem.js';
import { HeroItem } from '../model/heroItem.js';
import { HeroTraitItem } from '../model/heroTraitItem.js';
import { HeroInventoryItem } from '../model/heroInventoryItem.js';
import { HeroWalletItem } from '../model/heroWalletItem.js';
import { ItemItem } from '../model/itemItem.js';
import { CommandItem } from '../model/commandItem.js';
import { ItemCategoryItem } from '../model/itemCategoryItem.js';
import { LocationItem } from '../model/locationItem.js';
import { EnemyItem } from '../model/enemyItem.js';
import { AdventureItem } from '../model/adventureItem.js';
import { LootItem } from '../model/lootItem.js';
import { HealingPotionItem } from '../model/healingPotionItem.js';
import { TrainerItem } from '../model/trainerItem.js';
import { DailyItem } from '../model/dailyItem.js';
import { PromotionItem } from '../model/promotionItem.js';
import { HeroPromotionItem } from '../model/heroPromotionItem.js';
import { HelpItem } from '../model/helpItem.js';
import { VersionItem } from '../model/versionItem.js';
import { NodeItem } from '../model/nodeItem.js';
import { MigrationItem } from '../model/migrationItem.js';
import { MenuItem } from '../model/menuItem.js';
import { TranslationItem } from '../model/translationItem.js';
import { TwitchItem } from '../model/twitchItem.js';
import { TwitchUserItem } from '../model/twitchUserItem.js';
import { LevelItem } from '../model/levelItem.js';
import { PlaceholderItem } from '../model/placeholderItem.js';
import { ValidationItem } from '../model/validationItem.js';
import { StateStorageItem } from '../model/stateStorageItem.js';
import { Model } from 'sequelize';
import { fileURLToPath } from 'url';
import { RaidBossItem } from '../model/raidBossItem.js';
import { RaidHeroItem } from '../model/raidHeroItem.js';
import { RaidItem } from '../model/raidItem.js';
import { HistoryDuellItem } from '../model/historyDuellItem.js';
import { HistoryStealItem } from '../model/historyStealItem.js';
import { HistoryAdventureItem } from '../model/historyAdventureItem.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const jsonMigration = JSON.parse(fs.readFileSync(path.join(dirname, '../model/migrationItem.json')).toString());
const jsonMigrationGlobal = JSON.parse(fs.readFileSync(path.join(dirname, '../model/migrationGlobalItem.json')).toString());
const settings = JSON.parse(fs.readFileSync(path.join(dirname, '../settings.json')).toString());
export class Connection {
    databaseName: string;
    databasePath: string;
    isNewDatabase: boolean;
    sequelize: Sequelize;

    constructor({ databaseName }: { databaseName: string; }) {
        this.databaseName = databaseName;
        this.databasePath = path.join(dirname, this.databaseName + '.sqlite');
        this.isNewDatabase = !fs.existsSync(this.databasePath);
        this.sequelize = new Sequelize({ dialect: 'sqlite', storage: this.databasePath, logging: settings.logDatabase });
    }

    async initializeGlobal() {
        try {
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
        } catch (ex) {
            return false;
        }
    }

    async initialize() {
        try {
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
            RaidBossItem.createTable({ sequelize: this.sequelize });
            RaidHeroItem.createTable({ sequelize: this.sequelize });
            RaidItem.createTable({ sequelize: this.sequelize });
            HistoryDuellItem.createTable({ sequelize: this.sequelize });
            HistoryStealItem.createTable({ sequelize: this.sequelize });
            HistoryAdventureItem.createTable({ sequelize: this.sequelize });

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
            await RaidBossItem.updateTable({ sequelize: this.sequelize });

            HeroItem.setAssociation({ sequelize: this.sequelize });
            HeroTraitItem.setAssociation({ sequelize: this.sequelize });
            HeroWalletItem.setAssociation({ sequelize: this.sequelize });
            HeroInventoryItem.setAssociation({ sequelize: this.sequelize });
            ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
            ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: false });
            LocationItem.setAssociation({ sequelize: this.sequelize });
            AdventureItem.setAssociation({ sequelize: this.sequelize });
            PromotionItem.setAssociation({ sequelize: this.sequelize });
            HeroPromotionItem.setAssociation({ sequelize: this.sequelize });
            RaidBossItem.setAssociation({ sequelize: this.sequelize });
            RaidHeroItem.setAssociation({ sequelize: this.sequelize });
            RaidItem.setAssociation({ sequelize: this.sequelize });

            return true;
        } catch (ex) {
            return false;
        }
    }

    async updater(folder: string) {
        try {
            const migrations = await this.sequelize.models.migration.findAll() as Model<MigrationItem>[];
            for (const item of migrations) {
                global.worker.log.trace('add Migration ' + item.getDataValue('name'));

                if (!this.isNewDatabase && !item.getDataValue('isInstalled')) {
                    const sql = path.join(dirname, folder, item.getDataValue('name') + '.js');
                    const file = await import(`file:///${sql}`);
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