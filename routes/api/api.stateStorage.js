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
const stateStorageItem_1 = require("../../model/stateStorageItem");
const router = express.Router();
const endpoint = 'stateStorage';
router.get('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}`);
    if (global.isRegistered(request, response)) {
        const item = yield global.worker.globalDatabase.sequelize.models.stateStorage.findAll({ where: { channelName: request.session.userData.login }, raw: true });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    else {
        response.status(403).json();
    }
}));
router.get('/' + endpoint + '/:name', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}, name ${request.params.page}`);
    if (global.isRegistered(request, response)) {
        const item = yield global.worker.globalDatabase.sequelize.models.stateStorage.findOne({ where: { handle: request.params.name, channelName: request.session.userData.login }, raw: true });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    else {
        response.status(403).json();
    }
}));
router.put('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (global.isRegistered(request, response)) {
        request.body.channelName = request.session.userData.login;
        response.status(yield stateStorageItem_1.StateStorageItem.put({ sequelize: global.worker.globalDatabase.sequelize, element: request.body })).json(request.body);
    }
    else {
        response.status(403).json();
    }
}));
router.delete('/' + endpoint + '/:name', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`delete ${endpoint}, name ${request.params.name}`);
    if (global.isRegistered(request, response)) {
        const item = yield global.worker.globalDatabase.sequelize.models.stateStorage.findOne({ where: { handle: request.params.name, channelName: request.session.userData.login } });
        if (item) {
            yield global.worker.globalDatabase.sequelize.models.stateStorage.destroy({ where: { handle: request.params.name, channelName: request.session.userData.login } });
            response.status(204).json();
        }
        else
            response.status(404).json();
    }
    else {
        response.status(403).json();
    }
}));
exports.default = router;
//# sourceMappingURL=api.stateStorage.js.map