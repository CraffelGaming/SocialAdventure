import * as express from 'express';
import { HeroInventoryItem } from '../../model/heroInventoryItem';
const router = express.Router();
const endpoint = 'heroinventory';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;
    let item : HeroInventoryItem[];

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        if(request.query.childs !== "false"){
            item = await channel.database.sequelize.models.heroInventory.findAll({order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
                model: channel.database.sequelize.models.hero,
                as: 'hero',
            },{
                model: channel.database.sequelize.models.item,
                as: 'item',
            }]}) as unknown as HeroInventoryItem[];
        } else item = await channel.database.sequelize.models.heroInventory.findAll({order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false }) as unknown as HeroInventoryItem[];

        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
    let node = request.params.node;
    let item : HeroInventoryItem[];

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        if(request.query.childs !== "false"){
            item = await channel.database.sequelize.models.heroInventory.findAll({where: { heroName: request.params.name }, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
                model: channel.database.sequelize.models.item,
                as: 'item',
            }]})as unknown as HeroInventoryItem[];
        } else item = await channel.database.sequelize.models.heroInventory.findAll({where: { heroName: request.params.name }, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false }) as unknown as HeroInventoryItem[];

        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

export default router;