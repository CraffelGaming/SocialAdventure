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
exports.ItemCategoryItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./itemCategoryItem.json");
let ItemCategoryItem = class ItemCategoryItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
        sequelize.define('itemCategory', {
            handle: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            value: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.itemCategory.hasMany(sequelize.models.item, { as: 'items', foreignKey: 'categoryHandle' });
    }
    static updateTable({ sequelize, isGlobal }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.itemCategory.count({ where: { handle: item.handle } })) === 0) {
                        if (isGlobal === true && item.handle !== 1) {
                            yield sequelize.models.itemCategory.create(item);
                        }
                        else if (isGlobal === false && item.handle === 1) {
                            yield sequelize.models.itemCategory.create(item);
                        }
                    }
                    else
                        yield sequelize.models.itemCategory.update(item, { where: { handle: item.handle } });
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
    __metadata("design:type", Number)
], ItemCategoryItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], ItemCategoryItem.prototype, "value", void 0);
ItemCategoryItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "itemCategory", modelName: "itemCategory" }),
    __metadata("design:paramtypes", [])
], ItemCategoryItem);
exports.ItemCategoryItem = ItemCategoryItem;
module.exports.default = ItemCategoryItem;
//# sourceMappingURL=itemCategoryItem.js.map