import express from 'express';

const router = express.Router();
const endpoint = 'validation';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}`);
        const item = await global.worker.globalDatabase.sequelize.models.validation.findAll();
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:page', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, page ${request.params.page}`);
        const item = await global.worker.globalDatabase.sequelize.models.validation.findAll({where: { page: request.params.page }, raw: true});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;