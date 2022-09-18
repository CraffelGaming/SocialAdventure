import * as express from 'express';
import { TrainerItem } from '../../model/trainerItem';
import { NodeItem } from '../../model/nodeItem';
const router = express.Router();
const endpoint = 'trainer';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        const item = await channel.database.sequelize.models.trainer.findAll({order: [ [ 'handle', 'ASC' ]], raw: false });
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        if(global.isMaster(request, response, node)){
            response.status(await TrainerItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

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
});

export default router;