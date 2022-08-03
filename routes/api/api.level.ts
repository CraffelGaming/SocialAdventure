import * as express from 'express';

const router = express.Router();
const endpoint = 'level';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    let node = 'craffel';

    if(request.params.node !== 'default')
        node = request.params.node;

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.level.findAll({order: [ [ 'handle', 'ASC' ]], raw: true});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

export default router;