import express from 'express';
import { Model } from 'sequelize-typescript';
import { CommandItem } from '../../model/commandItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'command';

//#region swagger
/**
 * @swagger
 *
 * definitions:
 *   Command:
 *     type: object
 *     required:
 *       - module
 *     properties:
 *       module:
 *         type: string
 *         descrition: Name des Moduls
 *       command:
 *         type: string
 *         descrition: Name des Befehls
 *       isMaster:
 *         type: string
 *         descrition: Gibt an, ob nur der Streamer den Befehl verwenden darf
 *       isModerator:
 *         type: string
 *         descrition: Gibt an, ob Moderatoren den Befehl verwenden dürfen
 *       isCounter:
 *         type: string
 *         descrition: Gibt an, ob es sich bei den Befehl um einen Zähler handelt
 *       translation:
 *         type: string
 *         descrition: Name der Übersetzung
 *       createdAt:
 *         type: string
 *         descrition: Datum der Anlage
 *       updatedAt:
 *         type: string
 *         descrition: Datum der letzten Änderung
 *     example:
 *       module: 'say'
 *       command: 'text'
 *       isMaster: true
 *       isModerator: true
 *       isCounter: false
 *       createdAt: "2022-05-12 10:11:35.027 +00:00"
 *       updatedAt: "2022-05-12 10:11:35.027 +00:00"
 */
//#endregion

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            let item = await channel.database.sequelize.models.command.findAll({order: [ [ 'module', 'ASC' ], [ 'command', 'ASC' ]] }) as Model<CommandItem>[];

            if(!global.isMaster(request, response)) {
                item = item.filter(x => x.getDataValue('isMaster') === false)
            }

            if(request.query.counter !== "1") {
                item = item.filter(x => x.getDataValue('isCounter') === false)
            }

            if(item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/:module', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            let item = await channel.database.sequelize.models.command.findAll({where: { module: request.params.module}, order: [ [ 'module', 'ASC' ], [ 'command', 'ASC' ]] }) as Model<CommandItem>[];

            if(!global.isMaster(request, response, node)) {
                item = item.filter(x => x.getDataValue('isMaster') === false)
            }

            if(request.query.counter !== "1") {
                item = item.filter(x => x.getDataValue('isCounter') === false)
            }

            if(item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;