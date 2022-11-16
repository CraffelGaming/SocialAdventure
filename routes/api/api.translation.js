import express from 'express';
import { Op } from 'sequelize';
const router = express.Router();
const endpoint = 'translation';
router.get('/' + endpoint + '/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { language: request.query.language }, order: [['handle', 'ASC']], raw: true });
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
router.get('/' + endpoint + '/:page', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, page ${request.params.page}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: request.params.page, language: request.query.language }, order: [['handle', 'ASC']], raw: true });
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
router.post('/' + endpoint + '/', async (request, response) => {
    try {
        global.worker.log.trace(`get ${endpoint}, page ${request.body.pages}`);
        const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: { [Op.in]: request.body.pages }, language: request.query.language }, order: [['handle', 'ASC']], raw: true });
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
export default router;
//# sourceMappingURL=api.translation.js.map