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
let StateStorageItem = class StateStorageItem {
    constructor(handle, name, channelName) {
        this.handle = handle;
        this.name = name;
        this.channelName = channelName;
    }
    static createTable({ sequelize }) {
        sequelize.define('stateStorage', {
            handle: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            storage: {
                type: DataTypes.STRING(8000),
                allowNull: true
            },
            channelName: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.stateStorage.belongsTo(sequelize.models.twitch, { as: 'twitch', foreignKey: 'channelName' });
    }
    static async put({ sequelize, element }) {
        try {
            const item = await sequelize.models.stateStorage.findOne({ where: { handle: element.handle, channelName: element.channelName } });
            if (item) {
                await sequelize.models.stateStorage.update(element, ({ where: { handle: element.handle, channelName: element.channelName } }));
                return 201;
            }
            else {
                await sequelize.models.stateStorage.create(element);
                return 201;
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
    __metadata("design:type", String)
], StateStorageItem.prototype, "handle", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "name", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "storage", void 0);
__decorate([
    Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "channelName", void 0);
StateStorageItem = __decorate([
    Table({ tableName: "stateStorage", modelName: "stateStorage" }),
    __metadata("design:paramtypes", [String, String, String])
], StateStorageItem);
export { StateStorageItem };
//# sourceMappingURL=stateStorageItem.js.map