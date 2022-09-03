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
exports.NodeItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./nodeItem.json");
let NodeItem = class NodeItem extends sequelize_typescript_1.Model {
    constructor(name, displayName, language, isActive) {
        super();
        this.language = "DE-de";
        this.isActive = true;
        this.endpoint = '/';
        this.name = name;
        this.displayName = displayName;
        this.language = language;
        this.isActive = isActive;
    }
    static createTable({ sequelize }) {
        sequelize.define('node', {
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            displayName: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
            },
            isActive: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            endpoint: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: '/'
            },
            type: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            broadcasterType: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            profileImageUrl: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            },
            eMail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: true
            }
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.node.count({ where: { name: item.name } })) === 0) {
                        yield sequelize.models.node.create(item);
                    }
                    else
                        yield sequelize.models.node.update(item, { where: { name: item.name } });
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
], NodeItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "displayName", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "language", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], NodeItem.prototype, "isActive", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "endpoint", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "type", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "broadcasterType", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "description", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "profileImageUrl", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "eMail", void 0);
NodeItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "node", modelName: "node" }),
    __metadata("design:paramtypes", [String, String, String, Boolean])
], NodeItem);
exports.NodeItem = NodeItem;
module.exports.default = NodeItem;
//# sourceMappingURL=nodeItem.js.map