var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, Model, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
let MigrationItem = class MigrationItem extends Model {
    constructor(name, isInstalled) {
        super();
        this.isInstalled = false;
        this.name = name;
        this.isInstalled = isInstalled;
    }
    static createTable({ sequelize }) {
        sequelize.define('migration', {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            isInstalled: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize, migrations }) {
        try {
            for (const item of migrations) {
                if (await sequelize.models.migration.count({ where: { name: item.name } }) === 0) {
                    await sequelize.models.migration.create(item);
                }
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
], MigrationItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], MigrationItem.prototype, "isInstalled", void 0);
MigrationItem = __decorate([
    Table({ tableName: "migration", modelName: "migration" }),
    __metadata("design:paramtypes", [String, Boolean])
], MigrationItem);
export { MigrationItem };
//# sourceMappingURL=migrationItem.js.map