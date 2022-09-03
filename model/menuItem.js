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
exports.MenuItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
const json = require("./menuItem.json");
let MenuItem = class MenuItem extends sequelize_typescript_1.Model {
    constructor(endpoint, name, order) {
        super();
        this.authenticationRequired = false;
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
    }
    static createTable({ sequelize }) {
        sequelize.define('menu', {
            endpoint: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            order: {
                type: sequelize_1.DataTypes.INTEGER,
                allowNull: false
            },
            authenticationRequired: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.menu.hasMany(sequelize.models.menu, { as: 'childs', foreignKey: 'parentEndpoint' });
        sequelize.models.menu.belongsTo(sequelize.models.menu, { as: 'parent', foreignKey: 'parentEndpoint' });
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const items = JSON.parse(JSON.stringify(json));
                for (const item of items) {
                    if ((yield sequelize.models.menu.count({ where: { endpoint: item.endpoint } })) === 0) {
                        yield sequelize.models.menu.create(item);
                    }
                    else
                        yield sequelize.models.menu.update(item, { where: { endpoint: item.endpoint } });
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
], MenuItem.prototype, "endpoint", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], MenuItem.prototype, "order", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Boolean)
], MenuItem.prototype, "authenticationRequired", void 0);
MenuItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "menu", modelName: "menu" }),
    __metadata("design:paramtypes", [String, String, Number])
], MenuItem);
exports.MenuItem = MenuItem;
module.exports.default = MenuItem;
//# sourceMappingURL=menuItem.js.map