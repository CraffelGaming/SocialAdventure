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
const sequelize_1 = require("sequelize");
const router = express.Router();
const endpoint = 'translation';
router.get('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}`);
    const item = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { language: request.query.language }, order: [['handle', 'ASC']], raw: true });
    if (item)
        response.status(200).json(item);
    else
        response.status(404).json();
}));
router.get('/' + endpoint + '/:page', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}, page ${request.params.page}`);
    const item = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: request.params.page, language: request.query.language }, order: [['handle', 'ASC']], raw: true });
    if (item)
        response.status(200).json(item);
    else
        response.status(404).json();
}));
router.post('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace(`get ${endpoint}, page ${request.body.pages}`);
    const item = yield global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: { [sequelize_1.Op.in]: request.body.pages }, language: request.query.language }, order: [['handle', 'ASC']], raw: true });
    if (item)
        response.status(200).json(item);
    else
        response.status(404).json();
}));
exports.default = router;
//# sourceMappingURL=api.translation.js.map