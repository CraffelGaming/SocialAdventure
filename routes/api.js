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
const api_node_1 = __importDefault(require("./api/api.node"));
const api_menu_1 = __importDefault(require("./api/api.menu"));
const api_migration_1 = __importDefault(require("./api/api.migration"));
const api_translation_1 = __importDefault(require("./api/api.translation"));
const api_twitch_1 = __importDefault(require("./api/api.twitch"));
const api_level_1 = __importDefault(require("./api/api.level"));
const api_say_1 = __importDefault(require("./api/api.say"));
const api_loot_1 = __importDefault(require("./api/api.loot"));
const api_hero_1 = __importDefault(require("./api/api.hero"));
const api_heroWallet_1 = __importDefault(require("./api/api.heroWallet"));
const api_heroTrait_1 = __importDefault(require("./api/api.heroTrait"));
const api_heroInventory_1 = __importDefault(require("./api/api.heroInventory"));
const api_heroPromotion_1 = __importDefault(require("./api/api.heroPromotion"));
const api_item_1 = __importDefault(require("./api/api.item"));
const api_itemCategory_1 = __importDefault(require("./api/api.itemCategory"));
const api_command_1 = __importDefault(require("./api/api.command"));
const api_location_1 = __importDefault(require("./api/api.location"));
const api_enemy_1 = __importDefault(require("./api/api.enemy"));
const api_adventure_1 = __importDefault(require("./api/api.adventure"));
const api_trainer_1 = __importDefault(require("./api/api.trainer"));
const api_healingPotion_1 = __importDefault(require("./api/api.healingPotion"));
const api_daily_1 = __importDefault(require("./api/api.daily"));
const api_promotion_1 = __importDefault(require("./api/api.promotion"));
const api_help_1 = __importDefault(require("./api/api.help"));
const api_placeholder_1 = __importDefault(require("./api/api.placeholder"));
const api_validation_1 = __importDefault(require("./api/api.validation"));
const api_stateStorage_1 = __importDefault(require("./api/api.stateStorage"));
const router = express.Router();
//#region Adventure
/**
 * @swagger
 * /adventure/{node}:
 *   get:
 *     tags:
 *     - Adventure
 *     summary: Abenteuer
 *     description: Rückgabe aller Daten im Abenteuer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: 1
 *                 descrition: Name des Helden
 *               itemHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstandes
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/adventure/:node", api_adventure_1.default);
/**
 * @swagger
 * /adventure/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - Adventure
 *     summary: Abenteuer
 *     description: Rückgabe aller Daten im Abenteuer zu einem Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: 1
 *                 descrition: Name des Helden
 *               itemHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstandes
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/adventure/:node/hero/:name", api_adventure_1.default);
/**
 * @swagger
 * /adventure/{node}:
 *   put:
 *     tags:
 *     - Adventure
 *     summary: Abenteuer
 *     description: Anlage neuer Daten im Abenteuer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           heroName:
 *             type: string
 *             example: "craffel"
 *             descrition: Name des Helden
 *           itemHandle:
 *             type: integer
 *             example: 1
 *             descrition: ID des Gegenstandes
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             heroName:
 *               type: string
 *               example: 1
 *               descrition: Name des Helden
 *             itemHandle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Gegenstandes
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/adventure/:node", api_adventure_1.default);
/**
 * @swagger
 * /adventure/{node}/{heroName}/{itemHandle}:
 *   delete:
 *     tags:
 *     - Adventure
 *     summary: Abenteuer
 *     description: Löscht ein Datensatz im Abenteuer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "heroName"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "itemHandle"
 *       in: "path"
 *       description: "ID des Gegestandes"
 *       required: true
 *       type: "integer"
 *       default: 1
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/adventure/:node/:heroName/:itemHandle", api_adventure_1.default);
//#endregion
//#region Command
/**
 * @swagger
 * /command/{node}:
 *   get:
 *     tags:
 *     - Command
 *     summary: Chat-Befehle
 *     description: Rückgabe aller Chat-Befehle.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     - name: "counter"
 *       in: "query"
 *       description: "Gibt an, ob die Commands für einen Counter angezeigt werden sollen."
 *       required: false
 *       type: "boolean"
 *       default: false
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *                 example: "say"
 *                 descrition: Name des Moduls
 *               command:
 *                 type: string
 *                 example: "text"
 *                 descrition: Name des Befehls.
 *               isMaster:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob nur der Streamer den Befehl verwenden darf.
 *               translation:
 *                 type: string
 *                 example: "text"
 *                 descrition: GName der Übersetzung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/command/:node", api_command_1.default);
/**
 * @swagger
 * /command/{node}/{module}:
 *   get:
 *     tags:
 *     - Command
 *     summary: Chat-Befehle eines Moduls
 *     description: Rückgabe aller Chat-Befehle eines Moduls.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "module"
 *       in: "path"
 *       description: "Modul"
 *       required: true
 *       type: "string"
 *       default: "say"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     - name: "counter"
 *       in: "query"
 *       description: "Gibt an, ob die Commands für einen Counter angezeigt werden sollen."
 *       required: false
 *       type: "boolean"
 *       default: false
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               module:
 *                 type: string
 *                 example: "say"
 *                 descrition: Name des Moduls
 *               command:
 *                 type: string
 *                 example: "text"
 *                 descrition: Name des Befehls.
 *               isMaster:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob nur der Streamer den Befehl verwenden darf.
 *               translation:
 *                 type: string
 *                 example: "text"
 *                 descrition: GName der Übersetzung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/command/:node/:module", api_command_1.default);
//#endregion
//#region Daily
/**
 * @swagger
 * /daily/{node}:
 *   get:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Rückgabe aller Täglichen Aufgaben.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "gold"
 *                 descrition: ID der Täglichen Aufgabe
 *               value:
 *                 type: string
 *                 example: "Minenarbeit"
 *                 descrition: Name der Täglichen Aufgabe
 *               description:
 *                 type: string
 *                 example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *                 descrition: Beschreibung der Täglichen Aufgabe
 *               goldMin:
 *                 type: integer
 *                 example: 100
 *                 descrition: Minimaler Verdienst an Gold
 *               goldMax:
 *                 type: integer
 *                 example: 500
 *                 descrition: Maximaler Verdienst an Gold
 *               experienceMin:
 *                 type: integer
 *                 example: 100
 *                 descrition: Minimaler Verdienst an Erfahrung
 *               experienceMax:
 *                 type: integer
 *                 example: 500
 *                 descrition: Maximaler Verdienst an Erfahrung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/daily/:node", api_daily_1.default);
/**
 * @swagger
 * /daily/{node}/current/{count}:
 *   get:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Rückgabe Täglicher Aufgaben, die jeden Tag neu durchgemischt werden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "count"
 *       in: "path"
 *       description: "Anzahl der zufälligen Täglichen Aufgaben"
 *       required: true
 *       type: "string"
 *       default: 3
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "gold"
 *                 descrition: ID der Täglichen Aufgabe
 *               value:
 *                 type: string
 *                 example: "Minenarbeit"
 *                 descrition: Name der Täglichen Aufgabe
 *               description:
 *                 type: string
 *                 example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *                 descrition: Beschreibung der Täglichen Aufgabe
 *               gold:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Gold
 *               experience:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Erfahrung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/daily/:node/current/:count", api_daily_1.default);
/**
 * @swagger
 * /daily/{node}/current/{count}/hero/{name}:
 *   get:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Rückgabe Täglicher Aufgaben, die jeden Tag neu durchgemischt werden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "count"
 *       in: "path"
 *       description: "Anzahl der zufälligen Täglichen Aufgaben"
 *       required: true
 *       type: "string"
 *       default: 3
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffelmat"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "gold"
 *                 descrition: ID der Täglichen Aufgabe
 *               value:
 *                 type: string
 *                 example: "Minenarbeit"
 *                 descrition: Name der Täglichen Aufgabe
 *               description:
 *                 type: string
 *                 example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *                 descrition: Beschreibung der Täglichen Aufgabe
 *               gold:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Gold
 *               experience:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Erfahrung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/daily/:node/current/:count/hero/:name", api_daily_1.default);
/**
 * @swagger
 * /daily/{node}/redeem/{number}/hero/{name}:
 *   post:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Erfüllen einer täglichen Aufgabe.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "number"
 *       in: "path"
 *       description: "Nummer der zufälligen Täglichen Aufgaben"
 *       required: true
 *       type: "string"
 *       default: 1
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffelmat"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "gold"
 *                 descrition: ID der Täglichen Aufgabe
 *               value:
 *                 type: string
 *                 example: "Minenarbeit"
 *                 descrition: Name der Täglichen Aufgabe
 *               description:
 *                 type: string
 *                 example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *                 descrition: Beschreibung der Täglichen Aufgabe
 *               gold:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Gold
 *               experience:
 *                 type: integer
 *                 example: 100
 *                 descrition: Verdienst an Erfahrung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.post("/daily/:node/redeem/:number/hero/:name", api_daily_1.default);
/**
 * @swagger
 * /daily/{node}:
 *   put:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Anlage einer neuen täglichen Aufgabe.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: string
 *             example: "gold"
 *             descrition: ID der Täglichen Aufgabe
 *           value:
 *             type: string
 *             example: "Minenarbeit"
 *             descrition: Name der Täglichen Aufgabe
 *           description:
 *             type: string
 *             example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *             descrition: Beschreibung der Täglichen Aufgabe
 *           goldMin:
 *             type: integer
 *             example: 100
 *             descrition: Minimaler Verdienst an Gold
 *           goldMax:
 *             type: integer
 *             example: 500
 *             descrition: Maximaler Verdienst an Gold
 *           experienceMin:
 *             type: integer
 *             example: 100
 *             descrition: Minimaler Verdienst an Erfahrung
 *           experienceMax:
 *             type: integer
 *             example: 500
 *             descrition: Maximaler Verdienst an Erfahrung
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: "gold"
 *               descrition: ID der Täglichen Aufgabe
 *             value:
 *               type: string
 *               example: "Minenarbeit"
 *               descrition: Name der Täglichen Aufgabe
 *             description:
 *               type: string
 *               example: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *               descrition: Beschreibung der Täglichen Aufgabe
 *             goldMin:
 *               type: integer
 *               example: 100
 *               descrition: Minimaler Verdienst an Gold
 *             goldMax:
 *               type: integer
 *               example: 500
 *               descrition: Maximaler Verdienst an Gold
 *             experienceMin:
 *               type: integer
 *               example: 100
 *               descrition: Minimaler Verdienst an Erfahrung
 *             experienceMax:
 *               type: integer
 *               example: 500
 *               descrition: Maximaler Verdienst an Erfahrung
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/daily/:node", api_daily_1.default);
/**
 * @swagger
 * /daily/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Daily
 *     summary: Tägliche Aufgabe
 *     description: Löscht eine bestimmte Tägliche Aufgabe.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID der Täglichen Aufgabe"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/daily/:node/:handle", api_daily_1.default);
//#endregion
//#region Enemy
/**
 * @swagger
 * /enemy/{node}:
 *   get:
 *     tags:
 *     - Enemy
 *     summary: Gegner
 *     description: Rückgabe aller Gegner.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegners
 *               name:
 *                 type: string
 *                 example: "Skelett"
 *                 descrition: Name des Gegners
 *               description:
 *                 type: string
 *                 example: "Ein schwaches Skelett. War das Skelett auch mal ein Mensch?"
 *                 descrition: Beschreibung des Gegners
 *               difficulty:
 *                 type: integer
 *                 example: 1
 *                 descrition: Schwierigkeit des Gegners.
 *               hitpoints:
 *                 type: integer
 *                 example: 100
 *                 descrition: Lebenspunkte des Gegners.
 *               strength:
 *                 type: integer
 *                 example: 10
 *                 descrition: Stärke des Gegners.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/enemy/:node", api_enemy_1.default);
/**
 * @swagger
 * /enemy/{node}:
 *   put:
 *     tags:
 *     - Enemy
 *     summary: gegner
 *     description: Anlage eines neuen Gegners.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: integer
 *             example: 1
 *             descrition: ID des Gegners
 *           name:
 *             type: string
 *             example: "Skelett"
 *             descrition: Name des Gegners
 *           description:
 *             type: string
 *             example: "Ein schwaches Skelett. War das Skelett auch mal ein Mensch?"
 *             descrition: Beschreibung des Gegners
 *           difficulty:
 *             type: integer
 *             example: 1
 *             descrition: Schwierigkeit des Gegners.
 *           hitpoints:
 *             type: integer
 *             example: 100
 *             descrition: Lebenspunkte des Gegners.
 *           strength:
 *             type: integer
 *             example: 10
 *             descrition: Stärke des Gegners.
 *           isActive:
 *             type: boolean
 *             example: true
 *             descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Gegners
 *             name:
 *               type: string
 *               example: "Skelett"
 *               descrition: Name des Gegners
 *             description:
 *               type: string
 *               example: "Ein schwaches Skelett. War das Skelett auch mal ein Mensch?"
 *               descrition: Beschreibung des Gegners
 *             difficulty:
 *               type: integer
 *               example: 1
 *               descrition: Schwierigkeit des Gegners.
 *             hitpoints:
 *               type: integer
 *               example: 100
 *               descrition: Lebenspunkte des Gegners.
 *             strength:
 *               type: integer
 *               example: 10
 *               descrition: Stärke des Gegners.
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/enemy/:node", api_enemy_1.default);
/**
 * @swagger
 * /enemy/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Enemy
 *     summary: Gegner
 *     description: Löscht einen bestimmten Gegner.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Dungeons"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/enemy/:node/:handle", api_enemy_1.default);
//#endregion
//#region Healing Potion
/**
 * @swagger
 * /healingPotion/{node}:
 *   get:
 *     tags:
 *     - HealingPotion
 *     summary: Heiltrank
 *     description: Rückgabe aller Heiltränke.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstands
 *               value:
 *                 type: string
 *                 example: "Mächtiger Heiltrank"
 *                 descrition: Name des Heiltranks
 *               description:
 *                 type: string
 *                 example: "Der beste Heiltrank weit und breit. Eine Flasche und du fühlst dich wie neu geboren. Leider spiegelt sich das auch am Preis wieder. Vegan."
 *                 descrition: Beschreibung des Heiltranks
 *               percent:
 *                 type: integer
 *                 example: 25
 *                 descrition: Heilkraft des Heiltranks in prozent
 *               gold:
 *                 type: integer
 *                 example: 200
 *                 descrition: Wert des Heiltranks in Gold
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/healingPotion/:node", api_healingPotion_1.default);
/**
 * @swagger
 * /healingPotion/{node}:
 *   put:
 *     tags:
 *     - HealingPotion
 *     summary: Heiltrank
 *     description: Anlage eines neuen Heiltranks.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *            type: integer
 *            example: 1
 *            descrition: ID des Heiltranks
 *           value:
 *             type: string
 *             example: "Mächtiger Heiltrank"
 *             descrition: Name des Heiltranks
 *           description:
 *             type: string
 *             example: "Der beste Heiltrank weit und breit. Eine Flasche und du fühlst dich wie neu geboren. Leider spiegelt sich das auch am Preis wieder. Vegan."
 *             descrition: Beschreibung des Heiltranks
 *           percent:
 *             type: integer
 *             example: 25
 *             descrition: Heilkraft des Heiltranks in prozent
 *           gold:
 *             type: integer
 *             example: 200
 *             descrition: Wert des Heiltranks in Gold
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Gegenstands
 *             value:
 *               type: string
 *               example: "Mächtiger Heiltrank"
 *               descrition: Name des Heiltranks
 *             description:
 *               type: string
 *               example: "Der beste Heiltrank weit und breit. Eine Flasche und du fühlst dich wie neu geboren. Leider spiegelt sich das auch am Preis wieder. Vegan."
 *               descrition: Beschreibung des Heiltranks
 *             percent:
 *               type: integer
 *               example: 25
 *               descrition: Heilkraft des Heiltranks in prozent
 *             gold:
 *               type: integer
 *               example: 200
 *               descrition: Wert des Heiltranks in Gold
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/healingPotion/:node", api_healingPotion_1.default);
/**
 * @swagger
 * /healingPotion/{node}/{handle}:
 *   delete:
 *     tags:
 *     - HealingPotion
 *     summary: Heiltrank
 *     description: Löscht einen bestimmten Heiltrank.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/healingPotion/:node/:handle", api_healingPotion_1.default);
/**
 * @swagger
 * /healingPotion/{node}/heal/{handle}/hero/{name}:
 *   post:
 *     tags:
 *     - HealingPotion
 *     summary: Heiltrank
 *     description: Heilt oder Belebt einen Helden wieder.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID der Heiltranks"
 *       required: true
 *       type: "number"
 *       default: 1
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     responses:
 *       200:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.post("/healingPotion/:node/heal/:handle/hero/:name", api_healingPotion_1.default);
//#endregion
//#region Help
/**
 * @swagger
 * /help/{node}:
 *   put:
 *     tags:
 *     - Hilfe
 *     summary: Hilfe
 *     description: Senden einer neuen Anfrage
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: string
 *             example: "gold"
 *             descrition: ID der Anfrage
 *           name:
 *             type: string
 *             example: "craffel"
 *             descrition: Login-Name des Fragestellers
 *           mail:
 *             type: string
 *             example: "craffel@craffel.de"
 *             descrition: E-Mail des Fragestellers
 *           content:
 *             type: string
 *             example: "Ich bin UI Designer und würde gerne Helfen! Ist noch Platz im Team?"
 *             descrition: Frage des Fragestellers
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: "gold"
 *               descrition: ID der Anfrage
 *             name:
 *               type: string
 *               example: "craffel"
 *               descrition: Login-Name des Fragestellers
 *             mail:
 *               type: string
 *               example: "craffel@craffel.de"
 *               descrition: E-Mail des Fragestellers
 *             content:
 *               type: string
 *               example: "Ich bin UI Designer und würde gerne Helfen! Ist noch Platz im Team?"
 *               descrition: Frage des Fragestellers
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/help/:node", api_help_1.default);
//#endregion
//#region Hero
/**
 * @swagger
 * /hero/{node}:
 *   get:
 *     tags:
 *     - Hero
 *     summary: Helden
 *     description: Rückgabe aller Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               lastSteal:
 *                 type: string
 *                 example: "2020-02-01 00:00:00.000 +00:00"
 *                 descrition: Letzter Diebszahl.
 *               lastJoin:
 *                 type: string
 *                 example: "2020-02-01 00:00:00.000 +00:00"
 *                 descrition: Letzte Teilnahme an einem Abenteuer.
 *               startIndex:
 *                 type: number
 *                 example: 2
 *                 descrition: Interner Berechnungswert für ein faires Spiel.
 *               experience:
 *                 type: number
 *                 example: 12500
 *                 descrition: Menge der gesammelten Erfahrung.
 *               level:
 *                 type: number
 *                 example: 7
 *                 descrition: Level des Helden.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an ob der Held gearde aktiv auf Abenteuer ist.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/hero/:node", api_hero_1.default);
/**
 * @swagger
 * /hero/{node}/{name}:
 *   get:
 *     tags:
 *     - Hero
 *     summary: Held
 *     description: Rückgabe eines Helden anhand des Namen
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               lastSteal:
 *                 type: string
 *                 example: "2020-02-01 00:00:00.000 +00:00"
 *                 descrition: Letzter Diebszahl.
 *               lastJoin:
 *                 type: string
 *                 example: "2020-02-01 00:00:00.000 +00:00"
 *                 descrition: Letzte Teilnahme an einem Abenteuer.
 *               startIndex:
 *                 type: number
 *                 example: 2
 *                 descrition: Interner Berechnungswert für ein faires Spiel.
 *               experience:
 *                 type: number
 *                 example: 12500
 *                 descrition: Menge der gesammelten Erfahrung.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an ob der Held gearde aktiv auf Abenteuer ist.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/hero/:node/:name", api_hero_1.default);
/**
 * @swagger
 * /hero/{node}:
 *   put:
 *     tags:
 *     - Hero
 *     summary: Gegenstand
 *     description: Anlage eines neuen Gegenstands.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "hero"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *             example: "craffel"
 *             descrition: Name des Helden
 *           lastSteal:
 *             type: string
 *             example: "2020-02-01 00:00:00.000 +00:00"
 *             descrition: Letzter Diebszahl.
 *           lastJoin:
 *             type: string
 *             example: "2020-02-01 00:00:00.000 +00:00"
 *             descrition: Letzte Teilnahme an einem Abenteuer.
 *           startIndex:
 *             type: number
 *             example: 2
 *             descrition: Interner Berechnungswert für ein faires Spiel.
 *           experience:
 *             type: number
 *             example: 12500
 *             descrition: Menge der gesammelten Erfahrung.
 *           isActive:
 *             type: boolean
 *             example: true
 *             descrition: Gibt an ob der Held gearde aktiv auf Abenteuer ist.
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "craffel"
 *               descrition: Name des Helden
 *             lastSteal:
 *               type: string
 *               example: "2020-02-01 00:00:00.000 +00:00"
 *               descrition: Letzter Diebszahl.
 *             lastJoin:
 *               type: string
 *               example: "2020-02-01 00:00:00.000 +00:00"
 *               descrition: Letzte Teilnahme an einem Abenteuer.
 *             startIndex:
 *               type: number
 *               example: 2
 *               descrition: Interner Berechnungswert für ein faires Spiel.
 *             experience:
 *               type: number
 *               example: 12500
 *               descrition: Menge der gesammelten Erfahrung.
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Gibt an ob der Held gearde aktiv auf Abenteuer ist.
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/hero/:node", api_hero_1.default);
//#endregion
//#region Hero Inventory
/**
 * @swagger
 * /heroinventory/{node}:
 *   get:
 *     tags:
 *     - Hero Inventory
 *     summary: Inventar der Helden
 *     description: Rückgabe aller Gegenstände aller Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               itemHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstands
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 descrition: Anzahl
 *               isReload:
 *                 type: boolean
 *                 example: false
 *                 descrition: Angabe, ob der Gegenstand gearde im Abenteuer im besitz ist
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/heroinventory/:node", api_heroInventory_1.default);
/**
 * @swagger
 * /heroinventory/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - Hero Inventory
 *     summary: Inventar eines Helden
 *     description: Rückgabe aller Gegenstände eines Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Hero"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               itemHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstands
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               quantity:
 *                 type: integer
 *                 example: 3
 *                 descrition: Anzahl
 *               isReload:
 *                 type: boolean
 *                 example: false
 *                 descrition: Angabe, ob der Gegenstand gearde im Abenteuer im besitz ist
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/heroinventory/:node/hero/:name", api_heroInventory_1.default);
/**
 * @swagger
 * /heroinventory/{node}/sell/item/{handle}/hero/{name}:
 *   post:
 *     tags:
 *     - Hero Inventory
 *     summary: Inventar der Helden
 *     description: Verkauf einen Gegenstand.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     responses:
 *       200:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.post("/heroinventory/:node/sell/item/:handle/hero/:name", api_heroInventory_1.default);
//#endregion
//#region Hero Promotion
/**
 * @swagger
 * /heropromotion/{node}:
 *   get:
 *     tags:
 *     - Hero Promotion
 *     summary: Promo-Codes der Helden
 *     description: Rückgabe aller eingelösten Promo-Codes aller Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               promotionHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des promo-Codes
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/heropromotion/:node", api_heroPromotion_1.default);
/**
 * @swagger
 * /heropromotion/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - Hero Promotion
 *     summary: Promo-Codes eines Helden
 *     description: Rückgabe aller eingelösten Promo-Codes eines Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Hero"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               promotionHandle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des promo-Codes
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/heropromotion/:node/hero/:name", api_heroPromotion_1.default);
//#endregion
//#region Hero Trait
/**
 * @swagger
 * /herotrait/{node}:
 *   get:
 *     tags:
 *     - Hero Trait
 *     summary: Eigenschaften der Helden
 *     description: Rückgabe aller Eigenschaften aller Helden
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               goldMultipler:
 *                 type: string
 *                 example: 1
 *                 descrition: Skillstufe f&uuml;r Goldfund
 *               stealMultipler:
 *                 type: string
 *                 example: 1
 *                 descrition: Skillstufe f&uuml;r Diebst&auml;hle
 *               defenceMultipler:
 *                 type: number
 *                 example: 1
 *                 descrition: Skillstufe f&uuml;r Verteidigung
 *               workMultipler:
 *                 type: number
 *                 example: 1
 *                 descrition: Skillstufe f&uuml;r t&auml;gliche Arbeit
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/herotrait/:node", api_heroTrait_1.default);
/**
 * @swagger
 * /herotrait/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - Hero Trait
 *     summary: Eigenschaft eines Helden
 *     description: Rückgabe der Eigenschaften vom ausgewählten Held.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Hero"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             heroName:
 *               type: string
 *               example: "craffel"
 *               descrition: Name des Helden
 *             goldMultipler:
 *               type: string
 *               example: 1
 *               descrition: Skillstufe f&uuml;r Goldfund
 *             stealMultipler:
 *               type: string
 *               example: 1
 *               descrition: Skillstufe f&uuml;r Diebst&auml;hle
 *             defenceMultipler:
 *               type: number
 *               example: 1
 *               descrition: Skillstufe f&uuml;r Verteidigung
 *             workMultipler:
 *               type: number
 *               example: 1
 *               descrition: Skillstufe f&uuml;r t&auml;gliche Arbeit
 *             createdAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der Anlage
 *             updatedAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/herotrait/:node/hero/:name", api_heroTrait_1.default);
//#endregion
//#region Hero Wallet
/**
 * @swagger
 * /herowallet/{node}:
 *   get:
 *     tags:
 *     - Hero Wallet
 *     summary: Geldtasche aller Helden
 *     description: Rückgabe aller Geldtaschen aller Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               heroName:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Name des Helden
 *               gold:
 *                 type: string
 *                 example: 750
 *                 descrition: Anzahl an Gold
 *               diamand:
 *                 type: string
 *                 example: 50
 *                 descrition: Anzahl an Diamanten
 *               blood:
 *                 type: number
 *                 example: 17
 *                 descrition: Blutrauschpunkte
 *               lastBlood:
 *                 type: string
 *                 example: "2020-02-01 00:00:00.000 +00:00"
 *                 descrition: Zeitpunkt des letzten Blutrauschs
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/herowallet/:node", api_heroWallet_1.default);
/**
 * @swagger
 * /herowallet/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - Hero Wallet
 *     summary: Geldtasche eines Helden.
 *     description: Rückgabe der Geldtasche eines Helden.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "name"
 *       in: "path"
 *       description: "Hero"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             heroName:
 *               type: string
 *               example: "craffel"
 *               descrition: Name des Helden
 *             gold:
 *               type: string
 *               example: 750
 *               descrition: Anzahl an Gold
 *             diamand:
 *               type: string
 *               example: 50
 *               descrition: Anzahl an Diamanten
 *             blood:
 *               type: number
 *               example: 17
 *               descrition: Blutrauschpunkte
 *             lastBlood:
 *               type: string
 *               example: "2020-02-01 00:00:00.000 +00:00"
 *               descrition: Zeitpunkt des letzten Blutrauschs
 *             createdAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der Anlage
 *             updatedAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/herowallet/:node/hero/:name", api_heroWallet_1.default);
//#endregion
//#region Item
/**
 * @swagger
 * /item/:
 *   get:
 *     tags:
 *     - Item
 *     summary: Gegenstände
 *     description: Rückgabe aller Gegenstände.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstands
 *               value:
 *                 type: string
 *                 example: "Schwert"
 *                 descrition: Nabe des Gegenstandes
 *               gold:
 *                 type: integer
 *                 example: 150
 *                 descrition: Wert des Gegenstandes in Gold
 *               type:
 *                 type: number
 *                 example: 1
 *                 descrition: Typ des Gegenstandes
 *               category:
 *                 type: object
 *                 properties:
 *                   handle:
 *                     type: intener
 *                     example: 1
 *                     descrition: ID der Item Kategorie.
 *                   value:
 *                     type: string
 *                     example: "default"
 *                     descrition: Name  für die Übersetzung der Item Kategorie.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/item", api_item_1.default);
/**
 * @swagger
 * /item/{node}:
 *   get:
 *     tags:
 *     - Item
 *     summary: Gegenstände
 *     description: Rückgabe aller Gegenstände.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Gegenstands
 *               value:
 *                 type: string
 *                 example: "Schwert"
 *                 descrition: Nabe des Gegenstandes
 *               gold:
 *                 type: integer
 *                 example: 150
 *                 descrition: Wert des Gegenstandes in Gold
 *               type:
 *                 type: number
 *                 example: 1
 *                 descrition: Typ des Gegenstandes
 *               category:
 *                 type: object
 *                 properties:
 *                   handle:
 *                     type: intener
 *                     example: 1
 *                     descrition: ID der Item Kategorie.
 *                   value:
 *                     type: string
 *                     example: "default"
 *                     descrition: Name  für die Übersetzung der Item Kategorie.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/item/:node", api_item_1.default);
/**
 * @swagger
 * /item/{node}/{handle}:
 *   get:
 *     tags:
 *     - Item
 *     summary: Gegenstände
 *     description: Rückgabe eines Gegenständs.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "integer"
 *       default: 1
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Gegenstands
 *             value:
 *               type: string
 *               example: "Schwert"
 *               descrition: Nabe des Gegenstandes
 *             gold:
 *               type: integer
 *               example: 150
 *               descrition: Wert des Gegenstandes in Gold
 *             type:
 *               type: number
 *               example: 1
 *               descrition: Typ des Gegenstandes
 *             category:
 *               type: object
 *               properties:
 *                 handle:
 *                   type: intener
 *                   example: 1
 *                   descrition: ID der Item Kategorie.
 *                 value:
 *                   type: string
 *                   example: "default"
 *                   descrition: Name  für die Übersetzung der Item Kategorie.
 *             createdAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der Anlage
 *             updatedAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/item/:node/:handle", api_item_1.default);
/**
 * @swagger
 * /item/{node}:
 *   put:
 *     tags:
 *     - Item
 *     summary: Gegenstand
 *     description: Anlage eines neuen Gegenstands.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: integer
 *             example: 1
 *             descrition: ID des Gegenstands.
 *           value:
 *             type: string
 *             example: "Schwert"
 *             descrition: Nabe des Gegenstandes
 *           gold:
 *             type: integer
 *             example: 150
 *             descrition: Wert des Gegenstandes in Gold
 *           type:
 *             type: number
 *             example: 1
 *             descrition: Typ des Gegenstandes
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Gegenstands
 *             value:
 *               type: string
 *               example: "Schwert"
 *               descrition: Nabe des Gegenstandes
 *             gold:
 *               type: integer
 *               example: 150
 *               descrition: Wert des Gegenstandes in Gold
 *             type:
 *               type: number
 *               example: 1
 *               descrition: Typ des Gegenstandes
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/item/:node", api_item_1.default);
/**
 * @swagger
 * /item/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Item
 *     summary: Gegenstand
 *     description: Löscht einen bestimmten Gegenstand. Jeder Held bekommt Gold in Form des Goldwertes erstattet.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/item/:node/:handle", api_item_1.default);
//#endregion
//#region Item Category
/**
 * @swagger
 * /itemcategory:
 *   get:
 *     tags:
 *     - Item Category
 *     summary: Item Category
 *     description: Rückgabe aller Item Kategorien.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: intener
 *                 example: 1
 *                 descrition: ID der Item Kategorie.
 *               value:
 *                 type: string
 *                 example: "default"
 *                 descrition: Name  für die Übersetzung der Item Kategorie.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     handle:
 *                       type: integer
 *                       example: 1
 *                       descrition: ID des Gegenstands
 *                     value:
 *                       type: string
 *                       example: "Schwert"
 *                       descrition: Nabe des Gegenstandes
 *                     gold:
 *                       type: integer
 *                       example: 150
 *                       descrition: Wert des Gegenstandes in Gold
 *                     type:
 *                       type: number
 *                       example: 1
 *                       descrition: Typ des Gegenstandes
 *                     createdAt:
 *                       type: string
 *                       example: "2022-05-12 10:11:35.027 +00:00"
 *                       descrition: Datum der Anlage
 *                     updatedAt:
 *                       type: string
 *                       example: "2022-05-12 10:11:35.027 +00:00"
 *                       descrition: Datum der letzten Änderung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/itemcategory", api_itemCategory_1.default);
/**
 * @swagger
 * /itemcategory/{node}:
 *   get:
 *     tags:
 *     - Item Category
 *     summary: Item Category
 *     description: Rückgabe aller Item Kategorien.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: intener
 *                 example: 1
 *                 descrition: ID der Item Kategorie.
 *               value:
 *                 type: string
 *                 example: "default"
 *                 descrition: Name  für die Übersetzung der Item Kategorie.
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     handle:
 *                       type: integer
 *                       example: 1
 *                       descrition: ID des Gegenstands
 *                     value:
 *                       type: string
 *                       example: "Schwert"
 *                       descrition: Nabe des Gegenstandes
 *                     gold:
 *                       type: integer
 *                       example: 150
 *                       descrition: Wert des Gegenstandes in Gold
 *                     type:
 *                       type: number
 *                       example: 1
 *                       descrition: Typ des Gegenstandes
 *                     createdAt:
 *                       type: string
 *                       example: "2022-05-12 10:11:35.027 +00:00"
 *                       descrition: Datum der Anlage
 *                     updatedAt:
 *                       type: string
 *                       example: "2022-05-12 10:11:35.027 +00:00"
 *                       descrition: Datum der letzten Änderung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/itemcategory/:node", api_itemCategory_1.default);
/**
 * @swagger
 * /itemcategory/{node}/transfer/{handle}:
 *   post:
 *     tags:
 *     - Item Category
 *     summary: Item Category
 *     description: Überträgt eine globale Gegenstandskategorie in einen Node
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "Gegenstandskategorie"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       404:
 *         description: no data
 */
