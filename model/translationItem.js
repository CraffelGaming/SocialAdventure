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
exports.TranslationItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./translationItem.json");
let TranslationItem = class TranslationItem extends sequelize_typescript_1.Model {
    constructor(page, handle, language, translation) {
        super();
        this.language = "de-DE";
        this.page = page;
        this.handle = handle;
        this.language = language;
        this.translation = translation;
    }
    static createTable({ sequelize }) {
        sequelize.define('translation', {
            page: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            handle: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            language: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
                primaryKey: true
            },
            translation: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
        }, { freezeTableName: true });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.translation.count({ where: { page: item.page, handle: item.handle, language: item.language } })) === 0) {
                        yield sequelize.models.translation.create(item);
                    }
                    else
                        yield sequelize.models.translation.update(item, { where: { page: item.page, handle: item.handle, language: item.language } });
                }
            }
            catch (ex) {
                global.worker.log.error(ex);
            }
        });
    }
    static translate(translation, handle) {
        const value = translation.find(x => x.handle === handle);
        if (value && value.translation)
            return value.translation;
        return '[missing translation]';
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "page", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "language", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "translation", void 0);
TranslationItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "translation", modelName: "translation" }),
    __metadata("design:paramtypes", [String, String, String, String])
], TranslationItem);
exports.TranslationItem = TranslationItem;
module.exports.default = TranslationItem;
//# sourceMappingURL=translationItem.js.map