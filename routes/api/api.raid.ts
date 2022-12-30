import express from 'express';
import { RaidItem } from '../../model/raidItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'raid';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item : RaidItem[];

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.raid.findAll({order: [ [ 'handle', 'ASC' ]], include: [{
                    model: channel.database.sequelize.models.raidBoss,
                    as: 'raidBoss',
                }, {
                    model: channel.database.sequelize.models.raidHero,
                    as: 'raidHeroes',
                }]}) as unknown as RaidItem[];
            } else {
                item = await channel.database.sequelize.models.raid.findAll({order: [ [ 'handle', 'ASC' ]]}) as unknown as RaidItem[];
            }

            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item : RaidItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.raid.findOne({ where: { handle: request.params.handle}, order: [ [ 'handle', 'ASC' ]], include: [{
                    model: channel.database.sequelize.models.raidBoss,
                    as: 'raidBoss',
                }, {
                    model: channel.database.sequelize.models.raidHero,
                    as: 'raidHeroes',
                }]}) as unknown as RaidItem;
            } else {
                item = await channel.database.sequelize.models.raid.findOne({ where: { handle: request.params.handle}, order: [ [ 'handle', 'ASC' ]]}) as unknown as RaidItem;
            }
            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/current/active', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;
        let item : RaidItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.raid.findOne({ where: { isActive: true },
                    order: [ [ 'handle', 'DESC' ]], include: [{
                    model: channel.database.sequelize.models.raidBoss,
                    as: 'raidBoss',
                }, {
                    model: channel.database.sequelize.models.raidHero,
                    as: 'raidHeroes',
                }]}) as unknown as RaidItem;
            } else {
                item = await channel.database.sequelize.models.raid.findOne({ where: { isActive: true },
                    order: [ [ 'handle', 'DESC' ]]}) as unknown as RaidItem;
            }
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
                response.status(await RaidItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
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
                    const item = await channel.database.sequelize.models.raid.findByPk(request.params.handle) as unknown as RaidItem;
                    if(item){
                        await channel.database.sequelize.models.raid.destroy({where: {handle: request.params.handle}});
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

export default router;