router.post("/itemcategory/:node/transfer/:handle", api_itemCategory_1.default);
/**
 * @swagger
 * /itemCategory/{node}:
 *   put:
 *     tags:
 *     - Item Category
 *     summary: Category
 *     description: Anlage einer neuen Gegenstandskategorie.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: integer
 *             example: 1
 *             descrition: ID der Gegenstandskategorie.
 *           value:
 *             type: string
 *             example: "Schwert"
 *             descrition: Name der Gegenstandskategorie
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID der Gegenstandskategorie.
 *             value:
 *               type: string
 *               example: "Schwert"
 *               descrition: Name der Gegenstandskategorie
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/itemCategory/:node", api_itemCategory_1.default);
/**
 * @swagger
 * /itemCategory/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Item Category
 *     summary: Gegenstand
 *     description: Löscht eine bestimmte Gegenstandskategorie und alle dazugehörigen Gegenstände. Jeder Held bekommt Gold in Form des Goldwertes erstattet.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/itemCategory/:node/:handle", api_itemCategory_1.default);
//#endregion
//#region Level
/**
 * @swagger
 * /level/{node}:
 *   get:
 *     tags:
 *     - Level
 *     summary: Level
 *     description: Rückgabe aller Level, die erreicht werden können.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: number
 *                 example: 1
 *                 descrition: Level
 *               experienceMin:
 *                 type: number
 *                 example: 0
 *                 descrition: Minimale Erfahrung, die für das Level gebraucht wird.
 *               experienceMax:
 *                 type: number
 *                 example: 499
 *                 descrition: Maximale Erfahrung, bis zum nächsten Level.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/level/:node", api_level_1.default);
/**
 * @swagger
 * /level/{node}/{experience}:
 *   get:
 *     tags:
 *     - Level
 *     summary: Level
 *     description: Rückgabe des Levels, das zu den Erfahrungspunkten passt.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "experience"
 *       in: "path"
 *       description: "Erfahrungspunkte"
 *       required: true
 *       type: "string"
 *       default: "10000"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: number
 *                 example: 1
 *                 descrition: Level
 *               experienceMin:
 *                 type: number
 *                 example: 0
 *                 descrition: Minimale Erfahrung, die für das Level gebraucht wird.
 *               experienceMax:
 *                 type: number
 *                 example: 499
 *                 descrition: Maximale Erfahrung, bis zum nächsten Level.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/level/:node/:experience", api_level_1.default);
//#endregion
//#region Location
/**
 * @swagger
 * /location/{node}:
 *   get:
 *     tags:
 *     - Location
 *     summary: Dungeon
 *     description: Rückgabe aller Dungeons.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Dungeons
 *               name:
 *                 type: string
 *                 example: "Verlassene Höhle"
 *                 descrition: Name des Dungeons
 *               description:
 *                 type: string
 *                 example: "Eine einsame, dunkle, verlassene Höhle. Mehr als Ratten wirst du hier sicher nicht antreffen, oder?"
 *                 descrition: Beschreibung des Dungeons
 *               difficulty:
 *                 type: integer
 *                 example: 1
 *                 descrition: Schwierigkeit des Dungeons.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *               category:
 *                 type: object
 *                 properties:
 *                   handle:
 *                     type: intener
 *                     example: 1
 *                     descrition: ID der Item Kategorie.
 *                   value:
 *                     type: string
 *                     example: "default"
 *                     descrition: Name  für die Übersetzung der Item Kategorie.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/location/:node", api_location_1.default);
/**
 * @swagger
 * /location/{node}/active:
 *   get:
 *     tags:
 *     - Location
 *     summary: Dungeon
 *     description: Rückgabe aller aktiven Dungeons.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: integer
 *                 example: 1
 *                 descrition: ID des Dungeons
 *               name:
 *                 type: string
 *                 example: "Verlassene Höhle"
 *                 descrition: Name des Dungeons
 *               description:
 *                 type: string
 *                 example: "Eine einsame, dunkle, verlassene Höhle. Mehr als Ratten wirst du hier sicher nicht antreffen, oder?"
 *                 descrition: Beschreibung des Dungeons
 *               difficulty:
 *                 type: integer
 *                 example: 1
 *                 descrition: Schwierigkeit des Dungeons.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *               category:
 *                 type: object
 *                 properties:
 *                   handle:
 *                     type: intener
 *                     example: 1
 *                     descrition: ID der Item Kategorie.
 *                   value:
 *                     type: string
 *                     example: "default"
 *                     descrition: Name  für die Übersetzung der Item Kategorie.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/location/:node/active", api_location_1.default);
/**
 * @swagger
 * /location/{node}:
 *   put:
 *     tags:
 *     - Location
 *     summary: Dungeon
 *     description: Anlage eines neuen Dungeons.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: integer
 *             example: 1
 *             descrition: ID des Dungeons
 *           name:
 *             type: string
 *             example: "Verlassene Höhle"
 *             descrition: Name des Dungeons
 *           description:
 *             type: string
 *             example: "Eine einsame, dunkle, verlassene Höhle. Mehr als Ratten wirst du hier sicher nicht antreffen, oder?"
 *             descrition: Beschreibung des Dungeons
 *           difficulty:
 *             type: integer
 *             example: 1
 *             descrition: Schwierigkeit des Dungeons.
 *           isActive:
 *             type: boolean
 *             example: true
 *             descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: integer
 *               example: 1
 *               descrition: ID des Dungeons
 *             name:
 *               type: string
 *               example: "Verlassene Höhle"
 *               descrition: Name des Dungeons
 *             description:
 *               type: string
 *               example: "Eine einsame, dunkle, verlassene Höhle. Mehr als Ratten wirst du hier sicher nicht antreffen, oder?"
 *               descrition: Beschreibung des Dungeons
 *             difficulty:
 *               type: integer
 *               example: 1
 *               descrition: Schwierigkeit des Dungeons.
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Gibt an ob das Dungeon gerade gelootet werden kann.
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/location/:node", api_location_1.default);
/**
 * @swagger
 * /location/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Location
 *     summary: Dungeon
 *     description: Löscht ein bestimmtes Dungeon.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Dungeons"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/location/:node/:handle", api_location_1.default);
//#endregion
//#region Loot
/**
 * @swagger
 * /loot/{node}:
 *   get:
 *     tags:
 *     - Loot
 *     summary: Befehle
 *     description: Rückgabe aller Befehle.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Eindeutiger Name des Commands
 *               minutes:
 *                 type: number
 *                 example: 60
 *                 descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an, ob der Command aktiviert ist.
 *               delay:
 *                 type: number
 *                 example: 5
 *                 descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *               countUses:
 *                 type: number
 *                 example: 10
 *                 descrition: Anzahl, wie oft der Befehl manuell verwendet wurde.
 *               countRuns:
 *                 type: number
 *                 example: 10
 *                 descrition: Anzahl, wie oft der Befehl automatisch getriggert wurde.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/loot/:node", api_loot_1.default);
/**
 * @swagger
 * /loot/{node}:
 *   put:
 *     tags:
 *     - Loot
 *     summary: Befehle
 *     description: Bearbeitung / Anlage eines neuen Befehls. Die Änderungen werden direkt im Stream wirksam.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           command:
 *             type: string
 *             example: "craffel"
 *             descrition: Eindeutiger Name des Commands
 *           minutes:
 *             type: number
 *             example: 60
 *             descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *           isActive:
 *             type: boolean
 *             example: true
 *             descrition: Gibt an, ob der Command aktiviert ist.
 *           delay:
 *             type: number
 *             example: 5
 *             descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             command:
 *               type: string
 *               example: "craffel"
 *               descrition: Eindeutiger Name des Commands
 *             minutes:
 *               type: number
 *               example: 60
 *               descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Gibt an, ob der Command aktiviert ist.
 *             delay:
 *               type: number
 *               example: 5
 *               descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *       404:
 *         description: no data
 */
