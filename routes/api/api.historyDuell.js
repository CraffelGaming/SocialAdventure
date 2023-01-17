import express from 'express';
const router = express.Router();
const endpoint = 'historyduell';
//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   HistoryDuell:
 *     type: object
 *     required:
 *       - handle
 *       - date
 *       - sourceHeroName
 *       - targetHeroName
 *     properties:
 *       handle:
 *         type: integer
 *         descrition: Eindeutige ID des Protokolls
 *       sourceHeroName:
 *         type: string
 *         descrition: Heldenname des Angreifers
 *       targetHeroName:
 *         type: string
 *         descrition: Heldenname des Verteidigers
 *       sourceHitpoints:
 *         type: integer
 *         descrition: Verbleibende Lebenspunkte des Angreifers, wenn 0 dann verloren, ansonsten gewonnen
 *       targetHitpoints:
 *         type: integer
 *         descrition: Verbleibende Lebenspunkte des Verteidigers, wenn 0 dann verloren, ansonsten gewonnen
 *       gold:
 *         type: integer
 *         descrition: Goldgewinn des Gewinners
 *       experience:
 *         type: integer
 *         descrition: Erfahrungsgewinn des Gewinners
 *       date:
 *         type: string
 *         descrition: Datum des Duells
 *       createdAt:
 *         type: string
 *         descrition: Datum der Anlage
 *       updatedAt:
 *         type: string
 *         descrition: Datum der letzten Änderung
 *     example:
 *       handle: 1
 *       sourceHeroName: 'craffel'
 *       targetHeroName: 'socialadventure'
 *       sourceHitpoints: 10
 *       targetHitpoints: 0
 *       gold: 200
 *       experience: 300
 *       date: "2022-05-12 10:11:35.027 +00:00"
 *       createdAt: "2022-05-12 10:11:35.027 +00:00"
 *       updatedAt: "2022-05-12 10:11:35.027 +00:00"
 */
//#endregion
router.get('/' + endpoint + '/:node/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item;
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historyDuell.findAll({ order: [['handle', 'ASC']], include: [{
                            model: channel.database.sequelize.models.hero,
                            as: 'heroSource',
                        }, {
                            model: channel.database.sequelize.models.hero,
                            as: 'heroTarget',
                        }] });
            }
            else
                item = await channel.database.sequelize.models.historyDuell.findAll({ order: [['handle', 'ASC']] });
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
router.get('/' + endpoint + '/:node/sourcehero/:name', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item;
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historyDuell.findOne({ where: { sourceHeroName: request.params.name }, include: [{
                            model: channel.database.sequelize.models.hero,
                            as: 'heroSource',
                        }, {
                            model: channel.database.sequelize.models.hero,
                            as: 'heroTarget',
                        }] });
            }
            else
                item = await channel.database.sequelize.models.historyDuell.findOne({ where: { sourceHeroName: request.params.name } });
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
router.get('/' + endpoint + '/:node/targethero/:name', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item;
        let node;
        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else
            node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node);
        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name);
        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historyDuell.findOne({ where: { targetHeroName: request.params.name }, include: [{
                            model: channel.database.sequelize.models.hero,
                            as: 'heroSource',
                        }, {
                            model: channel.database.sequelize.models.hero,
                            as: 'heroTarget',
                        }] });
            }
            else
                item = await channel.database.sequelize.models.historyDuell.findOne({ where: { targetHeroName: request.params.name } });
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
export default router;
//# sourceMappingURL=api.historyDuell.js.map