import * as express from 'express';
import uniqid = require('uniqid');
import { NodeItem } from '../../model/nodeItem';

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

router.get('/' + endpoint + '/userdata', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint + '/userdata');

    if(request.session.userData != null){
        response.status(200).json(request.session.userData);
    } else response.status(404).json();
});

router.post('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('PUT ' + endpoint);

    if(request.session.userData != null){

        const node = (await global.worker.globalDatabase.sequelize.models.node.findOrCreate({
            defaults: {
                name: request.session.userData.login,
                displayName: request.session.userData.display_name,
                endpoint: request.app.get("twitch").url_twitch + request.session.userData.login
            },
            where: { name: request.session.userData.login }
        }))[0] as any as NodeItem;

        node.type = request.session.userData.type;
        node.broadcasterType = request.session.userData.broadcaster_type;
        node.description = request.session.userData.description;
        node.profileImageUrl = request.session.userData.profile_image_url;
        node.eMail = request.session.userData.email;

        await global.worker.globalDatabase.sequelize.models.node.update(node, {where: { name: request.session.userData.login }});
        await global.worker.startNode(node);
        response.status(200).json();
    } else response.status(404).json();
});
export default router;