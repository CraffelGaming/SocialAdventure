import * as express from 'express';

const router = express.Router();
const endpoint = 'version';

router.get('/' + endpoint + '/', async (req: express.Request, res: express.Response) => {
        res.status(200).json({ 'Version': '0.0.1' });
    });

export default router;