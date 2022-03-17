import * as express from 'express';

import swaggerUi = require('swagger-ui-express');
import * as specs from '../swagger';

import version from "./api/api.version";

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
router.get("/version", version);

// documentation endpoint for Swagger
router.use('/', swaggerUi.serve, swaggerUi.setup(specs.default));

export default router;