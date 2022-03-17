import * as express from 'express';

const endpoint = 'help';

const router = express.Router();

router.get('/' + endpoint, (req: express.Request, res: express.Response) => {
    res.render(endpoint, {
        title: 'Craffels Abenteuer'
    });
});

export default router;