router.put("/loot/:node", api_loot_1.default);
/**
 * @swagger
 * /loot/{node}/{command}:
 *   delete:
 *     tags:
 *     - Loot
 *     summary: Befehle
 *     description: Löscht einen bestimmten Befehl.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "command"
 *       in: "path"
 *       description: "Name des Befehls"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/loot/:node/:command", api_loot_1.default);
//#endregion
//#region Menu
/**
 * @swagger
 * /menu:
 *   get:
 *     tags:
 *     - Menu
 *     summary: Menu
 *     description: Rückgabe aller Menüeinträge.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               endpoint:
 *                 type: string
 *                 example: "twitch"
 *                 descrition: URL des Menüeintrags
 *               name:
 *                 type: string
 *                 example: "Anmelden"
 *                 descrition: Anzeigename des Menüeintrags
 *               order:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Anzeigereihenfolge des Menüs
 *               authenticationRequired:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob diese Seiten erhöhte Berechtigungen benötigen.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/menu", api_menu_1.default);
//#endregion
//#region Migration
/**
 * @swagger
 * /migration:
 *   get:
 *     tags:
 *     - Migration
 *     summary: Migration
 *     description: Rückgabe alles Migration des Servers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Update_001"
 *                 descrition: Name des Migration-Skripts
 *               isInstalled:
 *                 type: boolean
 *                 example: true
 *                 descrition: Status des Skripts
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/migration", api_migration_1.default);
//#endregion
//#region Node
/**
 * @swagger
 * /node:
 *   get:
 *     tags:
 *     - Node
 *     summary: Server Node
 *     description: Rückgabe aller Server Nodes aller Streamer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "1.0.0"
 *                 descrition: Name des Nodes
 *               displayName:
 *                 type: string
 *                 example: "1.0.0"
 *                 descrition: Anzeigename des Nodes
 *               language:
 *                 type: string
 *                 example: "de-DE"
 *                 descrition: Standard Sprache des Nodes
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Aktivitätsstatus
 *               endpoint:
 *                 type: string
 *                 example: "/"
 *                 descrition: Endpunkt
 *               twitchUser:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "440371621"
 *                     descrition: Twitch Benutzer-ID
 *                   login:
 *                     type: string
 *                     example: "craffel"
 *                     descrition: Twitch Loginname
 *                   display_name:
 *                     type: string
 *                     example: "craffel"
 *                     descrition: Twitch Anzeigename
 *                   type:
 *                     type: string
 *                     example: ""
 *                     descrition: Twitch Accounttyp
 *                   broadcaster_type:
 *                     type: string
 *                     example: "affiliate"
 *                     descrition: Twitch Streamer-Typ
 *                   description:
 *                     type: string
 *                     example: "Ich bin ein Streamer"
 *                     descrition: Twitch Beschreibung
 *                   profile_image_url:
 *                     type: string
 *                     example: "https://static-cdn.jtvnw.net/jtv_user_pictures/77498aca-4c52-4d13-9ede-9a99a1d88d64-profile_image-300x300.png"
 *                     descrition: Twitch Profilbild
 *                   offline_image_url:
 *                     type: string
 *                     example: ""
 *                     descrition: Twitch Offline-Profilbild
 *                   view_count:
 *                     type: string
 *                     example: "21997"
 *                     descrition: Anzahl einzigartiger Twitch Aufrufe
 *                   email:
 *                     type: string
 *                     example: "max.mustermann@mail.de"
 *                     descrition: Twitch E-Mail Adresse
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/node", api_node_1.default);
/**
 * @swagger
 * /node/live:
 *   get:
 *     tags:
 *     - Node
 *     summary: Server Node
 *     description: Rückgabe aller Server Nodes aller Streamer, die gerade live und aktiv sind.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "1.0.0"
 *                 descrition: Name des Nodes
 *               displayName:
 *                 type: string
 *                 example: "1.0.0"
 *                 descrition: Anzeigename des Nodes
 *               language:
 *                 type: string
 *                 example: "de-DE"
 *                 descrition: Standard Sprache des Nodes
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Aktivitätsstatus
 *               endpoint:
 *                 type: string
 *                 example: "/"
 *                 descrition: Endpunkt
 *               twitchUser:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "440371621"
 *                     descrition: Twitch Benutzer-ID
 *                   login:
 *                     type: string
 *                     example: "craffel"
 *                     descrition: Twitch Loginname
 *                   display_name:
 *                     type: string
 *                     example: "craffel"
 *                     descrition: Twitch Anzeigename
 *                   type:
 *                     type: string
 *                     example: ""
 *                     descrition: Twitch Accounttyp
 *                   broadcaster_type:
 *                     type: string
 *                     example: "affiliate"
 *                     descrition: Twitch Streamer-Typ
 *                   description:
 *                     type: string
 *                     example: "Ich bin ein Streamer"
 *                     descrition: Twitch Beschreibung
 *                   profile_image_url:
 *                     type: string
 *                     example: "https://static-cdn.jtvnw.net/jtv_user_pictures/77498aca-4c52-4d13-9ede-9a99a1d88d64-profile_image-300x300.png"
 *                     descrition: Twitch Profilbild
 *                   offline_image_url:
 *                     type: string
 *                     example: ""
 *                     descrition: Twitch Offline-Profilbild
 *                   view_count:
 *                     type: string
 *                     example: "21997"
 *                     descrition: Anzahl einzigartiger Twitch Aufrufe
 *                   email:
 *                     type: string
 *                     example: "max.mustermann@mail.de"
 *                     descrition: Twitch E-Mail Adresse
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/node/live", api_node_1.default);
/**
 * @swagger
 * /node/default:
 *   get:
 *     tags:
 *     - Node
 *     summary: Server Node
 *     description: Rückgabe des ausgewählten Standard Server Nodes.
 *     consumes:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             node:
 *               type: string
 *               example: "craffel"
 *               descrition: Name des Nodes
 *       404:
 *         description: no data
 */
