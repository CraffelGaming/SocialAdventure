import * as express from 'express';

const endpoint = 'twitch';

const router = express.Router();

router.get('/' + endpoint, (request: express.Request, response: express.Response) => {
    if(request.query.state === request.session.state){
        global.worker.login(request, response, callback);
    } else {
        response.render(endpoint, {
            title: 'Social Adventure'
        });
    }
});

function callback(request: express.Request, response: express.Response){
    response.render(endpoint, {
        title: 'Craffels Abenteuer'
    });
}

export default router;