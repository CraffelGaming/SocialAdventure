import express from 'express';
import { HeroInventoryItem } from '../../model/heroInventoryItem.js';
import { ItemCategoryItem } from '../../model/itemCategoryItem.js';
import { ItemItem } from '../../model/itemItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'itemcategory';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try{
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
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item : ItemCategoryItem[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.itemCategory.findAll({order: [ [ 'value', 'ASC' ]], raw: false, include: [{
                    model: channel.database.sequelize.models.item,
                    as: 'items',
                }]}) as unknown as ItemCategoryItem[];
            } else item = await channel.database.sequelize.models.itemCategory.findAll({order: [ [ 'value', 'ASC' ]], raw: false }) as unknown as ItemCategoryItem[];

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

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                response.status(await ItemCategoryItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
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
                    const item = await channel.database.sequelize.models.itemCategory.findByPk(request.params.handle) as unknown as ItemCategoryItem;
                    if(item){
                        for(const itemItem of Object.values(await channel.database.sequelize.models.item.findAll({where: {categoryHandle: request.params.handle}})) as unknown as ItemItem[]){
                            for(const heroItem of Object.values(await channel.database.sequelize.models.heroInventory.findAll({where: {itemHandle: itemItem.handle}})) as unknown as HeroInventoryItem[]){
                                await channel.database.sequelize.models.heroWallet.increment('gold', { by: itemItem.gold * heroItem.quantity, where: { heroName: heroItem.heroName }});
                                await channel.database.sequelize.models.heroInventory.destroy({where: {itemHandle: request.params.handle}});
                            }
                            await channel.database.sequelize.models.item.destroy({where: {handle: itemItem.handle}});
                        }
                        await channel.database.sequelize.models.itemCategory.destroy({where: {handle: request.params.handle}});
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

router.post('/' + endpoint + '/:node/transfer/:handle', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

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
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
export default router;