router.get("/node/default", api_node_1.default);
/**
 * @swagger
 * /node/default:
 *   post:
 *     tags:
 *     - Node
 *     summary: Server Node
 *     description: Auswahl des Server Standard Nodes.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "query"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             node:
 *               type: string
 *               example: "craffel"
 *               descrition: Name des Nodes
 */
router.post("/node/default", api_node_1.default);
//#endregion
//#region Placeholder
/**
 * @swagger
 * /placeholder:
 *   get:
 *     tags:
 *     - Placeholder
 *     summary: Platzhalter
 *     description: Rückgabe aller Platzhalter.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "$source"
 *                 descrition: Platzhalter
 *               translation:
 *                 type: string
 *                 example: "source"
 *                 descrition: Übersetzungsschlüssel des Platzhalters.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               isCounter:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob der Platzhalter nur für Counter existiert.
 *               isShoutout:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob der Platzhalter nur für ShoutOut-Funktionen existiert.
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/placeholder", api_placeholder_1.default);
//#endregion
//#region Promotion
/**
 * @swagger
 * /promotion/{node}:
 *   get:
 *     tags:
 *     - Promotion
 *     summary: Promo-Codes
 *     description: Rückgabe aller Promo-Codes Aufgaben.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "NewStart"
 *                 descrition: ID des Promo-Codes
 *               gold:
 *                 type: integer
 *                 example: "1000"
 *                 descrition: Anzahl der Goldbelohnung
 *               diamond:
 *                 type: integer
 *                 example: "100"
 *                 descrition: Anzahl der Diamantbelohnung
 *               experience:
 *                 type: integer
 *                 example: "1000"
 *                 descrition: Anzahl der Erfahrungsbelohnung
 *               item:
 *                 type: integer
 *                 example: "1"
 *                 descrition: ID des Gegenstands der Gegenstandsbelohnung
 *               isMaster:
 *                 type: boolean
 *                 example: false
 *                 descrition: Angabe, ob nur der Streamer den Code auslösen darf
 *               validFrom:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Gültigkeit Startdatum
 *               validTo:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Gültigkeit Enddatum
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/promotion/:node", api_promotion_1.default);
/**
 * @swagger
 * /promotion/{node}:
 *   put:
 *     tags:
 *     - Promotion
 *     summary: Promotion Aufgabe
 *     description: Anlage eines neuen Promo-Codes
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: string
 *             example: "NewStart"
 *             descrition: ID des Promo-Codes
 *           gold:
 *             type: integer
 *             example: "1000"
 *             descrition: Anzahl der Goldbelohnung
 *           diamond:
 *             type: integer
 *             example: "100"
 *             descrition: Anzahl der Diamantbelohnung
 *           experience:
 *             type: integer
 *             example: "1000"
 *             descrition: Anzahl der Erfahrungsbelohnung
 *           item:
 *             type: integer
 *             example: "1"
 *             descrition: ID des Gegenstands der Gegenstandsbelohnung
 *           isMaster:
 *             type: boolean
 *             example: false
 *             descrition: Angabe, ob nur der Streamer den Code auslösen darf
 *           validFrom:
 *             type: string
 *             example: "2022-05-12 10:11:35.027 +00:00"
 *             descrition: Gültigkeit Startdatum
 *           validTo:
 *             type: string
 *             example: "2022-05-12 10:11:35.027 +00:00"
 *             descrition: Gültigkeit Enddatum
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: "NewStart"
 *               descrition: ID des Promo-Codes
 *             gold:
 *               type: integer
 *               example: "1000"
 *               descrition: Anzahl der Goldbelohnung
 *             diamond:
 *               type: integer
 *               example: "100"
 *               descrition: Anzahl der Diamantbelohnung
 *             experience:
 *               type: integer
 *               example: "1000"
 *               descrition: Anzahl der Erfahrungsbelohnung
 *             item:
 *               type: integer
 *               example: "1"
 *               descrition: ID des Gegenstands der Gegenstandsbelohnung
 *             isMaster:
 *               type: boolean
 *               example: false
 *               descrition: Angabe, ob nur der Streamer den Code auslösen darf
 *             validFrom:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Gültigkeit Startdatum
 *             validTo:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Gültigkeit Enddatum
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/promotion/:node", api_promotion_1.default);
/**
 * @swagger
 * /promotion/{node}/redeem/{promotionHandle}/{heroName}:
 *   post:
 *     tags:
 *     - Promotion
 *     summary: Promotion Aufgabe
 *     description: Anlage eines neuen Promo-Codes
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "promotionHandle"
 *       in: "path"
 *       description: "ID des Promo-Codes"
 *       required: true
 *       type: "string"
 *       default: "BluescreenCommunity"
 *     - name: "heroName"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: "NewStart"
 *               descrition: ID des Promo-Codes
 *             gold:
 *               type: integer
 *               example: "1000"
 *               descrition: Anzahl der Goldbelohnung
 *             diamond:
 *               type: integer
 *               example: "100"
 *               descrition: Anzahl der Diamantbelohnung
 *             experience:
 *               type: integer
 *               example: "1000"
 *               descrition: Anzahl der Erfahrungsbelohnung
 *             item:
 *               type: integer
 *               example: "1"
 *               descrition: ID des Gegenstands der Gegenstandsbelohnung
 *             isMaster:
 *               type: boolean
 *               example: false
 *               descrition: Angabe, ob nur der Streamer den Code auslösen darf
 *             validFrom:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Gültigkeit Startdatum
 *             validTo:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Gültigkeit Enddatum
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.post("/promotion/:node/redeem/:promotionHandle/:heroName", api_promotion_1.default);
/**
 * @swagger
 * /promotion/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Promotion
 *     summary: Promotion
 *     description: Löscht einen bestimmten Promo-Code
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Promo-Codes"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/promotion/:node/:handle", api_promotion_1.default);
//#endregion
//#region Say
/**
 * @swagger
 * /say/{node}:
 *   get:
 *     tags:
 *     - Say
 *     summary: Befehle
 *     description: Rückgabe aller Befehle.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               command:
 *                 type: string
 *                 example: "craffel"
 *                 descrition: Eindeutiger Name des Commands
 *               text:
 *                 type: string
 *                 example: "Schau dir deinen Helden auf craffel.de an."
 *                 descrition: Text, der angezeigt wird, wenn der Command ausgelößt wurde.
 *               minutes:
 *                 type: number
 *                 example: 60
 *                 descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *               help:
 *                 type: string
 *                 example: ""
 *                 descrition: Hilfetext, für die Zuschauer.
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 descrition: Gibt an, ob der Command aktiviert ist.
 *               isCounter:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob der Command einen Counter besitzt.
 *               isShoutout:
 *                 type: boolean
 *                 example: false
 *                 descrition: Gibt an, ob der Command ShoutOut-Funktionen besitzt.
 *               lastRun:
 *                 type: boolean
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Gibt an, wann der Command zuletzt ausgeführt wurde.
 *               delay:
 *                 type: number
 *                 example: 5
 *                 descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *               countUses:
 *                 type: number
 *                 example: 10
 *                 descrition: Anzahl, wie oft der Befehl manuell verwendet wurde.
 *               countRuns:
 *                 type: number
 *                 example: 10
 *                 descrition: Anzahl, wie oft der Befehl automatisch getriggert wurde.
 *       404:
 *         description: no data
 */
