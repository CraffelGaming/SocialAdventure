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
exports.HelpItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let HelpItem = class HelpItem {
    static createTable({ sequelize }) {
        sequelize.define('help', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            node: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            mail: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: sequelize_1.DataTypes.STRING(1000),
                allowNull: false
            },
        }, { freezeTableName: true });
    }
    static put({ sequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (element.handle != null && element.handle > 0) {
                    const item = yield sequelize.models.help.findByPk(element.handle);
                    if (item) {
                        yield sequelize.models.help.update(element, { where: { handle: element.handle } });
                        return 201;
                    }
                }
                else {
                    if (element.node != null && element.node.length > 0 && element.name != null && element.name.length > 0 && element.mail != null && element.mail.length > 0 && element.content != null && element.content.length > 0) {
                        yield sequelize.models.help.create(element);
                        return 201;
                    }
                    else
                        return 406;
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
                return 500;
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], HelpItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpItem.prototype, "node", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpItem.prototype, "mail", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], HelpItem.prototype, "content", void 0);
HelpItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "help", modelName: "help" })
], HelpItem);
exports.HelpItem = HelpItem;
module.exports.default = HelpItem;
//# sourceMappingURL=helpItem.js.map