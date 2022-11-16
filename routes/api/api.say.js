import express from 'express';
const router = express.Router();
const endpoint = 'say';
router.get('/' + endpoint + '/:node/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            const item = await channel.database.sequelize.models.say.findAll({ order: [['command', 'ASC']], raw: false });
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
        if (request.body.command.startsWith('!'))
            request.body.command.substring(1);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.body.command != null && request.body.command.length > 0) {
                    let item = await channel.database.sequelize.models.say.findByPk(request.body.command);
                    if (item) {
                        await channel.database.sequelize.models.say.update(request.body, { where: { command: request.body.command } });
                        item = await channel.database.sequelize.models.say.findByPk(request.body.command);
                        channel.removeSay(request.body.command);
                        channel.addSay(item);
                    }
                    else {
                        await channel.database.sequelize.models.say.create(request.body);
                        item = await channel.database.sequelize.models.say.findByPk(request.body.command);
                        channel.addSay(item);
                    }
                    response.status(201).json(request.body);
                }
                else {
                    response.status(406).json();
                }
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
router.delete('/' + endpoint + '/:node/:command', async (request, response) => {
    try {
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, command ${request.params.command}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.command != null) {
                    const item = await channel.database.sequelize.models.say.findByPk(request.params.command);
                    if (item) {
                        await channel.database.sequelize.models.say.destroy({ where: { command: request.params.command } });
                        channel.removeSay(request.params.command);
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
//# sourceMappingURL=api.say.js.map