router.get("/say/:node", api_say_1.default);
/**
 * @swagger
 * /say/{node}:
 *   put:
 *     tags:
 *     - Say
 *     summary: Befehle
 *     description: Bearbeitung / Anlage eines neuen Befehls. Die Änderungen werden direkt im Stream wirksam.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           command:
 *             type: string
 *             example: "craffel"
 *             descrition: Eindeutiger Name des Commands
 *           text:
 *             type: string
 *             example: "Schau dir deinen Helden auf craffel.de an."
 *             descrition: Text, der angezeigt wird, wenn der Command ausgelößt wurde.
 *           minutes:
 *             type: number
 *             example: 60
 *             descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *           help:
 *             type: string
 *             example: ""
 *             descrition: Hilfetext, für die Zuschauer.
 *           isActive:
 *             type: boolean
 *             example: true
 *             descrition: Gibt an, ob der Command aktiviert ist.
 *           isCounter:
 *             type: boolean
 *             example: false
 *             descrition: Gibt an, ob der Command einen Counter besitzt.
 *           isShoutout:
 *             type: boolean
 *             example: false
 *             descrition: Gibt an, ob der Command ShoutOut-Funktionen besitzt.
 *           delay:
 *             type: number
 *             example: 5
 *             descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             command:
 *               type: string
 *               example: "craffel"
 *               descrition: Eindeutiger Name des Commands
 *             text:
 *               type: string
 *               example: "Schau dir deinen Helden auf craffel.de an."
 *               descrition: Text, der angezeigt wird, wenn der Command ausgelößt wurde.
 *             minutes:
 *               type: number
 *               example: 60
 *               descrition: Intervall, um den Text automatisch anzuzeigen (Default 0).
 *             help:
 *               type: string
 *               example: ""
 *               descrition: Hilfetext, für die Zuschauer.
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Gibt an, ob der Command aktiviert ist.
 *             isCounter:
 *               type: boolean
 *               example: false
 *               descrition: Gibt an, ob der Command einen Counter besitzt.
 *             isShoutout:
 *               type: boolean
 *               example: false
 *               descrition: Gibt an, ob der Command ShoutOut-Funktionen besitzt.
 *             delay:
 *               type: number
 *               example: 5
 *               descrition: Gibt an, wie viele reale Nachrichten zwischen wiederholten automatischen Ausgaben liegen muss.
 *       404:
 *         description: no data
 */
