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
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'sayItem.json')).toString());
let SayItem = class SayItem extends Model {
    constructor() {
        super();
        this.minutes = 60;
        this.isActive = true;
        this.isLiveAutoControl = true;
        this.lastRun = new Date(2020, 1, 1);
        this.delay = 5;
        this.countUses = 0;
        this.countRuns = 0;
        this.isCounter = false;
        this.isShoutout = false;
        this.timeout = 10;
        this.count = 0;
    }
    static createTable({ sequelize }) {
        sequelize.define('say', {
            command: {
                type: DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            text: {
                type: DataTypes.STRING,
                allowNull: false
            },
            minutes: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 60
            },
            help: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isLiveAutoControl: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isShoutout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            lastRun: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            delay: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            countUses: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            countRuns: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            timeout: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            count: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            shortcuts: {
                type: DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.say.count({ where: { command: item.command } }) === 0) {
                    await sequelize.models.say.create(item);
                } // else await sequelize.models.say.update(item, {where: {command: item.command}});
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
], SayItem.prototype, "command", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "minutes", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], SayItem.prototype, "help", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], SayItem.prototype, "text", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isActive", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isLiveAutoControl", void 0);
__decorate([
    Column,
    __metadata("design:type", Date)
], SayItem.prototype, "lastRun", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "delay", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "countUses", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "countRuns", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isCounter", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isShoutout", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "timeout", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], SayItem.prototype, "count", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], SayItem.prototype, "shortcuts", void 0);
SayItem = __decorate([
    Table({ tableName: "say", modelName: "say" }),
    __metadata("design:paramtypes", [])
], SayItem);
export { SayItem };
//# sourceMappingURL=sayItem.js.map