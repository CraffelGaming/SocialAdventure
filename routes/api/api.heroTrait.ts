import * as express from 'express';
import { HeroTraitItem } from '../../model/heroTraitItem';
const router = express.Router();
const endpoint = 'herotrait';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;
    let item : HeroTraitItem[];

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        if(request.query.childs !== "false"){
            item = await channel.database.sequelize.models.heroTrait.findAll({order: [ [ 'heroName', 'ASC' ]], raw: false, include: [{
                model: channel.database.sequelize.models.hero,
                as: 'hero',
            }]})as unknown as HeroTraitItem[];
        } else item = await channel.database.sequelize.models.heroTrait.findAll({order: [ [ 'heroName', 'ASC' ]], raw: false}) as unknown as HeroTraitItem[];

        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
    let node = request.params.node;
    let item : HeroTraitItem[];

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        if(request.query.childs !== "false"){
            item = await channel.database.sequelize.models.heroTrait.findAll({where: { heroName: request.params.name }, raw: false, include: [{
                model: channel.database.sequelize.models.hero,
                as: 'hero',
            }]}) as unknown as HeroTraitItem[];
        } else item = await channel.database.sequelize.models.heroTrait.findAll({where: { heroName: request.params.name }, raw: false}) as unknown as HeroTraitItem[];

        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

export default router;