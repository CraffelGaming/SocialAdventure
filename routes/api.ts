import * as express from 'express';

import swaggerUi = require('swagger-ui-express');
import * as specs from '../swagger';

import version from "./api/api.version";
import node from "./api/api.node";
import menu from "./api/api.menu";
import migration from "./api/api.migration";
import translation from "./api/api.translation";
import twitch from "./api/api.twitch";
import level from "./api/api.level";
import say from "./api/api.say";
import hero from "./api/api.hero";
import herowallet from "./api/api.heroWallet";
import herotrait from "./api/api.heroTrait";
import heroinventory from "./api/api.heroInventory";
import item from "./api/api.item";

const router = express.Router();

//#region Hero Inventory
/**
 * @swagger
 * /heroinventory/{node}:
 *   get:
 *     tags:
 *     - heroinventory
 *     summary: Hero Inventory
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
 */
 router.get("/heroinventory/:node", heroinventory);

/**
 * @swagger
 * /heroinventory/{node}/hero/{name}:
 *   get:
 *     tags:
 *     - heroinventory
 *     summary: Hero Inventory
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
 */
  router.get("/heroinventory/:node/hero/:name", heroinventory);
//#endregion

//#region Item
/**
 * @swagger
 * /item/{node}:
 *   get:
 *     tags:
 *     - Item
 *     summary: Item
 *     description: Rückgabe aller Gegenst&auml;nde.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
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
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 */
 router.get("/item/:node", item);
//#endregion

//#region Hero Trait
/**
 * @swagger
 * /herotrait/{node}:
 *   get:
 *     tags:
 *     - Hero Trait
 *     summary: Hero Eigenschaften
 *     description: Rückgabe aller Eigenschaften.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
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
 */
 router.get("/herotrait/:node", herotrait);
//#endregion

//#region Hero Wallet
/**
 * @swagger
 * /herowallet/{node}:
 *   get:
 *     tags:
 *     - Hero Wallet
 *     summary: Hero Geldtasche
 *     description: Rückgabe aller Geldtaschen.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
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
 */
 router.get("/herowallet/:node", herowallet);
//#endregion

//#region Hero
/**
 * @swagger
 * /hero/{node}:
 *   get:
 *     tags:
 *     - Hero
 *     summary: Hero
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
 */
 router.get("/hero/:node", hero);
//#endregion

//#region Say
/**
 * @swagger
 * /say/{node}:
 *   get:
 *     tags:
 *     - Say
 *     summary: Say
 *     description: Rückgabe aller Commands.
 *     consumes:
 *     - application/json
 *     parameters:
 *     - name: "node"
 *       in: "path"
 *       description: "Node / Channel"
 *       required: true
 *       type: "string"
 *       default: "default"
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
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 */
 router.get("/say/:node", say);
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
 */
 router.get("/level/:node", level);
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
 */
 router.get("/twitch", twitch);
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
 */
 router.get("/version", version);
//#endregion

//#region Node
/**
 * @swagger
 * /node:
 *   get:
 *     tags:
 *     - Node
 *     summary: Node
 *     description: Rückgabe alles Nodes des Servers.
 *     consumes:
 *     - application/json
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
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 */
 router.get("/node", node);

/**
 * @swagger
 * /node/default:
 *   get:
 *     tags:
 *     - Node
 *     summary: Node
 *     description: Rückgabe des ausgewählten Standard Nodes.
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
 */
router.get("/node/default", node);

/**
 * @swagger
 * /node/default:
 *   post:
 *     tags:
 *     - Node
 *     summary: Node
 *     description: Auswahl des Standard Nodes.
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
router.post("/node/default", node);
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
 */
 router.get("/migration", migration);
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
 *               createdAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der Anlage
 *               updatedAt:
 *                 type: string
 *                 example: "2022-05-12 10:11:35.027 +00:00"
 *                 descrition: Datum der letzten Änderung
 */
 router.get("/menu", menu);
//#endregion

//#region Translation
/**
 * @swagger
 * /translation?language={language}:
 *   get:
 *     tags:
 *     - Translation
 *     summary: Translation
 *     description: Rückgabe aller Übersetzungen.
 *     consumes:
 *     - application/json
 *     parameters:
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
 */
router.get("/translation", translation);

/**
 * @swagger
 * /translation/{page}?language={language}:
 *   get:
 *     tags:
 *     - Translation
 *     summary: Translation
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
 */
 router.get("/translation/:page", translation);
//#endregion

// documentation endpoint for Swagger
router.use('/', swaggerUi.serve, swaggerUi.setup(specs.default));

export default router;