import express from 'express';
import { RaidBossItem } from '../../model/raidBossItem.js';
import { NodeItem } from '../../model/nodeItem.js';
import { Model } from 'sequelize-typescript';

const router = express.Router();
const endpoint = 'raidboss';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item: Model<RaidBossItem>[];

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.raidBoss.findAll({
                    order: [['name', 'ASC']], include: [{
                        model: global.worker.globalDatabase.sequelize.models.itemCategory,
                        as: 'category',
                    }]
                }) as Model<RaidBossItem>[];
            } else {
                item = await channel.database.sequelize.models.raidBoss.findAll({ order: [['name', 'ASC']] }) as Model<RaidBossItem>[];
            }
            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item: Model<RaidBossItem>;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.raidBoss.findOne({
                    where: { handle: request.params.handle }, order: [['name', 'ASC']], include: [{
                        model: global.worker.globalDatabase.sequelize.models.itemCategory,
                        as: 'category',
                    }]
                }) as Model<RaidBossItem>;
            } else {
                item = await channel.database.sequelize.models.raidBoss.findOne({ where: { handle: request.params.handle }, order: [['name', 'ASC']] }) as Model<RaidBossItem>;
            }
            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (global.isMaster(request, response, node)) {
                response.status(await RaidBossItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.handle != null) {
                    const item = await channel.database.sequelize.models.raidBoss.findByPk(request.params.handle) as unknown as RaidBossItem;
                    if (item) {
                        await channel.database.sequelize.models.raidBoss.destroy({ where: { handle: request.params.handle } });
                    }
                    response.status(204).json();
                } else response.status(404).json();
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