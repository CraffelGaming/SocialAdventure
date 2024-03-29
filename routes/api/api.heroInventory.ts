import express from 'express';
import { Model } from 'sequelize-typescript';
import { HeroInventoryItem } from '../../model/heroInventoryItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'heroinventory';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item: Model<HeroInventoryItem>[];
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.heroInventory.findAll({
                    order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: channel.database.sequelize.models.hero,
                        as: 'hero',
                    }, {
                        model: channel.database.sequelize.models.item,
                        as: 'item',
                    }]
                }) as Model<HeroInventoryItem>[];
            } else item = await channel.database.sequelize.models.heroInventory.findAll({ order: [['heroName', 'ASC'], ['itemHandle', 'ASC']] }) as Model<HeroInventoryItem>[];

            if (item) response.status(200).json(item.filter(x => x.getDataValue('item') != null));
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item: Model<HeroInventoryItem>[];
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.heroInventory.findAll({
                    where: { heroName: request.params.name }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: channel.database.sequelize.models.item,
                        as: 'item',
                    }]
                }) as Model<HeroInventoryItem>[];
            } else item = await channel.database.sequelize.models.heroInventory.findAll({ where: { heroName: request.params.name }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']] }) as Model<HeroInventoryItem>[];

            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.post('/' + endpoint + '/:node/sell/item/:handle/hero/:name/quantity/:quantity', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}, item ${request.params.handle}, hero ${request.params.name}, amount ${request.params.amount}`);
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (global.isChannel(request, response, request.params.name)) {
                let quantityNumber = Number(request.params.quantity)
                if (isNaN(quantityNumber)) {
                    quantityNumber = 0;
                }
                response.status(await HeroInventoryItem.sell({ sequelize: channel.database.sequelize, itemHandle: request.params.handle, heroName: request.params.name, quantity: quantityNumber })).json();
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;