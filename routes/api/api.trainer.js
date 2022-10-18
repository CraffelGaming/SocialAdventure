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
const trainerItem_1 = require("../../model/trainerItem");
const router = express.Router();
const endpoint = 'trainer';
router.get('/' + endpoint + '/:node/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            const item = yield channel.database.sequelize.models.trainer.findAll({ order: [['handle', 'ASC']], raw: false });
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
            node = global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                response.status(yield trainerItem_1.TrainerItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
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
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.handle != null) {
                    const item = yield channel.database.sequelize.models.trainer.findByPk(request.params.handle);
                    if (item) {
                        yield channel.database.sequelize.models.trainer.destroy({ where: { handle: request.params.handle } });
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
router.post('/' + endpoint + '/:node/training/:handle/hero/:name', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}, training ${request.params.handle}, hero ${request.params.name}`);
        let node;
        if (request.params.node === 'default')
            node = yield global.defaultNode(request, response);
        else
            node = (yield global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node));
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isChannel(request, response, request.params.name)) {
                response.status(yield trainerItem_1.TrainerItem.training({ sequelize: channel.database.sequelize, globalSequelize: global.worker.globalDatabase.sequelize, trainerHandle: request.params.handle, heroName: request.params.name })).json();
            }
            else
                response.status(403).json();
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
//# sourceMappingURL=api.trainer.js.map