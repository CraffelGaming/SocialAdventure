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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const swaggerUi = require("swagger-ui-express");
const specs = __importStar(require("../swagger"));
const api_version_1 = __importDefault(require("./api/api.version"));
const router = express.Router();
/**
 * @swagger
 * /version:
 *   get:
 *     tags:
 *     - Version
 *     summary: Versionsnummer
 *     description: Rückgabe der Versionsnummer.
 *     consumes:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             version:
 *               type: string
 *               example: "0.0.0"
 */
router.get("/version", api_version_1.default);
// documentation endpoint for Swagger
router.use('/', swaggerUi.serve, swaggerUi.setup(specs.default));
exports.default = router;
//# sourceMappingURL=api.js.map