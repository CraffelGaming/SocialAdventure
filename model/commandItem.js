var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Model, PrimaryKey, Column, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'commandItem.json')).toString());
let CommandItem = class CommandItem extends Model {
    constructor() {
        super();
        this.isMaster = false;
        this.isModerator = false;
        this.isCounter = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('command', {
            module: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            command: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isMaster: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isModerator: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.command.count({ where: { module: item.module, command: item.command } }) === 0) {
                    await sequelize.models.command.create(item);
                }
                else
                    await sequelize.models.command.update(item, { where: { module: item.module, command: item.command } });
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
], CommandItem.prototype, "module", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], CommandItem.prototype, "command", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], CommandItem.prototype, "isMaster", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], CommandItem.prototype, "isModerator", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], CommandItem.prototype, "isCounter", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], CommandItem.prototype, "translation", void 0);
CommandItem = __decorate([
    Table({ tableName: "command", modelName: "command" }),
    __metadata("design:paramtypes", [])
], CommandItem);
export { CommandItem };
//# sourceMappingURL=commandItem.js.map