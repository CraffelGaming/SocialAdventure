import * as express from 'express';
const router = express.Router();
const endpoint = 'heroinventory';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.heroInventory.findAll({order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
            model: channel.database.sequelize.models.hero,
            as: 'hero',
        },{
            model: channel.database.sequelize.models.item,
            as: 'item',
        }]});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.heroInventory.findAll({where: { heroName: request.params.name }, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
            model: channel.database.sequelize.models.item,
            as: 'item',
        }]});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

export default router;