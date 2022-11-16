var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, PrimaryKey, Model } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const project = JSON.parse(fs.readFileSync(path.join(dirname, './../package.json')).toString());
let VersionItem = class VersionItem extends Model {
    constructor(version) {
        super();
        this.version = version;
    }
    static createTable({ sequelize }) {
        sequelize.define('version', {
            version: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            if (await sequelize.models.version.count({ where: { version: project.version } }) === 0) {
                await sequelize.models.version.create({ version: project.version });
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], VersionItem.prototype, "version", void 0);
VersionItem = __decorate([
    Table({ tableName: "version", modelName: "version" }),
    __metadata("design:paramtypes", [String])
], VersionItem);
export { VersionItem };
//# sourceMappingURL=versionItem.js.map