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
exports.StateStorageItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const sequelize_1 = require("sequelize");
let StateStorageItem = class StateStorageItem extends sequelize_typescript_1.Model {
    constructor() {
        super();
    }
    static createTable({ sequelize }) {
        sequelize.define('stateStorage', {
            handle: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            name: {
                type: sequelize_1.DataTypes.STRING,
                allowNull: false
            },
            storage: {
                type: sequelize_1.DataTypes.STRING(8000),
                allowNull: false
            },
            channelName: {
                type: sequelize_1.DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            }
        }, { freezeTableName: true });
    }
    static setAssociation({ sequelize }) {
        sequelize.models.stateStorage.belongsTo(sequelize.models.twitch, { as: 'twitch', foreignKey: 'channelName' });
    }
    static put({ sequelize, element }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const item = yield sequelize.models.stateStorage.findByPk(element.handle);
                if (item) {
                    yield sequelize.models.stateStorage.update(element, { where: { handle: element.handle } });
                    return 201;
                }
                else {
                    yield sequelize.models.stateStorage.create(element);
                    return 201;
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
    __metadata("design:type", String)
], StateStorageItem.prototype, "handle", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "storage", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], StateStorageItem.prototype, "channelName", void 0);
StateStorageItem = __decorate([
    (0, sequelize_typescript_1.Table)({ tableName: "stateStorage", modelName: "stateStorage" }),
    __metadata("design:paramtypes", [])
], StateStorageItem);
exports.StateStorageItem = StateStorageItem;
module.exports.default = StateStorageItem;
//# sourceMappingURL=stateStorageItem.js.map