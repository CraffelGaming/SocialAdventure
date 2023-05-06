import express from 'express';
import { AdventureItem } from '../../model/adventureItem.js';
const router = express.Router();
const endpoint = 'adventure';
//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   Adventure:
 *     type: object
 *     required:
 *       - itemHandle
 *       - heroName
 *     properties:
 *       itemHandle:
 *         type: integer
 *         descrition: Eindeutige ID eines Gegenstands
 *       heroName:
 *         type: string
 *         descrition: Eindeutiger Name eines Helden
 *       createdAt:
 *         type: string
 *         descrition: Datum der Anlage
 *       updatedAt:
 *         type: string
 *         descrition: Datum der letzten Änderung
 *     example:
 *       itemHandle: 1
 *       heroName: 'craffel'
 *       createdAt: "2022-05-12 10:11:35.027 +00:00"
 *       updatedAt: "2022-05-12 10:11:35.027 +00:00"
 */
//#endregion
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
            const item = await channel.database.sequelize.models.adventure.findAll({
                order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: channel.database.sequelize.models.hero,
                        as: 'hero',
                    }, {
                        model: channel.database.sequelize.models.item,
                        as: 'item',
                    }]
            });
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
router.get('/' + endpoint + '/:node/hero/:name', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            const item = await channel.database.sequelize.models.adventure.findAll({
                where: { heroName: request.params.name }, order: [['heroName', 'ASC'], ['itemHandle', 'ASC']], include: [{
                        model: channel.database.sequelize.models.hero,
                        as: 'hero',
                    }, {
                        model: channel.database.sequelize.models.item,
                        as: 'item',
                    }]
            });
            ;
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
                response.status(await AdventureItem.put({ sequelize: channel.database.sequelize, element: request.body })).json(request.body);
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
router.delete('/' + endpoint + '/:node/:heroName/:itemHandle', async (request, response) => {
    try {
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, heroName ${request.params.heroName}, itemHandle ${request.params.itemHandle}`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isMaster(request, response, node)) {
                if (request.params.heroName != null && request.params.itemHandle != null) {
                    const item = await channel.database.sequelize.models.adventure.findOne({ where: { heroName: request.params.heroName, itemHandle: request.params.itemHandle } });
                    if (item) {
                        await channel.database.sequelize.models.adventure.destroy({ where: { heroName: request.params.heroName, itemHandle: request.params.itemHandle } });
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
//# sourceMappingURL=api.adventure.js.map