import express from 'express';
import { Model } from 'sequelize-typescript';
import { MenuItem } from '../../model/menuItem.js';

const router = express.Router();
const endpoint = 'menu';

router.get('/' + endpoint + '/', async (request: express.Request, response: express.Response) => {
    try {
        global.worker.log.trace(`get ${endpoint}`);
        let item: Model<MenuItem>[];

        if (request.query.childs !== "false") {
            item = await global.worker.globalDatabase.sequelize.models.menu.findAll({
                where: { isActive: true }, order: [['order', 'ASC']], include: [{
                    model: global.worker.globalDatabase.sequelize.models.menu,
                    as: 'childs',
                }, {
                    model: global.worker.globalDatabase.sequelize.models.menu,
                    as: 'parent',
                }]
            }) as Model<MenuItem>[];
        } else item = await global.worker.globalDatabase.sequelize.models.menu.findAll({ where: { isActive: true }, order: [['order', 'ASC']] }) as Model<MenuItem>[];

        if (!global.isRegistered(request, response)) {
            item = item.filter(x => x.getDataValue('authenticationRequired') === false)
        }

        // if(!request.session.node) {
        //    item = item.filter(x => x.nodeRequired === false)
        // }

        if (item) response.status(200).json(item);
        else response.status(404).json();
    } catch (ex) {
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;