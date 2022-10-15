import * as express from 'express';
import { HeroItem } from '../../model/heroItem';
import { NodeItem } from '../../model/nodeItem';
const router = express.Router();
const endpoint = 'hero';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item : HeroItem[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.hero.findAll({order: [ [ 'name', 'ASC' ]], raw: false, include: [{
                    model: channel.database.sequelize.models.heroTrait,
                    as: 'trait',
                }, {
                    model: channel.database.sequelize.models.heroWallet,
                    as: 'wallet',
                }]}) as unknown as HeroItem[];
            } else item = await channel.database.sequelize.models.hero.findAll({order: [ [ 'name', 'ASC' ]], raw: false }) as unknown as HeroItem[];

            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item : HeroItem[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.hero.findByPk(request.params.name, {raw: false, include: [{
                    model: channel.database.sequelize.models.heroTrait,
                    as: 'trait',
                }, {
                    model: channel.database.sequelize.models.heroWallet,
                    as: 'wallet',
                }]}) as unknown as HeroItem[];
            } else item = await channel.database.sequelize.models.hero.findByPk(request.params.name, {raw: false }) as unknown as HeroItem[];

            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                response.status(await HeroItem.put({ sequelize: channel.database.sequelize, element: request.body, onlyCreate: false})).json(request.body);
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;