import express from 'express';
import { HeroWalletItem } from '../../model/heroWalletItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'herowallet';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item : HeroWalletItem[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.heroWallet.findAll({order: [ [ 'heroName', 'ASC' ]], raw: false, include: [{
                    model: channel.database.sequelize.models.hero,
                    as: 'hero',
                }]}) as unknown as HeroWalletItem[];
            } else item = await channel.database.sequelize.models.heroWallet.findAll({order: [ [ 'heroName', 'ASC' ]], raw: false }) as unknown as HeroWalletItem[];

            if(item) response.status(200).json(item);
            else response.status(404).json();

        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/hero/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}, hero ${request.params.name}`);
        let item : HeroWalletItem[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.heroWallet.findOne({where: { heroName: request.params.name }, raw: false, include: [{
                    model: channel.database.sequelize.models.hero,
                    as: 'hero',
                }]}) as unknown as HeroWalletItem[];
            } else item = await channel.database.sequelize.models.heroWallet.findOne({where: { heroName: request.params.name }, raw: false}) as unknown as HeroWalletItem[];

            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;