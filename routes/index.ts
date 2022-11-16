import "reflect-metadata";

import express from 'express';
import help from "./help.js";
import streamer from "./streamer.js";
import twitch from "./twitch.js";
import daily from "./daily.js";
import command from "./command.js";
import hero from "./hero.js";
import heroes from "./heroes.js";
import item from "./item.js";
import itemCategory from "./itemCategory.js";
import say from "./say.js";
import statistic from "./statistic.js";
import taverne from "./taverne.js";
import level from "./level.js";
import location from "./location.js";
import enemy from "./enemy.js";
import adventure from "./adventure.js";
import setting from "./setting.js";
import promotion from "./promotion.js";

const endpoint = 'index';
const type = 'app';

const router = express.Router();

// Promotion
router.get('/promotion', promotion);

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
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === request.query.node);
        if(channel) {
            request.session.node = channel.node.get();
        }
    }

    response.render(endpoint, {
        title: 'Social Adventure'
    });
});

export default router;