router.put("/say/:node", api_say_1.default);
/**
 * @swagger
 * /say/{node}/{command}:
 *   delete:
 *     tags:
 *     - Say
 *     summary: Befehle
 *     description: Löscht einen bestimmten Befehl.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "command"
 *       in: "path"
 *       description: "Name des Befehls"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/say/:node/:command", api_say_1.default);
//#endregion
//#region State Storage
/**
 * @swagger
 * /stateStorage:
 *   get:
 *     tags:
 *     - StateStorage
 *     summary: Tabellenkonfiguarationen
 *     description: Rückgabe aller Tabellenkonfiguarationen des angemeldeten Benutzers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: 'heroes'
 *               name:
 *                 type: string
 *                 example: 'Aktive Helden'
 *               storage:
 *                 type: string
 *                 example: ''
 *               channelName:
 *                 type: string
 *                 example: 'craffel'
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/stateStorage", api_stateStorage_1.default);
/**
 * @swagger
 * /stateStorage/{name}:
 *   get:
 *     tags:
 *     - StateStorage
 *     summary: Tabellenkonfiguarationen
 *     description: Rückgabe der Tabellenkonfiguaration einer Tabelle des angemeldeten Benutzers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "name"
 *       in: "path"
 *       description: "Seite für die Übersetzungen."
 *       required: true
 *       default: "heroes"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: 'heroes'
 *               name:
 *                 type: string
 *                 example: 'Aktive Helden'
 *               storage:
 *                 type: string
 *                 example: ''
 *               channelName:
 *                 type: string
 *                 example: 'craffel'
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/stateStorage/:name", api_stateStorage_1.default);
/**
 * @swagger
 * /stateStorage/:
 *   put:
 *     tags:
 *     - StateStorage
 *     summary: Tabellenkonfiguarationen
 *     description: Anlage einer neuen Tabellenkonfiguaration des angemeldeten Benutzers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: string
 *             example: 'heroes'
 *           name:
 *             type: string
 *             example: 'Aktive Helden'
 *           storage:
 *             type: string
 *             example: ''
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: 'heroes'
 *             name:
 *               type: string
 *               example: 'Aktive Helden'
 *             storage:
 *               type: string
 *               example: ''
 *             channelName:
 *               type: string
 *               example: 'craffel'
 *       404:
 *         description: no data
 */
