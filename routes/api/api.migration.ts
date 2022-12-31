import express from 'express';
import { Model } from 'sequelize-typescript';
import { MigrationItem } from '../../model/migrationItem';

const router = express.Router();
const endpoint = 'migration';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}`);
        const item = await global.worker.globalDatabase.sequelize.models.migration.findAll({order: [ [ 'name', 'ASC' ]]}) as Model<MigrationItem>[];;
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;