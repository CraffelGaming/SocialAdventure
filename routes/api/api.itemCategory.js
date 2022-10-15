"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
const express = __importStar(require("express"));
const itemCategoryItem_1 = require("../../model/itemCategoryItem");
const router = express.Router();
const endpoint = 'itemcategory';
router.get('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        let item;
        if (request.query.childs !== "false") {
            item = (yield global.worker.globalDatabase.sequelize.models.itemCategory.findAll({ order: [['value', 'ASC']], raw: false, include: [{
                        model: global.worker.globalDatabase.sequelize.models.item,
                        as: 'items',
                    }] }));
        }
        else
            item = (yield global.worker.globalDatabase.sequelize.models.itemCategory.findAll({ order: [['value', 'ASC']], raw: false }));
        if (item)
            response.status(200).json(item.filter(x => { var _a; return ((_a = x.items) === null || _a === void 0 ? void 0 : _a.length) > 0; }));
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
}));
router.get('/' + endpoint + '/:node/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item;
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.name === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = (yield channel.database.sequelize.models.itemCategory.findAll({ order: [['value', 'ASC']], raw: false, include: [{
                            model: global.worker.globalDatabase.sequelize.models.item,
                            as: 'items',
                        }] }));
            }
            else
                item = (yield channel.database.sequelize.models.itemCategory.findAll({ order: [['value', 'ASC']], raw: false }));
            if (item)
                response.status(200).json(item);
            else
                response.status(404).json();
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
}));
router.put('/' + endpoint + '/:node/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.name === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                response.status(yield itemCategoryItem_1.ItemCategoryItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
}));
router.delete('/' + endpoint + '/:node/:handle', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.name === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.handle != null) {
                    const item = yield channel.database.sequelize.models.itemCategory.findByPk(request.params.handle);
                    if (item) {
                        for (const itemItem of Object.values(yield channel.database.sequelize.models.item.findAll({ where: { categoryHandle: request.params.handle } }))) {
                            for (const heroItem of Object.values(yield channel.database.sequelize.models.heroInventory.findAll({ where: { itemHandle: itemItem.handle } }))) {
                                yield channel.database.sequelize.models.heroWallet.increment('gold', { by: itemItem.gold * heroItem.quantity, where: { heroName: heroItem.heroName } });
                                yield channel.database.sequelize.models.heroInventory.destroy({ where: { itemHandle: request.params.handle } });
                            }
                            yield channel.database.sequelize.models.item.destroy({ where: { handle: itemItem.handle } });
                        }
                        yield channel.database.sequelize.models.itemCategory.destroy({ where: { handle: request.params.handle } });
                    }
                    response.status(204).json();
                }
                else
                    response.status(404).json();
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
}));
router.post('/' + endpoint + '/:node/transfer/:handle', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.name === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                const globalCategory = yield global.worker.globalDatabase.sequelize.models.itemCategory.findByPk(request.params.handle, { raw: true });
                if (globalCategory !== null) {
                    const category = yield channel.database.sequelize.models.itemCategory.findByPk(request.params.handle, { raw: true });
                    if (category === null) {
                        yield channel.database.sequelize.models.itemCategory.create(globalCategory);
                    }
                    const globalItems = yield global.worker.globalDatabase.sequelize.models.item.findAll({ where: { categoryHandle: request.params.handle }, raw: true });
                    for (const globalItem in globalItems) {
                        if (globalItem != null) {
                            const item = yield channel.database.sequelize.models.item.findOne({ where: { categoryHandle: request.params.handle, value: globalItems[globalItem].value }, raw: true });
                            if (item) {
                                globalItems[globalItem].handle = item.handle;
                                yield channel.database.sequelize.models.item.update(globalItems[globalItem], { where: { handle: item.handle } });
                            }
                            else {
                                globalItems[globalItem].handle = null;
                                yield channel.database.sequelize.models.item.create(globalItems[globalItem]);
                            }
                        }
                    }
                }
                response.status(201).json();
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
}));
exports.default = router;
//# sourceMappingURL=api.itemCategory.js.map