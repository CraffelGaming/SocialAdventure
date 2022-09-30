import * as express from 'express';
import seedrandom from 'seedrandom';
import { Model } from 'sequelize-typescript';
import { DailyItem } from '../../model/dailyItem';
import { NodeItem } from '../../model/nodeItem';
const router = express.Router();
const endpoint = 'daily';

router.get('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        const item = await channel.database.sequelize.models.daily.findAll({order: [ [ 'handle', 'ASC' ]], raw: false });
        if(item) response.status(200).json(item);
        else response.status(404).json();
    } else response.status(404).json();
});

router.get('/' + endpoint + '/:node/random/:count', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`get ${endpoint}, node ${request.params.node} random`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        const item = await channel.database.sequelize.models.daily.findAll({order: [ [ 'handle', 'ASC' ]], raw: false }) as Model<DailyItem>[];
        const generatorDaily = seedrandom(new Date().toDateString());
        const generatorReward = seedrandom(new Date().toDateString());
        const found: DailyItem[] = [];
        const count: number = Number(request.params.count);

        if(!isNaN(count)){
            for(let i = 1; i <= count; i++){
                const rand = Math.floor(generatorDaily() * (item.length - 0 + 1) + 0);
                global.worker.log.trace(`get ${endpoint}, node ${request.params.node} new random number ${rand}`);
                const element = item[rand].get();
                element.gold = Math.floor(generatorReward() * (element.goldMax - element.goldMin + 1) + element.goldMin);
                element.experience = Math.floor(generatorReward() * (element.experienceMax - element.experienceMin + 1) + element.experienceMin);
                found.push(element);
            }
        }

        if(found) response.status(200).json(found);
        else response.status(404).json();
    } else response.status(404).json();
});

router.put('/' + endpoint + '/:node/', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`put ${endpoint}, node ${request.params.node}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

    if(channel) {
        if(global.isMaster(request, response, node)){
            response.status(await DailyItem.put({ sequelize: channel.database.sequelize, element: request.body})).json(request.body);
        } else {
            response.status(403).json();
        }
    } else response.status(404).json();
});

router.delete('/' + endpoint + '/:node/:handle', async (request: express.Request, response: express.Response) => {
    global.worker.log.trace(`delete ${endpoint}, node ${request.params.node}, handle ${request.params.handle}`);
    let node: NodeItem;

    if(request.params.node === 'default')
        node = await global.defaultNode(request, response);
    else node = await global.worker.globalDatabase.sequelize.models.node.findByPk(request.params.node) as NodeItem;

    const channel = global.worker.channels.find(x => x.node.name === node.name)

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
});

export default router;