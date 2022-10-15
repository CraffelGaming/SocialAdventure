import * as express from 'express';
import uniqid = require('uniqid');
import { HeroItem } from '../../model/heroItem';
import { NodeItem } from '../../model/nodeItem';
import twitchData from '../../twitch.json';

const router = express.Router();
const endpoint = 'twitch';

router.get('/' + endpoint + '/', (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}`);

    global.worker.log.trace(`twitch - session information ${request.session.id}`);
    global.worker.log.trace(`twitch - session information ${request.session.state}`);
    if(!request.session.state){
        request.session.state = uniqid();
        global.worker.log.trace(`twitch - set locale state to ${request.session.state}`);
    } else   global.worker.log.trace(`twitch - locale state is ${request.session.state}`);

    response.status(200).json({ url: twitchData.url_authorize + '?client_id=' + twitchData.client_id +
                                    '&redirect_uri=' + twitchData.redirect_uri +
                                    '&response_type=' + twitchData.response_type +
                                    '&scope=' + twitchData.scope +
                                    '&state=' + request.session.state });
});

router.get('/' + endpoint + '/userdata', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint} userdata`);

    if(request.session.userData != null){
        response.status(200).json(request.session.userData);
    } else response.status(204).json();
});

router.post('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`post ${endpoint}`);

    if(request.session.userData != null){

        const node = (await global.worker.globalDatabase.sequelize.models.node.findOrCreate({
            defaults: {
                name: request.session.userData.login,
                displayName: request.session.userData.display_name,
                endpoint: twitchData.url_twitch + request.session.userData.login,
                type: request.session.userData.type,
                broadcasterType: request.session.userData.broadcaster_type,
                description: request.session.userData.description,
                profileImageUrl: request.session.userData.profile_image_url,
                eMail: request.session.userData.email
            },
            where: { name: request.session.userData.login }
        }))[0] as any as NodeItem;

        await global.worker.globalDatabase.sequelize.models.node.update(node, {where: { name: request.session.userData.login }});
        const channel = await global.worker.startNode(node);
        await HeroItem.put({sequelize: channel.database.sequelize, element: new HeroItem(channel.node.name), onlyCreate: true});
        response.status(200).json();
    } else response.status(404).json();
});
export default router;