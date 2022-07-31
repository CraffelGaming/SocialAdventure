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
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const migrationItem_1 = require("../model/migrationItem");
const jsonMigration = require("../model/migrationItem.json");
const jsonMigrationGlobal = require("../model/migrationGlobalItem.json");
const menuItem_1 = require("../model/menuItem");
const translationItem_1 = require("../model/translationItem");
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
                migrationItem_1.MigrationItem.initialize(this.sequelize);
                versionItem_1.VersionItem.initialize(this.sequelize);
                nodeItem_1.NodeItem.initialize(this.sequelize);
                menuItem_1.MenuItem.initialize(this.sequelize);
                translationItem_1.TranslationItem.initialize(this.sequelize);
                yield this.sequelize.sync();
                yield migrationItem_1.MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigrationGlobal)) });
                yield versionItem_1.VersionItem.updateTable({ sequelize: this.sequelize });
                yield nodeItem_1.NodeItem.updateTable({ sequelize: this.sequelize });
                yield menuItem_1.MenuItem.updateTable({ sequelize: this.sequelize });
                yield translationItem_1.TranslationItem.updateTable({ sequelize: this.sequelize });
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
                migrationItem_1.MigrationItem.initialize(this.sequelize);
                versionItem_1.VersionItem.initialize(this.sequelize);
                yield this.sequelize.sync();
                yield migrationItem_1.MigrationItem.updateTable({ sequelize: this.sequelize, migrations: JSON.parse(JSON.stringify(jsonMigration)) });
                yield versionItem_1.VersionItem.updateTable({ sequelize: this.sequelize });
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