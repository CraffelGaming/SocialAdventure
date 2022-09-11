import * as express from 'express';
import { ItemCategoryItem } from '../../model/itemCategoryItem';
import { ItemItem } from '../../model/itemItem';
import { NodeItem } from '../../model/nodeItem';

const router = express.Router();
const endpoint = 'itemcategory';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}`);
    let item : ItemCategoryItem[];

    if(request.query.childs !== "false"){
        item = await global.worker.globalDatabase.sequelize.models.itemCategory.findAll({ order: [ [ 'value', 'ASC' ]], raw: false, include: [{
            model: global.worker.globalDatabase.sequelize.models.item,
            as: 'items',
        }]}) as unknown as ItemCategoryItem[];
    } else item = await global.worker.globalDatabase.sequelize.models.itemCategory.findAll({ order: [ [ 'value', 'ASC' ]], raw: false }) as unknown as ItemCategoryItem[];

    if(item) response.status(200).json(item.filter(x => x.items?.length > 0));
    else response.status(404).json();
});

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let item : ItemCategoryItem[];
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        if(request.query.childs !== "false"){
            item = await channel.database.sequelize.models.itemCategory.findAll({order: [ [ 'value', 'ASC' ]], raw: false, include: [{
                model: global.worker.globalDatabase.sequelize.models.item,
                as: 'items',
            }]}) as unknown as ItemCategoryItem[];
        } else item = await channel.database.sequelize.models.itemCategory.findAll({order: [ [ 'value', 'ASC' ]], raw: false }) as unknown as ItemCategoryItem[];

        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.post('/' + endpoint + '/:node/transfer/:handle', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        if(global.isMaster(request, response, node)){

            const globalCategory = await global.worker.globalDatabase.sequelize.models.itemCategory.findByPk(request.params.handle, {raw: true}) as unknown as ItemCategoryItem;

            if(globalCategory !== null){
                const category = await channel.database.sequelize.models.itemCategory.findByPk(request.params.handle, {raw: true}) as unknown as ItemCategoryItem;

                if(category === null){
                    await channel.database.sequelize.models.itemCategory.create(globalCategory as any);
                }

                const globalItems = await global.worker.globalDatabase.sequelize.models.item.findAll({ where: { categoryHandle: request.params.handle }, raw: true}) as unknown as ItemItem[];

                for(const globalItem in globalItems){
                    if(globalItem != null){
                        const item = await channel.database.sequelize.models.item.findOne({ where: { categoryHandle: request.params.handle, value: globalItems[globalItem].value }, raw: true}) as unknown as ItemItem;
                        if(item){
                            globalItems[globalItem].handle = item.handle;
                            await channel.database.sequelize.models.item.update(globalItems[globalItem], {where: {handle: item.handle}});
                        } else {
                            globalItems[globalItem].handle = null;
                            await channel.database.sequelize.models.item.create(globalItems[globalItem] as any);
                        }
                    }
                }
            }

            response.status(201).json();
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});
export default router;