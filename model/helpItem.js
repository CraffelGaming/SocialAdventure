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
let HelpItem = class HelpItem {
    static createTable({ sequelize }) {
        sequelize.define('help', {
            handle: {
                type: DataTypes.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true
            },
            node: {
                type: DataTypes.STRING,
                allowNull: false
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            mail: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
        }, { freezeTableName: true });
    }
    static async put({ sequelize, element }) {
        try {
            if (element.handle != null && element.handle > 0) {
                const item = await sequelize.models.help.findByPk(element.handle);
                if (item) {
                    await sequelize.models.help.update(element, { where: { handle: element.handle } });
                    return 201;
                }
            }
            else {
                if (element.node != null && element.node.length > 0 && element.name != null && element.name.length > 0 && element.mail != null && element.mail.length > 0 && element.content != null && element.content.length > 0) {
                    await sequelize.models.help.create(element);
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
    }
};
__decorate([
    PrimaryKey,
    Column,
    __metadata("design:type", Number)
], HelpItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HelpItem.prototype, "node", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HelpItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HelpItem.prototype, "mail", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], HelpItem.prototype, "content", void 0);
HelpItem = __decorate([
    Table({ tableName: "help", modelName: "help" })
], HelpItem);
export { HelpItem };
//# sourceMappingURL=helpItem.js.map