import * as express from 'express';
const router = express.Router();
const endpoint = 'hero';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.hero.findAll({order: [ [ 'name', 'ASC' ]], raw: false, include: [{
            model: channel.database.sequelize.models.heroTrait,
            as: 'trait',
        }, {
            model: channel.database.sequelize.models.heroWallet,
            as: 'wallet',
        }]});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

export default router;