import express from 'express';
import { RaidHeroItem } from '../../model/raidHeroItem.js';
import { NodeItem } from '../../model/nodeItem.js';
import { Model } from 'sequelize-typescript';

const router = express.Router();
const endpoint = 'raidhero';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item: Model<RaidHeroItem>[];

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            item = await channel.database.sequelize.models.raidHero.findAll({ order: [['heroName', 'ASC']] }) as Model<RaidHeroItem>[];
            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:raidHandle', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item: Model<RaidHeroItem>[];

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            item = await channel.database.sequelize.models.raidHero.findAll({ where: { raidHandle: request.params.raidHandle }, order: [['heroName', 'ASC']] }) as Model<RaidHeroItem>[];
            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:raidHandle/:heroName', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item: Model<RaidHeroItem>;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            item = await channel.database.sequelize.models.raidHero.findOne({ where: { raidHandle: request.params.raidHandle, heroName: request.params.heroName }, order: [['heroName', 'ASC']] }) as Model<RaidHeroItem>;
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
                response.status(await RaidHeroItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
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
                    const item = await channel.database.sequelize.models.raidHero.findByPk(request.params.handle) as unknown as RaidHeroItem;
                    if (item) {
                        await channel.database.sequelize.models.raidHero.destroy({ where: { handle: request.params.handle } });
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