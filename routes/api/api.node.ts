import * as express from 'express';

const router = express.Router();
const endpoint = 'node';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    const item = await global.worker.globalDatabase.sequelize.models.node.findAll({order: [ [ 'name', 'ASC' ]], raw: true});
    if(item) response.status(200).json(item);
    else response.status(404).json();
});

router.get('/' + endpoint + '/default', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET SELECT ' + endpoint);

    if(!request.session.node)
        request.session.node = 'craffel';

    response.status(200).json({ node: request.session.node});
});

router.post('/' + endpoint + '/default', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('POST SELECT ' + endpoint);

    const channel = global.worker.channels.find(x => x.node.name === request.query.node);

    if(channel) {
        request.session.node = request.query.node as string;
        response.status(200).json({ node: request.session.node});
    } else response.status(404).json();
});

export default router;