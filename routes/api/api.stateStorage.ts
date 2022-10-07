import * as express from 'express';
import { StateStorageItem } from '../../model/stateStorageItem';

const router = express.Router();
const endpoint = 'stateStorage';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}`);
    if(global.isRegistered(request, response)){
        const item = await global.worker.globalDatabase.sequelize.models.stateStorage.findAll({where: { channelName: request.session.userData.login }, raw: true});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else {
        response.status(403).json();
    }
});

router.get('/' + endpoint + '/:name', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, name ${request.params.page}`);
    if(global.isRegistered(request, response)){
        const item = await global.worker.globalDatabase.sequelize.models.stateStorage.findOne({where: { handle: request.params.name, channelName: request.session.userData.login }, raw: true});
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else {
        response.status(403).json();
    }
});

router.put('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    if(global.isRegistered(request, response)){
        request.body.channelName = request.session.userData.login;
        response.status(await StateStorageItem.put({ sequelize: global.worker.globalDatabase.sequelize, element: request.body})).json(request.body);
    } else {
        response.status(403).json();
    }
});

router.delete('/' + endpoint + '/:name', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`delete ${endpoint}, name ${request.params.name}`);

    if(global.isRegistered(request, response)){
            const item = await global.worker.globalDatabase.sequelize.models.stateStorage.findOne({where: { handle: request.params.name, channelName: request.session.userData.login }}) as unknown as StateStorageItem;
            if(item){
                await global.worker.globalDatabase.sequelize.models.stateStorage.destroy({where: { handle: request.params.name, channelName: request.session.userData.login }});
                response.status(204).json();
            } else response.status(404).json();
    } else {
        response.status(403).json();
    }
});

export default router;