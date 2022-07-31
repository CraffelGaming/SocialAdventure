import * as express from 'express';

const router = express.Router();
const endpoint = 'translation';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { language: request.query.language }, order: [ [ 'handle', 'ASC' ]], raw: true});
    if(item) response.status(200).json(item);
    else response.status(404).json();
});

router.get('/' + endpoint + '/:page', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    const item = await global.worker.globalDatabase.sequelize.models.translation.findAll({where: { page: request.params.page, language: request.query.language }, order: [ [ 'handle', 'ASC' ]], raw: true});
    if(item) response.status(200).json(item);
    else response.status(404).json();
});
export default router;