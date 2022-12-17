import fetch from 'node-fetch';
import * as fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const twitchData = JSON.parse(fs.readFileSync(path.join(dirname, '/../', 'twitch.json')).toString());
export class Twitch {
    //#region Load
    async load(channelName) {
        try {
            global.worker.log.trace(`api connect with node ${channelName}`);
            this.channelName = channelName;
            this.twitch = await global.worker.globalDatabase.sequelize.models.twitch.findByPk(this.channelName);
            this.twitchUser = await global.worker.globalDatabase.sequelize.models.twitchUser.findByPk(this.channelName);
            if (this.twitch && this.twitchUser) {
                global.worker.log.trace(`api connected accessToken ${this.twitch.getDataValue("accessToken")}, refreshToken ${this.twitch.getDataValue("refreshToken")}`);
                global.worker.log.trace(`api connected broadcasterType ${this.twitchUser.getDataValue("broadcasterType")}, displayName ${this.twitchUser.getDataValue("displayName")}`);
            }
            else
                global.worker.log.error(`api connection failed`);
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function load - ${ex.message}`);
        }
    }
    //#endregion
    //#region Push
    async push(method, endpoint, refresh = true) {
        try {
            const response = await fetch(twitchData.url_base + endpoint, {
                method,
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': twitchData.client_id,
                    'Authorization': 'Bearer ' + this.twitch.getDataValue('accessToken'),
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const json = await response.json();
                global.worker.log.trace(`api request, node ${this.channelName}, ${method} ${twitchData.url_base}${endpoint} OK`);
                global.worker.log.trace(json);
                const result = json.data;
                return result;
            }
            else if (response.status === 401) {
                global.worker.log.trace(`api request, node ${this.channelName}, ${method} ${twitchData.url_base}${endpoint} 401`);
                if (refresh) {
                    this.credential = await this.authentificationRefresh();
                    if (this.credential != null) {
                        await this.updateTwitch(this.credential);
                        return this.push(method, endpoint, false);
                    }
                }
            }
            else {
                global.worker.log.error(`api request, node ${this.channelName}, ${method} ${twitchData.url_base}${endpoint}`);
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function push - ${ex.message}`);
        }
        return null;
    }
    //#endregion
    //#region API
    async GetChannel(id) {
        try {
            return (await this.push('GET', '/channels?broadcaster_id=' + id))[0];
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    async GetModerators(id) {
        try {
            return (await this.push('GET', '/moderation/moderators?broadcaster_id=' + id));
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    async GetStream(id) {
        try {
            return (await this.push('GET', '/streams?user_id=' + id))[0];
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    async getUser(id) {
        try {
            return (await this.push('GET', '/users?id=' + id))[0];
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    async getUserByName(name) {
        try {
            return (await this.push('GET', '/users?login=' + name))[0];
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    async getCurrentUser(credential) {
        try {
            const response = await fetch(twitchData.url_base + '/users', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': twitchData.client_id,
                    'Authorization': 'Bearer ' + credential.access_token,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const json = await response.json();
                global.worker.log.trace(json);
                const result = json.data[0];
                return result;
            }
            else if (response.status === 401) {
                global.worker.log.trace('refresh access token');
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function getCurrentUser - ${ex.message}`);
        }
        return null;
    }
    //#endregion
    //#region Authentification
    async authentification(code) {
        try {
            const twitch = await fetch(twitchData.url_token +
                '?client_id=' + twitchData.client_id +
                '&client_secret=' + twitchData.client_secret +
                '&code=' + code +
                '&grant_type=' + twitchData.user_grant_type +
                '&redirect_uri=' + twitchData.redirect_uri, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (await twitch.json());
                global.worker.log.trace(result);
                return result;
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function authentification - ${ex.message}`);
        }
        return null;
    }
    async authentificationRefresh() {
        try {
            global.worker.log.trace(`api request, node ${this.channelName}, authentificationRefresh`);
            const twitch = await fetch(twitchData.url_token +
                '?client_id=' + twitchData.client_id +
                '&client_secret=' + twitchData.client_secret +
                '&refresh_token=' + this.twitch.getDataValue("refreshToken") +
                '&grant_type=' + twitchData.user_grant_type_refresh +
                '&redirect_uri=' + twitchData.redirect_uri, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (await twitch.json());
                global.worker.log.trace(result);
                return result;
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function authentificationRefresh - ${ex.message}`);
        }
        return null;
    }
    //#endregion
    //#region Login
    async login(state, code) {
        try {
            this.credential = await this.authentification(code);
            if (this.credential) {
                global.worker.log.trace(`login - credential valid`);
                this.credentialUser = await this.getCurrentUser(this.credential);
                if (this.credentialUser) {
                    global.worker.log.trace(`login - credential user valid`);
                    await this.saveTwitch(state, this.credential, this.credentialUser);
                    await this.saveTwitchUser(this.credentialUser);
                    return true;
                }
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function login - ${ex.message}`);
        }
        return false;
    }
    async saveTwitch(state, credential, user) {
        global.worker.log.trace(`login - saveTwitch`);
        try {
            this.twitch = (await global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
                defaults: { state },
                where: { channelName: user.login }
            }))[0];
            this.twitch.setDataValue('accessToken', credential.access_token);
            this.twitch.setDataValue('refreshToken', credential.refresh_token);
            this.twitch.setDataValue('scope', credential.scope.join(' '));
            this.twitch.setDataValue('tokenType', credential.token_type);
            this.twitch.setDataValue('state', state);
            return await this.twitch.save();
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function saveTwitch - ${ex.message}`);
        }
        return null;
    }
    async updateTwitch(credential) {
        global.worker.log.trace(`login - updateTwitch`);
        try {
            this.twitch = (await global.worker.globalDatabase.sequelize.models.twitch.findByPk(this.channelName));
            this.twitch.setDataValue('accessToken', credential.access_token);
            this.twitch.setDataValue('refreshToken', credential.refresh_token);
            this.twitch.setDataValue('scope', credential.scope.join(' '));
            this.twitch.setDataValue('tokenType', credential.token_type);
            return await this.twitch.save();
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function updateTwitch - ${ex.message}`);
        }
        return null;
    }
    async saveTwitchUser(user) {
        global.worker.log.trace(`login - saveTwitchUser`);
        try {
            this.twitchUser = (await global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
                defaults: { viewCount: 0 },
                where: { channelName: user.login }
            }))[0];
            this.twitchUser.setDataValue('displayName', user.display_name);
            this.twitchUser.setDataValue('type', user.type);
            this.twitchUser.setDataValue('broadcasterType', user.broadcaster_type);
            this.twitchUser.setDataValue('description', user.description);
            this.twitchUser.setDataValue('profileImageUrl', user.profile_image_url);
            this.twitchUser.setDataValue('viewCount', user.view_count);
            this.twitchUser.setDataValue('eMail', user.email);
            this.twitchUser.setDataValue('id', user.id);
            return await this.twitchUser.save();
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function saveTwitchUser - ${ex.message}`);
        }
        return null;
    }
    //#endregion
    //#region Bot
    static async botAuthentification() {
        try {
            const twitch = await fetch(twitchData.url_token + '?client_id=' + twitchData.client_id +
                '&client_secret=' + twitchData.client_secret +
                '&grant_type=' + twitchData.bot_grant_type, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (await twitch.json());
                global.worker.log.trace(result);
                return result;
            }
        }
        catch (ex) {
            global.worker.log.error(`twitch error - function botAuthentification - ${ex.message}`);
        }
        return null;
    }
}
//# sourceMappingURL=twitch.js.map