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
exports.CommandItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./commandItem.json");
let CommandItem = class CommandItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
        this.isMaster = false;
        this.isCounter = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('command', {
            module: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            command: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            isCounter: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isMaster: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            translation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.command.count({ where: { module: item.module, command: item.command } })) === 0) {
                        yield sequelize.models.command.create(item);
                    }
                    else
                        yield sequelize.models.command.update(item, { where: { module: item.module, command: item.command } });
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
], CommandItem.prototype, "module", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CommandItem.prototype, "command", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], CommandItem.prototype, "isMaster", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], CommandItem.prototype, "isCounter", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], CommandItem.prototype, "translation", void 0);
CommandItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "command", modelName: "command" }),
    __metadata("design:paramtypes", [])
], CommandItem);
exports.CommandItem = CommandItem;
module.exports.default = CommandItem;
//# sourceMappingURL=commandItem.js.map