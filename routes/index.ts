import "reflect-metadata";

import * as express from 'express';

import help from "./help";

const endpoint = 'index';
const type = 'app';

const router = express.Router();

// version
router.get('/help', help);

// index
router.get('/', (req: express.Request, res: express.Response) => {
    res.render(endpoint, {
        title: 'Bluescreen Community Adventure'
    });
});

export default router;