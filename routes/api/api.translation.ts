import express from 'express';
import { Op } from 'sequelize';
import { Model } from 'sequelize-typescript';
import { TranslationItem } from '../../model/translationItem';

const router = express.Router();
const endpoint = 'translation';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { language: request.query.language }, order: [['handle', 'ASC']] }) as Model<TranslationItem>[];
        if (item) response.status(200).json(item);
        else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:page', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, page ${request.params.page}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: request.params.page, language: request.query.language }, order: [['handle', 'ASC']] }) as Model<TranslationItem>[];;
        if (item) response.status(200).json(item);
        else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.post('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, page ${request.body.pages}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: { [Op.in]: request.body.pages }, language: request.query.language }, order: [['handle', 'ASC']], raw: true });
        if (item) response.status(200).json(item);
        else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});
export default router;