import express from 'express';
import { DailyItem } from '../../model/dailyItem.js';
const router = express.Router();
const endpoint = 'daily';
//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   Daily:
 *     type: object
 *     required:
 *       - module
 *     properties:
 *       handle:
 *         type: string
 *         descrition: ID der Täglichen Aufgabe
 *       value:
 *         type: string
 *         descrition: Name der Täglichen Aufgabe
 *       description:
 *         type: string
 *         descrition: Beschreibung der Täglichen Aufgabe
 *       goldMin:
 *         type: integer
 *         descrition: Minimaler Verdienst an Gold
 *       goldMax:
 *         type: integer
 *         descrition: Maximaler Verdienst an Gold
 *       experienceMin:
 *         type: integer
 *         descrition: Minimaler Verdienst an Erfahrung
 *       experienceMax:
 *         type: integer
 *         descrition: Maximaler Verdienst an Erfahrung
 *       createdAt:
 *         type: string
 *         descrition: Datum der Anlage
 *       updatedAt:
 *         type: string
 *         descrition: Datum der letzten Änderung
 *     example:
 *       handle: "gold"
 *       value: "Minenarbeit"
 *       description: "Harte schwere Mienenarbeit in den tiefsten Minen, die bisher bekannt sind."
 *       goldMin: 100
 *       goldMax: 500
 *       experienceMin: 100
 *       experienceMax: 500
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
            const item = await channel.database.sequelize.models.daily.findAll({ order: [['handle', 'ASC']] });
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
router.get('/' + endpoint + '/:node/current/:count', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node} random`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        let found;
        if (channel) {
            const count = Number(request.params.count);
            if (!isNaN(count)) {
                found = await DailyItem.getCurrentDaily({ sequelize: channel.database.sequelize, count, node: node.name });
            }
            if (found)
                response.status(200).json(found);
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
router.get('/' + endpoint + '/:node/current/:count/hero/:name', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node} random`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        let found;
        if (channel) {
            const count = Number(request.params.count);
            if (!isNaN(count)) {
                found = await DailyItem.getCurrentDailyByHero({ sequelize: channel.database.sequelize, count, heroName: request.params.name, node: node.name });
            }
            if (found)
                response.status(200).json(found);
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
router.post('/' + endpoint + '/:node/redeem/:number/hero/:name', async (request, response) => {
    try {
        global.worker.log.trace(`post ${endpoint}, node ${request.params.node} random`);
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (global.isChannel(request, response, request.params.name)) {
                let found;
                const count = Number(request.params.number);
                if (!isNaN(count)) {
                    found = (await DailyItem.getCurrentDailyByHero({ sequelize: channel.database.sequelize, count, heroName: request.params.name, node: node.name }))[count - 1];
                }
                if (found) {
                    const hero = await channel.database.sequelize.models.hero.findByPk(request.params.name);
                    if (hero.getDataValue("lastDaily").setHours(0, 0, 0, 0) < found.date.setHours(0, 0, 0, 0)) {
                        hero.setDataValue("lastDaily", found.date);
                        hero.save();
                        await channel.database.sequelize.models.heroWallet.increment('gold', { by: found.gold, where: { heroName: request.params.name } });
                        await channel.database.sequelize.models.hero.increment('experience', { by: found.experience, where: { name: request.params.name } });
                    }
                    else
                        found = null;
                }
                if (found)
                    response.status(200).json(found);
                else
                    response.status(404).json();
            }
            else
                response.status(403).json();
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
                response.status(await DailyItem.put({ sequelize: channel.database.sequelize, globalSequelize: global.worker.globalDatabase.sequelize, element: request.body })).json(request.body);
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
                    const item = await channel.database.sequelize.models.daily.findByPk(request.params.handle);
                    if (item) {
                        await channel.database.sequelize.models.daily.destroy({ where: { handle: request.params.handle } });
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
//# sourceMappingURL=api.daily.js.map