router.put("/stateStorage", api_stateStorage_1.default);
/**
 * @swagger
 * /stateStorage/{name}:
 *   delete:
 *     tags:
 *     - StateStorage
 *     summary: Tabellenkonfiguarationen
 *     description: Löschen der Tabellenkonfiguaration einer Tabelle des angemeldeten Benutzers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "name"
 *       in: "path"
 *       description: "Seite für die Übersetzungen."
 *       required: true
 *       default: "heroes"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/stateStorage/:name", api_stateStorage_1.default);
//#endregion
//#region Trainer
/**
 * @swagger
 * /trainer/{node}:
 *   get:
 *     tags:
 *     - Trainer
 *     summary: Trainer
 *     description: Rückgabe aller Trainer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "gold"
 *                 descrition: ID des Gegenstands
 *               value:
 *                 type: string
 *                 example: "Goldenes Händchen"
 *                 descrition: Name des Trainers
 *               description:
 *                 type: string
 *                 example: "Steigert den Bonus für Goldfund."
 *                 descrition: Beschreibung des Trainers
 *               gold:
 *                 type: integer
 *                 example: 150
 *                 descrition: Kosten des Trainers in Gold
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/trainer/:node", api_trainer_1.default);
/**
 * @swagger
 * /trainer/{node}:
 *   put:
 *     tags:
 *     - Trainer
 *     summary: Trainer
 *     description: Anlage eines neuen Trainers.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "item"
 *       in: "body"
 *       schema:
 *         type: object
 *         properties:
 *           handle:
 *             type: string
 *             example: "gold"
 *             descrition: ID des Gegenstands
 *           value:
 *             type: string
 *             example: "Goldenes Händchen"
 *             descrition: Name des Trainers
 *           description:
 *             type: string
 *             example: "Steigert den Bonus für Goldfund."
 *             descrition: Beschreibung des Trainers
 *           gold:
 *             type: integer
 *             example: 150
 *             descrition: Kosten des Trainers in Gold
 *     responses:
 *       201:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             handle:
 *               type: string
 *               example: "gold"
 *               descrition: ID des Gegenstands
 *             value:
 *               type: string
 *               example: "Goldenes Händchen"
 *               descrition: Name des Trainers
 *             description:
 *               type: string
 *               example: "Steigert den Bonus für Goldfund."
 *               descrition: Beschreibung des Trainers
 *             gold:
 *               type: integer
 *               example: 150
 *               descrition: Kosten des Trainers in Gold
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.put("/trainer/:node", api_trainer_1.default);
/**
 * @swagger
 * /trainer/{node}/{handle}:
 *   delete:
 *     tags:
 *     - Trainer
 *     summary: Trainer
 *     description: Löscht einen bestimmten Trainer.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Gegenstands"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     responses:
 *       204:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.delete("/trainer/:node/:handle", api_trainer_1.default);
/**
 * @swagger
 * /trainer/{node}/training/{handle}/hero/{name}:
 *   post:
 *     tags:
 *     - Trainer
 *     summary: Trainer
 *     description: Erhöht den Trait, wenn genügend Gold vorhanden ist.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
 *     - name: "handle"
 *       in: "path"
 *       description: "ID des Trainers"
 *       required: true
 *       type: "string"
 *       default: "gold"
 *     - name: "name"
 *       in: "path"
 *       description: "Name des Helden"
 *       required: true
 *       type: "string"
 *       default: "craffel"
 *     responses:
 *       200:
 *         description: successful operation
 *       403:
 *         description: no permission
 *       404:
 *         description: no data
 */
