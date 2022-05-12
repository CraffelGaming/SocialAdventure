import * as express from 'express';

import swaggerUi = require('swagger-ui-express');
import * as specs from '../swagger';

import version from "./api/api.version";
import node from "./api/api.node";

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
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: "1.0.0"
 *               descrition: Name des Nodes
 *             displayName:
 *               type: string
 *               example: "1.0.0"
 *               descrition: Anzeigename des Nodes
 *             language:
 *               type: string
 *               example: "de-DE"
 *               descrition: Standard Sprache des Nodes
 *             isActive:
 *               type: boolean
 *               example: true
 *               descrition: Aktivitätsstatus
 *             createdAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der Anlage
 *             updatedAt:
 *               type: string
 *               example: "2022-05-12 10:11:35.027 +00:00"
 *               descrition: Datum der letzten Änderung
 */
 router.get("/node", node);

// documentation endpoint for Swagger
router.use('/', swaggerUi.serve, swaggerUi.setup(specs.default));

export default router;