import express from 'express';

const endpoint = 'item';

const router = express.Router();

router.get('/' + endpoint, (request: express.Request, response: express.Response) => {
    response.render(endpoint, {
        title: 'Social Adventure'
    });
});

export default router;