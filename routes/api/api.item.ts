import * as express from 'express';
import sequelize from 'sequelize';
import { HeroInventoryItem } from '../../model/heroInventoryItem';
import { ItemItem } from '../../model/itemItem';
const router = express.Router();
const endpoint = 'item';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node )

    if(channel) {
        const item = await channel.database.sequelize.models.item.findAll({order: [ [ 'handle', 'ASC' ]], raw: false});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node)

    if(channel) {
        if(global.isMaster(request, response, node)){
            if(request.body.handle != null && request.body.handle > 0){
                if(request.body.value != null && request.body.value.length > 0){
                    const item = await channel.database.sequelize.models.item.findByPk(request.body.handle);
                    if(item){
                        await channel.database.sequelize.models.item.update(request.body, {where: {handle: request.body.handle}});
                    }
                } else {
                    response.status(406).json();
                }
            } else {
                await channel.database.sequelize.models.item.create(request.body as any);
            }
            response.status(201).json(request.body);
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
    let node = request.params.node;

    if(node === 'default')
        node = global.defaultNode(request, response);

    const channel = global.worker.channels.find(x => x.node.name === node)

    if(channel) {
        if(global.isMaster(request, response, node)){
            if(request.params.handle != null){
                const item = await channel.database.sequelize.models.item.findByPk(request.params.handle) as unknown as ItemItem;
                if(item){
                    for(const heroItem of Object.values(await channel.database.sequelize.models.heroInventory.findAll({where: {itemHandle: request.params.handle}})) as unknown as HeroInventoryItem[]){
                        await channel.database.sequelize.models.heroWallet.increment('gold', { by: item.gold * heroItem.quantity, where: { heroName: heroItem.heroName }});
                        await channel.database.sequelize.models.heroInventory.destroy({where: {itemHandle: request.params.handle}});
                    }
                    await channel.database.sequelize.models.item.destroy({where: {handle: request.params.handle}});
                }
                response.status(204).json();
            } else response.status(404).json();
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});

export default router;