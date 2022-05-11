import * as express from 'express';
import { Connection } from './../../database/connection';

const router = express.Router();
const endpoint = 'version';

router.get('/' + endpoint + '/', async (req: express.Request, res: express.Response) => {
    res.status(200).json(await global.worker.globalDatabase.sequelize.models.VersionItem.findOne({order: [ [ 'id', 'DESC' ]], raw: true}));
});

export default router;