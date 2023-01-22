import express from 'express';
const router = express.Router();
const endpoint = 'historyadventure';
//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   HistoryAdventure:
 *     type: object
 *     required:
 *       - handle
 *       - date
 *       - heroName
 *       - enemyName
 *     properties:
 *       handle:
 *         type: integer
 *         descrition: Eindeutige ID des Protokolls
 *       heroName:
 *         type: string
 *         descrition: Heldenname
 *       enemyName:
 *         type: string
 *         descrition: Monstername
 *       heroHitpointsStart:
 *         type: integer
 *         descrition: HP des Helden vor Kampf
 *       heroHitpointsEnd:
 *         type: integer
 *         descrition: HP des Helden nach Kampf
 *       enemyHitpointsStart:
 *         type: integer
 *         descrition: HP des Monsters vor Kampf
 *       enemyHitpointsEnd:
 *         type: integer
 *         descrition: HP des Monsters nach Kampf
 *       isSuccess:
 *         type: boolean
 *         descrition: Abgabe, ob das Abenteuer erfolgreich war
 *       heroDamage:
 *         type: integer
 *         descrition: Schaden des Helden
 *       enemyDamage:
 *         type: integer
 *         descrition: Schaden des Monsters
 *       gold:
 *         type: integer
 *         descrition: Goldgewinn des Gewinners
 *       experience:
 *         type: integer
 *         descrition: Erfahrungsgewinn des Gewinners
 *       itemName:
 *         type: string
 *         descrition: Gefundener Gegenstand.
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
 *       heroName: 'craffel'
 *       enemyName: 'Goblin'
 *       heroHitpointsStart: 100
 *       heroHitpointsEnd: 90
 *       enemyHitpointsStart: 30
 *       enemyHitpointsEnd: 0
 *       isSuccess: true
 *       enemyDamage: 10
 *       heroDamage: 30
 *       gold: 200
 *       experience: 300
 *       itemName: 'Holzschwert'
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
                item = await channel.database.sequelize.models.historyAdventure.findAll({ order: [['handle', 'ASC']], limit: 1000 });
            }
            else
                item = await channel.database.sequelize.models.historyAdventure.findAll({ order: [['handle', 'ASC']], limit: 1000 });
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
                item = await channel.database.sequelize.models.historyAdventure.findOne({ where: { heroName: request.params.name, order: [['handle', 'ASC']], limit: 1000 } });
            }
            else
                item = await channel.database.sequelize.models.historyAdventure.findOne({ where: { heroName: request.params.name, order: [['handle', 'ASC']], limit: 1000 } });
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
//# sourceMappingURL=api.historyAdventure.js.map