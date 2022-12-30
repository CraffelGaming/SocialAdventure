import { Connection } from '../database/connection.js';
import { Say } from '../module/say.js';
import { Loot } from '../module/loot.js';
import { Puffer } from './puffer.js';
import { Twitch } from './twitch.js';
export class Channel {
    //#region Construct
    constructor(node, translation) {
        this.node = node;
        this.countMessages = 0;
        this.twitch = new Twitch();
        this.translation = translation;
        this.stream = null;
        this.database = new Connection({ databaseName: Buffer.from(node.getDataValue('name')).toString('base64') });
        this.puffer = new Puffer(node),
            this.puffer.interval();
        this.say = [];
        this.streamWatcher();
    }
    //#endregion
    //#region Initialize
    async initialize() {
        try {
            global.worker.log.info(`node ${this.node.getDataValue('name')}, initialize`);
            await this.twitch.load(this.node.getDataValue('name'));
            await this.database.initialize();
            await this.addSays();
            await this.addLoot();
            this.moderators = await this.getModerators();
        }
        catch (ex) {
            global.worker.log.error(`channel error - function initialize - ${ex.message}`);
        }
    }
    async getModerators() {
        let moderators = [];
        try {
            global.worker.log.info(`node ${this.node.getDataValue('name')}, load moderators, id: ${this.twitch.twitchUser.getDataValue('id')}`);
            moderators = await this.twitch.GetModerators(this.twitch.twitchUser.getDataValue('id'));
            if (!moderators)
                moderators = [];
            global.worker.log.info(`node ${this.node.getDataValue('name')}, finish load moderators, count: ${moderators.length}`);
        }
        catch (ex) {
            global.worker.log.error(`channel error - function initialize - ${ex.message}`);
        }
        return moderators;
    }
    //#endregion
    //#region Stream / Twitch Watcher
    streamWatcher() {
        global.worker.log.info(`node ${this.node.getDataValue('name')}, add streamWatcher`);
        setInterval(async () => {
            global.worker.log.trace(`node ${this.node.getDataValue('name')}, streamWatcher run`);
            try {
                if (this.twitch) {
                    const stream = await this.twitch.GetStream(this.twitch.twitchUser.getDataValue('id'));
                    if (stream && stream.type === 'live') {
                        if (!this.node.getDataValue('isLive')) {
                            global.worker.log.info(`node ${this.node.getDataValue('name')}, streamWatcher is now live`);
                            this.node.setDataValue('isLive', true);
                            await this.node.save();
                            await this.startSays();
                            await this.startLoot();
                            this.puffer.addMessage(this.translation.find(x => x.getDataValue('handle') === 'botOnline').getDataValue('translation'));
                            this.moderators = await this.getModerators();
                        }
                        else {
                            global.worker.log.trace(`node ${this.node.getDataValue('name')}, streamWatcher nothing changed, live: ${this.node.getDataValue('isLive')}`);
                        }
                    }
                    else if (this.node.getDataValue('isLive')) {
                        global.worker.log.info(`node ${this.node.getDataValue('name')}, streamWatcher is not longer live`);
                        this.node.setDataValue('isLive', false);
                        await this.node.save();
                        await this.stopSays();
                        await this.stopLoot();
                        this.puffer.addMessage(this.translation.find(x => x.getDataValue('handle') === 'botOffline').getDataValue('translation'));
                    }
                    else {
                        global.worker.log.trace(`node ${this.node.getDataValue('name')}, streamWatcher nothing changed, live: ${this.node.getDataValue('isLive')}`);
                    }
                }
            }
            catch (ex) {
                global.worker.log.error(`channel error - function streamWatcher - ${ex.message}`);
            }
        }, 1000 * 120 // 5 Minute(n)
        );
    }
    //#endregion
    //#region Say
    async addSays() {
        try {
            const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'say', language: this.node.getDataValue('language') }, order: [['handle', 'ASC']] });
            for (const item of await this.database.sequelize.models.say.findAll({ order: [['command', 'ASC']] })) {
                global.worker.log.trace(`node ${this.node.getDataValue('name')}, say add ${item.getDataValue("command")}.`);
                const element = new Say(translation, this, item);
                await element.initialize();
                this.say.push(element);
                global.worker.log.info(`node ${this.node.getDataValue('name')}, say add ${element.item.getDataValue("command")}.`);
                if (element.item.getDataValue("isShoutout")) {
                    global.worker.log.trace(`module ${element.item.getDataValue("command")} isShoutout ${element.item.getDataValue("isShoutout")}`);
                    element.commands.find(x => x.getDataValue('command') === '').setDataValue('isModerator', true);
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function addSays - ${ex.message}`);
        }
    }
    async stopSays() {
        try {
            for (const item of this.say) {
                if (item.item.getDataValue("isLiveAutoControl")) {
                    await item.stop();
                    global.worker.log.info(`node ${this.node.getDataValue('name')}, stop module ${item.item.getDataValue("command")}.`);
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function stopSays - ${ex.message}`);
        }
    }
    async startSays() {
        try {
            for (const item of this.say) {
                if (item.item.getDataValue("isLiveAutoControl")) {
                    await item.start();
                    global.worker.log.info(`node ${this.node.getDataValue('name')}, stop module ${item.item.getDataValue("command")}.`);
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function startSays - ${ex.message}`);
        }
    }
    async addSay(item) {
        try {
            const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'say', language: this.node.getDataValue('language') }, order: [['handle', 'ASC']] });
            const element = new Say(translation, this, item);
            await element.initialize();
            this.say.push(element);
            global.worker.log.info(`node ${this.node.getDataValue('name')}, say add ${element.item.getDataValue("command")}.`);
        }
        catch (ex) {
            global.worker.log.error(`channel error - function addSay - ${ex.message}`);
        }
    }
    async removeSay(command) {
        try {
            const index = this.say.findIndex(d => d.item.getDataValue("command") === command);
            if (index > -1) {
                global.worker.log.info(`node ${this.node.getDataValue('name')}, say remove ${this.say[index].item.getDataValue("command")}.`);
                this.say[index].remove();
                this.say.splice(index, 1);
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function removeSay - ${ex.message}`);
        }
    }
    //#endregion
    //#region Loot
    async addLoot() {
        try {
            const translation = await global.worker.globalDatabase.sequelize.models.translation.findAll({ where: { page: 'loot', language: this.node.getDataValue('language') }, order: [['handle', 'ASC']] });
            this.loot = new Loot(translation, this);
            await this.loot.initialize();
            await this.loot.InitializeLoot();
        }
        catch (ex) {
            global.worker.log.error(`channel error - function addLoot - ${ex.message}`);
        }
    }
    async stopLoot() {
        try {
            if (this.loot.settings.find(x => x.getDataValue("command") === 'loot').getDataValue("isLiveAutoControl")) {
                await this.loot.lootclear();
                await this.loot.lootstop();
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function stopLoot - ${ex.message}`);
        }
    }
    async startLoot() {
        try {
            if (this.loot.settings.find(x => x.getDataValue("command") === 'loot').getDataValue("isLiveAutoControl")) {
                await this.loot.lootstart();
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function startLoot - ${ex.message}`);
        }
    }
    //#endregion
    //#region Execute
    async execute(command) {
        const messages = [];
        try {
            messages.push(await this.loot.execute(command));
            for (const key in Object.keys(this.say)) {
                if (this.say.hasOwnProperty(key)) {
                    messages.push(await this.say[key].execute(command));
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`channel error - function execute - ${ex.message}`);
        }
        return messages;
    }
}
//# sourceMappingURL=channel.js.map