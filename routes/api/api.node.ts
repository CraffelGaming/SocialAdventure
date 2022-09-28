import * as express from 'express';
import { HeroItem } from '../../model/heroItem';
import { NodeItem } from '../../model/nodeItem';

const router = express.Router();
const endpoint = 'node';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}`);
    let item: NodeItem;

    if(request.query.childs !== "false"){
        item = await global.worker.globalDatabase.sequelize.models.node.findAll({order: [ [ 'name', 'ASC' ]], raw: false, include: [{
            model: global.worker.globalDatabase.sequelize.models.twitchUser,
            as: 'twitchUser',
        }]}) as undefined as NodeItem;
    }
    else item = await global.worker.globalDatabase.sequelize.models.node.findAll({order: [ [ 'name', 'ASC' ]], raw: false}) as undefined as NodeItem;

    if(item) response.status(200).json(item);
    else response.status(404).json();
});

router.get('/' + endpoint + '/default', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, default`);
    await global.defaultNode(request, response);
    response.status(200).json(request.session.node);
});

router.post('/' + endpoint + '/default', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`post ${endpoint}, default`);

    const channel = global.worker.channels.find(x => x.node.name === request.query.node);
    global.worker.log.trace(request.session);
    if(channel) {
        request.session.node = channel.node;

        if(global.isRegistered(request,response ))
            await HeroItem.put({sequelize: channel.database.sequelize, element: new HeroItem(request.session.userData?.login), onlyCreate: true});

        response.status(200).json({ node: request.session.node});
    } else response.status(404).json();
});

export default router;