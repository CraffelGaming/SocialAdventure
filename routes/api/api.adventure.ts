import * as express from 'express';
import { AdventureItem } from '../../model/adventureItem';
import { NodeItem } from '../../model/nodeItem';

const router = express.Router();
const endpoint = 'adventure';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            const item = await channel.database.sequelize.models.adventure.findAll({order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
                model: channel.database.sequelize.models.hero,
                as: 'hero',
            }, {
                model: channel.database.sequelize.models.item,
                as: 'item',
            }] });
            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            const item = await channel.database.sequelize.models.adventure.findAll({where: {heroName: request.params.name}, order: [ [ 'heroName', 'ASC' ], [ 'itemHandle', 'ASC' ]], raw: false, include: [{
                model: channel.database.sequelize.models.hero,
                as: 'hero',
            }, {
                model: channel.database.sequelize.models.item,
                as: 'item',
            }] });
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
                response.status(await AdventureItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.delete('/' + endpoint + '/:node/:heroName/:itemHandle', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, heroName ${request.params.heroName}, itemHandle ${request.params.itemHandle}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.name === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                if(request.params.heroName != null && request.params.itemHandle != null){
                    const item = await channel.database.sequelize.models.adventure.findOne({ where: { heroName: request.params.heroName, itemHandle: request.params.itemHandle}}) as unknown as AdventureItem;
                    if(item){
                        await channel.database.sequelize.models.adventure.destroy({ where: { heroName: request.params.heroName, itemHandle: request.params.itemHandle}});
                    }
                    response.status(204).json();
                } else response.status(404).json();
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