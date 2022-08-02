import "reflect-metadata";

import * as express from 'express';

import help from "./help";
import streamer from "./streamer";
import twitch from "./twitch";
import daily from "./daily";
import command from "./command";
import hero from "./hero";
import item from "./item";
import say from "./say";
import statistic from "./statistic";
import taverne from "./taverne";
import level from "./level";

const endpoint = 'index';
const type = 'app';

const router = express.Router();

// Help
router.get('/help', help);

// Streamer
router.get('/streamer', streamer);

// Twitch
router.get('/twitch', twitch);

// Daily
router.get('/daily', daily);

// Command
router.get('/command', command);

// Hero
router.get('/hero', hero);

// Item
router.get('/item', item);

// Say
router.get('/say', say);

// Statistic
router.get('/statistic', statistic);

// Taverne
router.get('/taverne', taverne);

// Level
router.get('/level', level);

// index
router.get('/', (request: express.Request, response: express.Response) => {
    response.render(endpoint, {
        title: 'Social Adventure'
    });
});

export default router;