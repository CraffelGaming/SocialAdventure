import "reflect-metadata";

import * as express from 'express';

import help from "./help";
import streamer from "./streamer";
import twitch from "./twitch";
import daily from "./daily";
import command from "./command";
import hero from "./hero";
import heroes from "./heroes";
import item from "./item";
import itemCategory from "./itemCategory";
import say from "./say";
import statistic from "./statistic";
import taverne from "./taverne";
import level from "./level";
import location from "./location";
import enemy from "./enemy";
import adventure from "./adventure";
import setting from "./setting";

const endpoint = 'index';
const type = 'app';

const router = express.Router();

// Setting
router.get('/setting', setting);

// Adventure
router.get('/adventure', adventure);

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

// Heroes
router.get('/heroes', heroes);

// Item
router.get('/item', item);

// Item Category
router.get('/itemCategory', itemCategory);

// Location
router.get('/location', location);

// Enemy
router.get('/enemy', enemy);

// Say
router.get('/say', say);

// Statistic
router.get('/statistic', statistic);

// Taverne
router.get('/taverne', taverne);

// Level
router.get('/level', level);

// index
router.get('/', async (request: express.Request, response: express.Response) => {
    if(request.query.node){
        const channel = global.worker.channels.find(x => x.node.name === request.query.node);
        if(channel) {
            request.session.node = channel.node;
        }
    }

    response.render(endpoint, {
        title: 'Social Adventure'
    });
});

export default router;