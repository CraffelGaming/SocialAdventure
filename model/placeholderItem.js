var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Table, PrimaryKey } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'placeholderItem.json')).toString());
let PlaceholderItem = class PlaceholderItem {
    constructor() {
        this.isCounter = false;
        this.isShoutout = false;
    }
    static createTable({ sequelize }) {
        sequelize.define('placeholder', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            translation: {
                type: DataTypes.STRING,
                allowNull: false
            },
            isCounter: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isShoutout: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
        }, { freezeTableName: true });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.placeholder.count({ where: { handle: item.handle } }) === 0) {
                    await sequelize.models.placeholder.create(item);
                }
                else
                    await sequelize.models.placeholder.update(item, { where: { handle: item.handle } });
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
], PlaceholderItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], PlaceholderItem.prototype, "translation", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], PlaceholderItem.prototype, "isCounter", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], PlaceholderItem.prototype, "isShoutout", void 0);
PlaceholderItem = __decorate([
    Table({ tableName: "placeholder", modelName: "placeholder" })
], PlaceholderItem);
export { PlaceholderItem };
//# sourceMappingURL=placeholderItem.js.map