import * as express from 'express';

const router = express.Router();
const endpoint = 'node';

router.get('/' + endpoint + '/', async (reqest: express.Request, response: express.Response) => {
    global.worker.log.trace('GET ' + endpoint);
    const item = await global.worker.globalDatabase.sequelize.models.node.findAll({order: [ [ 'name', 'ASC' ]], raw: true});
    if(item) response.status(200).json(item);
    else response.status(404).json();
});

export default router;