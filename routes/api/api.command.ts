import express from 'express';
import { CommandItem } from '../../model/commandItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'command';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            let item = await channel.database.sequelize.models.command.findAll({order: [ [ 'module', 'ASC' ], [ 'command', 'ASC' ]], raw: false }) as unknown as CommandItem[];

            if(!global.isMaster(request, response)) {
                item = item.filter(x => x.isMaster === false)
            }

            if(request.query.counter !== "1") {
                item = item.filter(x => x.isCounter === false)
            }

            if(item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:module', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            let item = await channel.database.sequelize.models.command.findAll({where: { module: request.params.module}, order: [ [ 'module', 'ASC' ], [ 'command', 'ASC' ]], raw: false }) as unknown as CommandItem[];

            if(!global.isMaster(request, response, node)) {
                item = item.filter(x => x.isMaster === false)
            }

            if(request.query.counter !== "1") {
                item = item.filter(x => x.isCounter === false)
            }

            if(item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;