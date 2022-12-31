import express from 'express';
import { HeroItem } from '../../model/heroItem.js';
const router = express.Router();
const endpoint = 'node';
router.get('/' + endpoint + '/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        let item;
        if (request.query.childs !== "false") {
            item = await global.worker.globalDatabase.sequelize.models.node.findAll({ where: { isActive: true }, order: [['name', 'ASC']], include: [{
                        model: global.worker.globalDatabase.sequelize.models.twitchUser,
                        as: 'twitchUser',
                    }] });
        }
        else
            item = await global.worker.globalDatabase.sequelize.models.node.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.get('/' + endpoint + '/information/:node/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        let nodeName;
        let item;
        if (request.params.node === 'default')
            nodeName = (await global.defaultNode(request, response)).getDataValue('name');
        else
            nodeName = request.params.node;
        if (request.query.childs !== "false") {
            item = await global.worker.globalDatabase.sequelize.models.node.findOne({ where: { name: nodeName, isActive: true }, include: [{
                        model: global.worker.globalDatabase.sequelize.models.twitchUser,
                        as: 'twitchUser',
                    }] });
        }
        else
            item = await global.worker.globalDatabase.sequelize.models.node.findOne({ where: { name: nodeName, isActive: true } });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.get('/' + endpoint + '/live', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        let item;
        if (request.query.childs !== "false") {
            item = await global.worker.globalDatabase.sequelize.models.node.findAll({ where: { isLive: true, isActive: true }, order: [['name', 'ASC']], include: [{
                        model: global.worker.globalDatabase.sequelize.models.twitchUser,
                        as: 'twitchUser',
                    }] });
        }
        else
            item = await global.worker.globalDatabase.sequelize.models.node.findAll({ order: [['name', 'ASC']] });
        if (item)
            response.status(200).json(item);
        else
            response.status(404).json();
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.get('/' + endpoint + '/default', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, default`);
        await global.defaultNode(request, response);
        response.status(200).json(request.session.node);
    }
    catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
router.post('/' + endpoint + '/default', async (request, response) => {
    try {
        global.worker.log.trace(`post ${endpoint}, default`);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === request.query.node);
        global.worker.log.trace(request.session);
        if (channel) {
            request.session.node = channel.node.get();
            if (global.isRegistered(request, response))
                await HeroItem.put({ sequelize: channel.database.sequelize, element: new HeroItem(request.session.userData?.login), onlyCreate: true });
            response.status(200).json({ node: request.session.node });
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
//# sourceMappingURL=api.node.js.map