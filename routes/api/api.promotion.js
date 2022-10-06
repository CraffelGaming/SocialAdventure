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
const promotionItem_1 = require("../../model/promotionItem");
const router = express.Router();
const endpoint = 'promotion';
router.get('/' + endpoint + '/:node/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node;
    if (request.params.node === 'default')
        node = yield global.defaultNode(request, response);
    else
        node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
    const channel = global.worker.channels.find(x => x.node.name === node.name);
    if (channel) {
        const item = yield channel.database.sequelize.models.promotion.findAll({ order: [['handle', 'ASC']], raw: false });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    else
        response.status(404).json();
}));
router.put('/' + endpoint + '/:node/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node;
    if (request.params.node === 'default')
        node = yield global.defaultNode(request, response);
    else
        node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
    const channel = global.worker.channels.find(x => x.node.name === node.name);
    if (channel) {
        if (global.isMaster(request, response, node)) {
            response.status(yield promotionItem_1.PromotionItem.put({ sequelize: channel.database.sequelize, globalSequelize: global.worker.globalDatabase.sequelize, element: request.body })).json(request.body);
        }
        else {
            response.status(403).json();
        }
    }
    else
        response.status(404).json();
}));
router.delete('/' + endpoint + '/:node/:handle', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
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
                const item = yield channel.database.sequelize.models.promotion.findByPk(request.params.handle);
                if (item) {
                    yield channel.database.sequelize.models.promotion.destroy({ where: { handle: request.params.handle } });
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
}));
router.post('/' + endpoint + '/:node/redeem/:promotionHandle/:heroName', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`post ${endpoint}, node ${request.params.node} redeem ${request.params.promotionHandle} ${request.params.heroName}`);
    let node;
    if (request.params.node === 'default')
        node = yield global.defaultNode(request, response);
    else
        node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
    const channel = global.worker.channels.find(x => x.node.name === node.name);
    if (channel) {
        const promotion = yield channel.database.sequelize.models.promotion.findByPk(request.params.promotionHandle);
        if (promotion) {
            if (global.isMaster(request, response, node) || global.isHero(request, response, request.params.heroName) && !promotion.isMaster) {
                response.status(yield promotionItem_1.PromotionItem.redeem({ sequelize: channel.database.sequelize, promotion, heroName: request.params.heroName })).json(promotion);
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(406).json();
    }
    else
        response.status(404).json();
}));
exports.default = router;
//# sourceMappingURL=api.promotion.js.map