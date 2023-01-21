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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'translationItem.json')).toString());
let TranslationItem = class TranslationItem extends Model {
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
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            language: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "de-DE",
                primaryKey: true
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            },
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.translation.count({ where: { page: item.page, handle: item.handle, language: item.language } }) === 0) {
                    await sequelize.models.translation.create(item);
                }
                else
                    await sequelize.models.translation.update(item, { where: { page: item.page, handle: item.handle, language: item.language } });
            }
        }
        catch (ex) {
            global.worker.log.error(ex);
        }
    }
    static translate(translation, handle) {
        const value = translation.find(x => x.getDataValue('handle') === handle);
        if (value && value.getDataValue('translation'))
            return value.getDataValue('translation');
        return '';
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "page", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "handle", void 0);
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "language", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], TranslationItem.prototype, "translation", void 0);
TranslationItem = __decorate([
    Table({ tableName: "translation", modelName: "translation" }),
    __metadata("design:paramtypes", [String, String, String, String])
], TranslationItem);
export { TranslationItem };
//# sourceMappingURL=translationItem.js.map