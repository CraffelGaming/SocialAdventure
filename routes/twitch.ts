import * as express from 'express';

const endpoint = 'twitch';

const router = express.Router();

router.get('/' + endpoint, async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`login - twitch state ${request.query.state}`);
    global.worker.log.trace(`login - locale state ${request.session.state}`);

    if(request.query.state === request.session.state){
        await global.worker.login(request, response, callback);
    } else {
        global.worker.log.warn(`login - hack dedection, wrong state`);
        response.render(endpoint, {
            title: 'Social Adventure'
        });
    }
});

function callback(request: express.Request, response: express.Response){
    let url = endpoint;

    if(request.session && request.session.redirect && request.session.redirect.length > 0){
        global.worker.log.trace(`login - callback redirect ${request.session.redirect}`);
        url = request.session.redirect;
        request.session.redirect = null;
    }
    global.worker.log.trace(`login - callback ${request.query.state}`);
    response.render(url, {
        title: 'Craffels Abenteuer'
    });
}

export default router;