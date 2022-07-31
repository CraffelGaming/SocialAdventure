import * as express from 'express';

const router = express.Router();
const endpoint = 'menu';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    const item = await global.worker.globalDatabase.sequelize.models.menu.findAll({order: [ [ 'order', 'ASC' ]], raw: true});
    if(item) response.status(200).json(item);
    else response.status(404).json();
});

export default router;