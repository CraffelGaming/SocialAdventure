import express from 'express';
import { LocationItem } from '../../model/locationItem.js';
const router = express.Router();
const endpoint = 'location';
router.get('/' + endpoint + '/:node/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node;
        let item;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.location.findAll({
                    order: [['name', 'ASC']], include: [{
                            model: channel.database.sequelize.models.itemCategory,
                            as: 'category',
                        }]
                });
            }
            else {
                item = await channel.database.sequelize.models.location.findAll({ order: [['name', 'ASC']] });
            }
            if (item)
                response.status(200).json(item);
            else
                response.status(404).json();
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.get('/' + endpoint + '/:node/active', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node;
        let item;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.location.findAll({
                    where: { isActive: true }, order: [['name', 'ASC']], include: [{
                            model: global.worker.globalDatabase.sequelize.models.itemCategory,
                            as: 'category',
                        }]
                });
            }
            else {
                item = await channel.database.sequelize.models.location.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
            }
            if (item)
                response.status(200).json(item);
            else
                response.status(404).json();
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.put('/' + endpoint + '/:node/', async (request, response) => {
    try {
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                response.status(await LocationItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.delete('/' + endpoint + '/:node/:handle', async (request, response) => {
    try {
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.handle != null) {
                    const item = await channel.database.sequelize.models.location.findByPk(request.params.handle);
                    if (item) {
                        await channel.database.sequelize.models.location.destroy({ where: { handle: request.params.handle } });
                    }
                    response.status(204).json();
                }
                else
                    response.status(404).json();
            }
            else {
                response.status(403).json();
            }
        }
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
export default router;
//# sourceMappingURL=api.location.js.map