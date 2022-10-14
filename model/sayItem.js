"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
exports.SayItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./sayItem.json");
let SayItem = class SayItem extends sequelize_typescript_1.Model {
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
                type: sequelize_1.DataTypes.STRING(50),
                allowNull: false,
                primaryKey: true
            },
            text: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            minutes: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 60
            },
            help: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            isCounter: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isLiveAutoControl: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            },
            isShoutout: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            lastRun: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                defaultValue: Date.UTC(2020, 1, 1)
            },
            delay: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 5
            },
            countUses: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            countRuns: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            },
            timeout: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 10
            },
            count: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 0
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.say.count({ where: { command: item.command } })) === 0) {
                        yield sequelize.models.say.create(item);
                    } // else await sequelize.models.say.update(item, {where: {command: item.command}});
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SayItem.prototype, "command", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "minutes", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SayItem.prototype, "help", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], SayItem.prototype, "text", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isLiveAutoControl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Date)
], SayItem.prototype, "lastRun", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "delay", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "countUses", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "countRuns", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isCounter", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], SayItem.prototype, "isShoutout", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "timeout", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], SayItem.prototype, "count", void 0);
SayItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "say", modelName: "say" }),
    __metadata("design:paramtypes", [])
], SayItem);
exports.SayItem = SayItem;
module.exports.default = SayItem;
//# sourceMappingURL=sayItem.js.map