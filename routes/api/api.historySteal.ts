import express from 'express';
import { Model } from 'sequelize-typescript';
import { HistoryStealItem } from '../../model/historyStealItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'historysteal';

//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   HistorySteal:
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
 *         descrition: Heldenname des Diebes
 *       targetHeroName:
 *         type: string
 *         descrition: Heldenname des Opfers
 *       isSuccess:
 *         type: boolean
 *         descrition: Abgabe, ob der Diebstahl erfolgreich war
 *       rollSource:
 *         type: integer
 *         descrition: w100 Wurf des Diebes
 *       rollSourceCount:
 *         type: integer
 *         descrition: w100 Wurfversuche des Diebes
 *       rollTarget:
 *         type: integer
 *         descrition: w100 Wurf des Opfers
 *       rollTargetCount:
 *         type: integer
 *         descrition: w100 Wurfversuche des Opfers
 *       itemName:
 *         type: string
 *         descrition: Gewonnener / Verlorener Gegenstand.
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
 *       isSuccess: true
 *       rollSource: 96
 *       rollSourceCount: 2
 *       rollTarget: 13
 *       rollTargetCount: 1
 *       itemName: 'Holzschwert'
 *       date: "2022-05-12 10:11:35.027 +00:00"
 *       createdAt: "2022-05-12 10:11:35.027 +00:00"
 *       updatedAt: "2022-05-12 10:11:35.027 +00:00"
 */
//#endregion

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item: Model<HistoryStealItem>[];
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historySteal.findAll({ order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>[];
            } else item = await channel.database.sequelize.models.historySteal.findAll({ order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>[];

            if (item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/sourcehero/:name', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item: Model<HistoryStealItem>;
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historySteal.findOne({ where: { sourceHeroName: request.params.name }, order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>;
            } else item = await channel.database.sequelize.models.historySteal.findOne({ where: { sourceHeroName: request.params.name }, order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>;

            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/targethero/:name', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item: Model<HistoryStealItem>;
        let node: NodeItem;

        if (request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if (channel) {
            if (request.query.childs !== "false") {
                item = await channel.database.sequelize.models.historySteal.findOne({ where: { targetHeroName: request.params.name }, order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>;
            } else item = await channel.database.sequelize.models.historySteal.findOne({ where: { targetHeroName: request.params.name }, order: [['handle', 'ASC']], limit: 1000 }) as Model<HistoryStealItem>;

            if (item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
export default router;