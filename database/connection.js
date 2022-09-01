"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const versionItem_1 = require("../model/versionItem");
const nodeItem_1 = require("../model/nodeItem");
const migrationItem_1 = require("../model/migrationItem");
const menuItem_1 = require("../model/menuItem");
const translationItem_1 = require("../model/translationItem");
const twitchItem_1 = require("../model/twitchItem");
const twitchUserItem_1 = require("../model/twitchUserItem");
const levelItem_1 = require("../model/levelItem");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const jsonMigration = require("../model/migrationItem.json");
const jsonMigrationGlobal = require("../model/migrationGlobalItem.json");
const sayItem_1 = require("../model/sayItem");
const heroItem_1 = require("../model/heroItem");
const heroTraitItem_1 = require("../model/heroTraitItem");
const heroInventoryItem_1 = require("../model/heroInventoryItem");
const heroWalletItem_1 = require("../model/heroWalletItem");
const itemItem_1 = require("../model/itemItem");
const commandItem_1 = require("../model/commandItem");
const itemCategoryItem_1 = require("../model/itemCategoryItem");
class Connection {
    constructor({ databaseName }) {
        this.databaseName = databaseName;
        this.databasePath = path.join(__dirname, this.databaseName + '.sqlite');
        this.isNewDatabase = !fs.existsSync(this.databasePath);
        this.sequelize = new sequelize_typescript_1.Sequelize({ dialect: 'sqlite', storage: this.databasePath });
    }
    initializeGlobal() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sequelize.authenticate();
                migrationItem_1.MigrationItem.createTable({ sequelize: this.sequelize });
                versionItem_1.VersionItem.createTable({ sequelize: this.sequelize });
                nodeItem_1.NodeItem.createTable({ sequelize: this.sequelize });
                menuItem_1.MenuItem.createTable({ sequelize: this.sequelize });
                translationItem_1.TranslationItem.createTable({ sequelize: this.sequelize });
                twitchItem_1.TwitchItem.createTable({ sequelize: this.sequelize });
                twitchUserItem_1.TwitchUserItem.createTable({ sequelize: this.sequelize });
                itemCategoryItem_1.ItemCategoryItem.createTable({ sequelize: this.sequelize });
                itemItem_1.ItemItem.createTable({ sequelize: this.sequelize });
                menuItem_1.MenuItem.setAssociation({ sequelize: this.sequelize });
                yield this.sequelize.sync();
                yield migrationItem_1.MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigrationGlobal)) });
                yield versionItem_1.VersionItem.updateTable({ sequelize: this.sequelize });
                yield nodeItem_1.NodeItem.updateTable({ sequelize: this.sequelize });
                yield menuItem_1.MenuItem.updateTable({ sequelize: this.sequelize });
                yield translationItem_1.TranslationItem.updateTable({ sequelize: this.sequelize });
                yield itemCategoryItem_1.ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: true });
                yield itemItem_1.ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: true });
                itemCategoryItem_1.ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
                itemItem_1.ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: true });
                yield this.updater("migrations/global");
                return true;
            }
            catch (ex) {
                return false;
            }
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.sequelize.authenticate();
                migrationItem_1.MigrationItem.createTable({ sequelize: this.sequelize });
                versionItem_1.VersionItem.createTable({ sequelize: this.sequelize });
                levelItem_1.LevelItem.createTable({ sequelize: this.sequelize });
                sayItem_1.SayItem.createTable({ sequelize: this.sequelize });
                heroItem_1.HeroItem.createTable({ sequelize: this.sequelize });
                heroTraitItem_1.HeroTraitItem.createTable({ sequelize: this.sequelize });
                heroWalletItem_1.HeroWalletItem.createTable({ sequelize: this.sequelize });
                heroInventoryItem_1.HeroInventoryItem.createTable({ sequelize: this.sequelize });
                itemCategoryItem_1.ItemCategoryItem.createTable({ sequelize: this.sequelize });
                itemItem_1.ItemItem.createTable({ sequelize: this.sequelize });
                commandItem_1.CommandItem.createTable({ sequelize: this.sequelize });
                yield this.sequelize.sync();
                yield migrationItem_1.MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigration)) });
                yield versionItem_1.VersionItem.updateTable({ sequelize: this.sequelize });
                yield levelItem_1.LevelItem.updateTable({ sequelize: this.sequelize });
                yield sayItem_1.SayItem.updateTable({ sequelize: this.sequelize });
                yield heroItem_1.HeroItem.updateTable({ sequelize: this.sequelize });
                yield heroTraitItem_1.HeroTraitItem.updateTable({ sequelize: this.sequelize });
                yield heroWalletItem_1.HeroWalletItem.updateTable({ sequelize: this.sequelize });
                yield heroInventoryItem_1.HeroInventoryItem.updateTable({ sequelize: this.sequelize });
                yield itemCategoryItem_1.ItemCategoryItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
                yield itemItem_1.ItemItem.updateTable({ sequelize: this.sequelize, isGlobal: false });
                yield commandItem_1.CommandItem.updateTable({ sequelize: this.sequelize });
                heroItem_1.HeroItem.setAssociation({ sequelize: this.sequelize });
                heroTraitItem_1.HeroTraitItem.setAssociation({ sequelize: this.sequelize });
                heroWalletItem_1.HeroWalletItem.setAssociation({ sequelize: this.sequelize });
                heroInventoryItem_1.HeroInventoryItem.setAssociation({ sequelize: this.sequelize });
                itemCategoryItem_1.ItemCategoryItem.setAssociation({ sequelize: this.sequelize });
                itemItem_1.ItemItem.setAssociation({ sequelize: this.sequelize, isGlobal: false });
                yield this.updater("migrations/general");
                return true;
            }
            catch (ex) {
                return false;
            }
        });
    }
    updater(folder) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of Object.values(yield this.sequelize.models.migration.findAll())) {
                    global.worker.log.trace('add Migration ' + item.name);
                    if (!this.isNewDatabase && !item.isInstalled) {
                        const fileName = path.join(__dirname, folder, item.name + '.js');
                        const file = require(fileName);
                        yield file.up(this.sequelize.getQueryInterface(), this.sequelize);
                    }
                    item.isInstalled = true;
                    yield this.sequelize.models.migration.update({ isInstalled: item.isInstalled }, { where: { name: item.name } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map