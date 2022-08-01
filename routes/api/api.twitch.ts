import * as express from 'express';
import uniqid = require('uniqid');

const router = express.Router();
const endpoint = 'twitch';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);

    const twitch = request.app.get('twitch');
    if(!request.session.state)
        request.session.state = uniqid();

    response.status(200).json({ url: twitch.url_authorize + '?client_id=' + twitch.client_id +
                                    '&redirect_uri=' + twitch.redirect_uri +
                                    '&response_type=' + twitch.response_type +
                                    '&scope=' + twitch.scope +
                                    '&state=' + request.session.state });
});

export default router;