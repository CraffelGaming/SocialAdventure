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
var NodeItem_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeItem = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const json = require("./nodeItem.json");
let NodeItem = NodeItem_1 = class NodeItem extends sequelize_typescript_1.Model {
    constructor({ id }, { name }) {
        super();
        this.name = name;
        this.id = id;
    }
    static updateTable({ sequelize }) {
        return __awaiter(this, void 0, void 0, function* () {
            const items = JSON.parse(JSON.stringify(json));
            for (const item of items) {
                if ((yield sequelize.models.NodeItem.count({ where: { id: item.id } })) === 0) {
                    yield new NodeItem_1({ id: item.id }, { name: item.name }).save();
                }
                else
                    sequelize.models.NodeItem.update({ name: item.name }, { where: { id: item.id } });
            }
        });
    }
};
__decorate([
    sequelize_typescript_1.PrimaryKey,
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], NodeItem.prototype, "id", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], NodeItem.prototype, "name", void 0);
NodeItem = NodeItem_1 = __decorate([
    (0, sequelize_typescript_1.Table)({
        tableName: 'node'
    }),
    __metadata("design:paramtypes", [Object, Object])
], NodeItem);
exports.NodeItem = NodeItem;
module.exports.default = NodeItem;
//# sourceMappingURL=nodeItem.js.map