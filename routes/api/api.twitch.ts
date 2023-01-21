import express from 'express';
import uniqid from 'uniqid';
import { HeroItem } from '../../model/heroItem.js';
import { NodeItem } from '../../model/nodeItem.js';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Model } from 'sequelize-typescript';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const twitchData = JSON.parse(fs.readFileSync(path.join(dirname, '/../../', 'twitch.json')).toString());

const router = express.Router();
const endpoint = 'twitch';

router.get('/' + endpoint + '/', (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}`);

        global.worker.log.trace(`twitch - session information ${request.session.id}`);
        global.worker.log.trace(`twitch - session information ${request.session.state}`);

        if(request.query.redirect)
            request.session.redirect = request.query.redirect as string;

        if(!request.session.state){
            request.session.state = uniqid();
            global.worker.log.trace(`twitch - set locale state to ${request.session.state}`);
        } else   global.worker.log.trace(`twitch - locale state is ${request.session.state}`);

        response.status(200).json({ url: twitchData.url_authorize + '?client_id=' + twitchData.client_id +
                                        '&redirect_uri=' + twitchData.redirect_uri +
                                        '&response_type=' + twitchData.response_type +
                                        '&scope=' + twitchData.scope +
                                        '&state=' + request.session.state });
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/userdata', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint} userdata`);

        if(request.session.userData != null){
            response.status(200).json(request.session.userData);
        } else response.status(204).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.post('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`post ${endpoint}`);

        if(request.session.userData != null){

            const node = (await global.worker.globalDatabase.sequelize.models.node.findOrCreate({
                defaults: {
                    name: request.session.userData.login,
                    displayName: request.session.userData.display_name,
                    endpoint: twitchData.url_twitch + request.session.userData.login
                },
                where: { name: request.session.userData.login }
            }))[0] as Model<NodeItem>;

            node.setDataValue('isActive', true);
            node.save();
            const channel = await global.worker.startNode(node);
            await HeroItem.put({sequelize: channel.database.sequelize, element: new HeroItem(channel.node.getDataValue('name')), onlyCreate: true});
            response.status(200).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.post('/' + endpoint + '/deactivate', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`post ${endpoint} deactivate`);

        if(global.isMaster(request, response, request.session.node)) {
            const node = await global.worker.globalDatabase.sequelize.models.node.findOne({ where: { name: request.session.userData.login } }) as Model<NodeItem>

            if(node) {
                node.setDataValue('isActive', false);
                node.save();
                const channel = await global.worker.stopNode(node);
                request.session.node = null;
                response.status(200).json(channel);
            } else response.status(404).json();
        } else response.status(401).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
export default router;