import express from 'express';
import { Model } from 'sequelize-typescript';
import { VersionItem } from '../../model/versionItem';

const router = express.Router();
const endpoint = 'version';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}`);
        const item = await global.worker.globalDatabase.sequelize.models.version.findOne({order: [ [ 'version', 'DESC' ]]}) as Model<VersionItem>;
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;