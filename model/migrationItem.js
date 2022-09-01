"use strict";
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
exports.MigrationItem = void 0;
const sequelize_1 = require("sequelize");
class MigrationItem {
    constructor(name, isInstalled) {
        this.name = name;
        this.isInstalled = isInstalled;
    }
    static createTable({ sequelize }) {
        sequelize.define('migration', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            isInstalled: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize, migrations }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (const item of migrations) {
                    if ((yield sequelize.models.migration.count({ where: { name: item.name } })) === 0) {
                        yield sequelize.models.migration.create(item);
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.MigrationItem = MigrationItem;
module.exports.default = MigrationItem;
//# sourceMappingURL=migrationItem.js.map