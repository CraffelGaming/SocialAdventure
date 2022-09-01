"use strict";
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
const sequelize_1 = require("sequelize");
const json = require("./translationItem.json");
class TranslationItem {
    constructor(page, handle, language, translation) {
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
}
exports.TranslationItem = TranslationItem;
module.exports.default = TranslationItem;
//# sourceMappingURL=translationItem.js.map