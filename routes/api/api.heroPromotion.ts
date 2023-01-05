import express from 'express';
import { Model } from 'sequelize-typescript';
import { HeroPromotionItem } from '../../model/heroPromotionItem.js';
import { NodeItem } from '../../model/nodeItem.js';

const router = express.Router();
const endpoint = 'heropromotion';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let item : Model<HeroPromotionItem>[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.heroPromotion.findAll({order: [ [ 'heroName', 'ASC' ], [ 'promotionHandle', 'ASC' ]], include: [{
                    model: channel.database.sequelize.models.hero,
                    as: 'hero',
                },{
                    model: channel.database.sequelize.models.promotion,
                    as: 'promotion',
                }]}) as Model<HeroPromotionItem>[];
            } else item = await channel.database.sequelize.models.heroPromotion.findAll({order: [ [ 'heroName', 'ASC' ], [ 'promotionHandle', 'ASC' ]], }) as Model<HeroPromotionItem>[];

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
        let item : Model<HeroPromotionItem>[];
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(request.query.childs !== "false"){
                item = await channel.database.sequelize.models.heroPromotion.findAll({where: { heroName: request.params.name }, order: [ [ 'heroName', 'ASC' ], [ 'promotionHandle', 'ASC' ]], include: [{
                    model: channel.database.sequelize.models.hero,
                    as: 'hero',
                },{
                    model: channel.database.sequelize.models.promotion,
                    as: 'promotion',
                }]}) as Model<HeroPromotionItem>[];
            } else item = await channel.database.sequelize.models.heroPromotion.findAll({where: { heroName: request.params.name }, order: [ [ 'heroName', 'ASC' ], [ 'promotionHandle', 'ASC' ]]}) as Model<HeroPromotionItem>[];

            if(item) response.status(200).json(item.filter(x => x.getDataValue('promotion') != null));
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;