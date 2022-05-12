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
exports.VersionItem = void 0;
const sequelize_1 = require("sequelize");
class VersionItem {
    constructor(version) {
        this.version = version;
    }
    static initialize(sequelize) {
        sequelize.define('version', {
            version: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = new VersionItem(require('./../package.json').version);
                if ((yield sequelize.models.version.count({ where: { version: item.version } })) === 0) {
                    yield sequelize.models.version.create(item);
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
}
exports.VersionItem = VersionItem;
module.exports.default = VersionItem;
//# sourceMappingURL=versionItem.js.map