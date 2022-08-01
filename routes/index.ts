import "reflect-metadata";

import * as express from 'express';

import help from "./help";
import streamer from "./streamer";
import twitch from "./twitch";

const endpoint = 'index';
const type = 'app';

const router = express.Router();

// Help
router.get('/help', help);

// Streamer
router.get('/streamer', streamer);

// Twitch
router.get('/twitch', twitch);

// index
router.get('/', (request: express.Request, response: express.Response) => {
    response.render(endpoint, {
        title: 'Social Adventure'
    });
});

export default router;