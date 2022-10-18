import * as express from 'express';
import { Model } from 'sequelize-typescript';
import { DailyItem } from '../../model/dailyItem';
import { HeroItem } from '../../model/heroItem';
import { NodeItem } from '../../model/nodeItem';
const router = express.Router();
const endpoint = 'daily';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            const item = await channel.database.sequelize.models.daily.findAll({order: [ [ 'handle', 'ASC' ]], raw: false });
            if(item) response.status(200).json(item);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/current/:count', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node} random`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)
        let found: DailyItem[];

        if(channel) {
            const count: number = Number(request.params.count);
            if(!isNaN(count)){
                found = await DailyItem.getCurrentDaily({sequelize: channel.database.sequelize, count });
            }
            if(found) response.status(200).json(found);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.get('/' + endpoint + '/:node/current/:count/hero/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`get ${endpoint}, node ${request.params.node} random`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)
        let found: DailyItem[];

        if(channel) {
            const count: number = Number(request.params.count);
            if(!isNaN(count)){
                found = await DailyItem.getCurrentDailyByHero({sequelize: channel.database.sequelize, count, heroName: request.params.name});
            }
            if(found) response.status(200).json(found);
            else response.status(404).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.post('/' + endpoint + '/:node/redeem/:number/hero/:name', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`post ${endpoint}, node ${request.params.node} random`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isChannel(request, response, request.params.name)){
                let found: DailyItem;
                const count: number = Number(request.params.number);

                if(!isNaN(count)){
                    found = (await DailyItem.getCurrentDailyByHero({sequelize: channel.database.sequelize, count, heroName: request.params.name}))[count - 1];
                }

                if(found){
                    const hero = await channel.database.sequelize.models.hero.findByPk(request.params.name) as Model<HeroItem>;

                    if(hero.getDataValue("lastDaily").setHours(0, 0, 0, 0) < found.date.setHours(0, 0, 0, 0)){
                        hero.setDataValue("lastDaily", found.date)
                        hero.save();

                        await channel.database.sequelize.models.heroWallet.increment('gold', { by: found.gold, where: { heroName: request.params.name}});
                        await channel.database.sequelize.models.hero.increment('experience', { by: found.experience, where: { name: request.params.name}});
                    } else found = null;
                }

                if(found) response.status(200).json(found);
                else response.status(404).json();

            } else response.status(403).json();
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                response.status(await DailyItem.put({ sequelize: channel.database.sequelize, globalSequelize: global.worker.globalDatabase.sequelize, element: request.body})).json(request.body);
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    try{
        global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
        let node: NodeItem;

        if(request.params.node === 'default')
            node = await global.defaultNode(request, response);
        else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

        const channel = global.worker.channels.find(x => x.node.getDataValue('name') === node.name)

        if(channel) {
            if(global.isMaster(request, response, node)){
                if(request.params.handle != null){
                    const item = await channel.database.sequelize.models.daily.findByPk(request.params.handle) as unknown as DailyItem;
                    if(item){
                        await channel.database.sequelize.models.daily.destroy({where: {handle: request.params.handle}});
                    }
                    response.status(204).json();
                } else response.status(404).json();
            } else {
                response.status(403).json();
            }
        } else response.status(404).json();
    } catch(ex){
        global.worker.log.error(`api endpoint ${endpoint} error - ${ex.message}`);
        response.status(500).json();
    }
});

export default router;