router.post("/trainer/:node/training/:handle/hero/:name", api_trainer_1.default);
//#endregion
//#region Translation
/**
 * @swagger
 * /translation?language={language}:
 *   get:
 *     tags:
 *     - Translation
 *     summary: Übersetzungen
 *     description: Rückgabe aller Übersetzungen.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "language"
 *       in: "path"
 *       description: "Sprache für die Übersetzung."
 *       required: true
 *       default: "de-DE"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "navigation"
 *                 descrition: ID der Übersetzung
 *               page:
 *                 type: string
 *                 example: "navigtion"
 *                 descrition: Seite der Übersetzung
 *               language:
 *                 type: string
 *                 example: "de-De"
 *                 descrition: Sprache der Übersetzung
 *               translation:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Übersetzung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/translation", api_translation_1.default);
/**
 * @swagger
 * /translation/{page}?language={language}:
 *   get:
 *     tags:
 *     - Translation
 *     summary: Übersetzungen
 *     description: Rückgabe aller Übersetzungen einer Seite.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "page"
 *       in: "path"
 *       description: "Seite für die Übersetzungen."
 *       required: true
 *       default: "navigation"
 *     - name: "language"
 *       in: "path"
 *       description: "Sprache für die Übersetzung."
 *       required: true
 *       default: "de-DE"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "navigation"
 *                 descrition: ID der Übersetzung
 *               page:
 *                 type: string
 *                 example: "navigtion"
 *                 descrition: Seite der Übersetzung
 *               language:
 *                 type: string
 *                 example: "de-De"
 *                 descrition: Sprache der Übersetzung
 *               translation:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Übersetzung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/translation/:page", api_translation_1.default);
/**
 * @swagger
 * /translation?language={language}:
 *   post:
 *     tags:
 *     - Translation
 *     summary: Übersetzungen
 *     description: Rückgabe aller Übersetzungen.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "language"
 *       in: "path"
 *       description: "Sprache für die Übersetzung."
 *       required: true
 *       default: "de-DE"
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     - name: 'Body'
 *       in: 'body'
 *       required: true
 *       schema:
 *         type: object
 *         properties:
 *           pages:
 *             type: array
 *             items:
 *               type: string
 *               example: 'hero'
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               handle:
 *                 type: string
 *                 example: "navigation"
 *                 descrition: ID der Übersetzung
 *               page:
 *                 type: string
 *                 example: "navigtion"
 *                 descrition: Seite der Übersetzung
 *               language:
 *                 type: string
 *                 example: "de-De"
 *                 descrition: Sprache der Übersetzung
 *               translation:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Übersetzung
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.post("/translation", api_translation_1.default);
//#endregion
//#region Twitch
/**
 * @swagger
 * /twitch:
 *   get:
 *     tags:
 *     - Twitch
 *     summary: Twitch URL
 *     description: Rückgabe der Twitch URL.
 *     consumes:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               example: "https://id.twitch.tv/oauth2/authorize?client_id=A&redirect_uri=B&response_type=C&scope=D&state=E"
 *               descrition: Twitch URL zur Anmeldung
 *       404:
 *         description: no data
 */
router.get("/twitch", api_twitch_1.default);
/**
 * @swagger
 * /twitch/userdata:
 *   get:
 *     tags:
 *     - Twitch
 *     summary: Twitch Anmeldedaten.
 *     description: Rückgabe der Twitch Anmeldedaten, nachdem die Anmeldung erfolgreich durchgeführt wurde.
 *     consumes:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               example: "440371621"
 *               descrition: Twitch Benutzer-ID
 *             login:
 *               type: string
 *               example: "craffel"
 *               descrition: Twitch Loginname
 *             display_name:
 *               type: string
 *               example: "craffel"
 *               descrition: Twitch Anzeigename
 *             type:
 *               type: string
 *               example: ""
 *               descrition: Twitch Accounttyp
 *             broadcaster_type:
 *               type: string
 *               example: "affiliate"
 *               descrition: Twitch Streamer-Typ
 *             description:
 *               type: string
 *               example: "Ich bin ein Streamer"
 *               descrition: Twitch Beschreibung
 *             profile_image_url:
 *               type: string
 *               example: "https://static-cdn.jtvnw.net/jtv_user_pictures/77498aca-4c52-4d13-9ede-9a99a1d88d64-profile_image-300x300.png"
 *               descrition: Twitch Profilbild
 *             offline_image_url:
 *               type: string
 *               example: ""
 *               descrition: Twitch Offline-Profilbild
 *             view_count:
 *               type: string
 *               example: "21997"
 *               descrition: Anzahl einzigartiger Twitch Aufrufe
 *             email:
 *               type: string
 *               example: "max.mustermann@mail.de"
 *               descrition: Twitch E-Mail Adresse
 *             created_at:
 *               type: string
 *               example: "2019-06-07T18:38:13Z"
 *               descrition: Twitch Account-Erstellungsdatum
 *       404:
 *         description: no data
 */
router.get("/twitch/userdata", api_twitch_1.default);
/**
 * @swagger
 * /twitch:
 *   post:
 *     tags:
 *     - Twitch
 *     summary: Registrierung neuer Streamer
 *     description: Registrierung des angemeldeten Streamer.
 *     consumes:
 *     - application/json
 *     responses:
 *       200:
 *         description: successful operation
 *       404:
 *         description: no data
 */
router.post("/twitch", api_twitch_1.default);
//#endregion
//#region Validation
/**
 * @swagger
 * /validation:
 *   get:
 *     tags:
 *     - Validation
 *     summary: Validierungen
 *     description: Rückgabe aller Validierungen.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "childs"
 *       in: "query"
 *       description: "Untergeordnete Daten laden, wenn vorhanden"
 *       required: false
 *       type: "boolean"
 *       default: true
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               page:
 *                 type: string
 *                 example: "promotion"
 *                 descrition: Name der Seite
 *               handle:
 *                 type: string
 *                 example: "navigtion"
 *                 descrition: ID der Validation
 *               min:
 *                 type: integer
 *                 example: 0
 *                 descrition: Erlaubter Minimalwert
 *               max:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Erlaubter Minimalwert
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/validation", api_validation_1.default);
/**
 * @swagger
 * /validation/{page}:
 *   get:
 *     tags:
 *     - Validation
 *     summary: Validierungen
 *     description: Rückgabe aller Validierungen einer Seite
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "page"
 *       in: "path"
 *       description: "Name der Seite"
 *       required: true
 *       default: "navigation"
 *     - name: "language"
 *       in: "path"
 *       description: "Sprache für die Übersetzung."
 *       required: true
 *       default: "de-DE"
 *     responses:
 *       200:
 *         description: successful operation
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               page:
 *                 type: string
 *                 example: "promotion"
 *                 descrition: Name der Seite
 *               handle:
 *                 type: string
 *                 example: "navigtion"
 *                 descrition: ID der Validation
 *               min:
 *                 type: integer
 *                 example: 0
 *                 descrition: Erlaubter Minimalwert
 *               max:
 *                 type: integer
 *                 example: 1000
 *                 descrition: Erlaubter Minimalwert
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/validation/:page", api_validation_1.default);
//#endregion
//#region Version
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
 *               example: "1.0.0"
 *               descrition: Aktuelle Versionsnummer der Anwendung
 *             createdAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der Anlage
 *             updatedAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der letzten Änderung
 *       404:
 *         description: no data
 */
router.get("/version", api_version_1.default);
//#endregion
// documentation endpoint for Swagger
router.use('/', swaggerUi.serve, swaggerUi.setup(specs.default));
exports.default = router;
//# sourceMappingURL=api.js.map