import * as express from 'express';
import { ItemCategoryItem } from '../../model/itemCategoryItem';
import { ItemItem } from '../../model/itemItem';

const router = express.Router();
const endpoint = 'itemcategory';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}`);
    const item = await global.worker.globalDatabase.sequelize.models.itemCategory.findAll({ order: [ [ 'value', 'ASC' ]], raw: false, include: [{
        model: global.worker.globalDatabase.sequelize.models.item,
        as: 'items',
    }]}) as unknown as ItemCategoryItem[];

    if(item) response.status(200).json(item);
    else response.status(404).json();
});

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.itemCategory.findAll({order: [ [ 'value', 'ASC' ]], raw: false, include: [{
            model: global.worker.globalDatabase.sequelize.models.item,
            as: 'items',
        }]});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.post('/' + endpoint + '/:node/transfer/:handle', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node)
    //TODO
    if(channel) {
        if(global.isMaster(request, response, node)){
            const globalItems = await global.worker.globalDatabase.sequelize.models.item.findAll({ where: { categoryHandle: request.params.handle }}) as unknown as ItemItem[];

            for(const globalItem in globalItems){
                if(globalItem != null){
                    const item = await channel.database.sequelize.models.item.findOne({ where: { categoryHandle: request.params.handle, value: globalItems[globalItem].value }}) as unknown as ItemItem;
                    if(item){
                        globalItems[globalItem].handle = item.handle;
                        await channel.database.sequelize.models.item.update(globalItems[globalItem], {where: {handle: item.handle}});
                    } else {
                        globalItems[globalItem].handle = null;
                        await channel.database.sequelize.models.item.create(globalItems[globalItem] as any);
                    }
                }
            }
            response.status(204).json();
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});
export default router;