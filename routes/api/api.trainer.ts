import * as express from 'express';
import { TrainerItem } from '../../model/trainerItem';
import { NodeItem } from '../../model/nodeItem';
const router = express.Router();
const endpoint = 'trainer';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            const item = await channel.database.sequelize.models.trainer.findAll({order: [ [ 'handle', 'ASC' ]], raw: false });
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
            node = global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                response.status(await TrainerItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                if(request.params.handle != null){
                    const item = await channel.database.sequelize.models.trainer.findByPk(request.params.handle) as unknown as TrainerItem;
                    if(item){
                        await channel.database.sequelize.models.trainer.destroy({where: {handle: request.params.handle}});
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

router.post('/' + endpoint + '/:node/training/:handle/hero/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}, training ${request.params.handle}, hero ${request.params.name}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isChannel(request, response, request.params.name)){
                response.status(await TrainerItem.training({sequelize: channel.database.sequelize, globalSequelize: global.worker.globalDatabase.sequelize, trainerHandle: request.params.handle, heroName: request.params.name})).json();
            } else response.status(403).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;