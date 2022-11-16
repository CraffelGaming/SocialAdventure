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
const json = JSON.parse(fs.readFileSync(path.join(dirname, 'menuItem.json')).toString());
let MenuItem = class MenuItem extends Model {
    constructor(endpoint, name, order) {
        super();
        this.authenticationRequired = false;
        this.nodeRequired = false;
        this.isActive = true;
        this.endpoint = endpoint;
        this.name = name;
        this.order = order;
        this.authenticationRequired = false;
        this.nodeRequired = false;
        this.isActive = true;
    }
    static createTable({ sequelize }) {
        sequelize.define('menu', {
            endpoint: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            order: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            authenticationRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            nodeRequired: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.menu.hasMany(sequelize.models.menu, { as: 'childs', foreignKey: 'parentEndpoint' });
        sequelize.models.menu.belongsTo(sequelize.models.menu, { as: 'parent', foreignKey: 'parentEndpoint' });
    }
    static async updateTable({ sequelize }) {
        try {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if (await sequelize.models.menu.count({ where: { endpoint: item.endpoint } }) === 0) {
                    await sequelize.models.menu.create(item);
                }
                else
                    await sequelize.models.menu.update(item, { where: { endpoint: item.endpoint } });
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
], MenuItem.prototype, "endpoint", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], MenuItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", Number)
], MenuItem.prototype, "order", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], MenuItem.prototype, "authenticationRequired", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], MenuItem.prototype, "nodeRequired", void 0);
__decorate([
    Column,
    __metadata("design:type", Boolean)
], MenuItem.prototype, "isActive", void 0);
MenuItem = __decorate([
    Table({ tableName: "menu", modelName: "menu" }),
    __metadata("design:paramtypes", [String, String, Number])
], MenuItem);
export { MenuItem };
//# sourceMappingURL=menuItem.js.map