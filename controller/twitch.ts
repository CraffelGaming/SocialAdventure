import { TwitchItem } from '../model/twitchItem';
import { TwitchUserItem } from '../model/twitchUserItem';
import twitchData from '../twitch.json';

import fetch from 'node-fetch';
import { Model } from 'sequelize-typescript';

export class Twitch {
    channelName: string;
    twitch: Model<TwitchItem>;
    twitchUser: Model<TwitchUserItem>;
    credential: credentialItem;
    credentialUser: credentialUserItem;

    //#region Load
    async load(channelName: string){
        try {
            global.worker.log.trace(`api connect with node ${channelName}`);
            this.channelName = channelName;
            this.twitch = await global.worker.globalDatabase.sequelize.models.twitch.findByPk(this.channelName) as Model<TwitchItem>;
            this.twitchUser = await global.worker.globalDatabase.sequelize.models.twitchUser.findByPk(this.channelName) as Model<TwitchUserItem>;

            if(this.twitch && this.twitchUser) {
                global.worker.log.trace(`api connected accessToken ${this.twitch.getDataValue("accessToken")}, refreshToken ${this.twitch.getDataValue("refreshToken")}`);
                global.worker.log.trace(`api connected broadcasterType ${this.twitchUser.getDataValue("broadcasterType")}, displayName ${this.twitchUser.getDataValue("displayName")}`);
            }
            else global.worker.log.error(`api connection failed`);
        } catch(ex) {
            global.worker.log.error(`twitch error - function load - ${ex.message}`);
        }
    }
    //#endregion

    //#region Push
    async push<T>(method: string, endpoint: string, refresh: boolean = true) {
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
                const result = json.data[0] as T;
                return result;
            } else if(response.status === 401) {
                global.worker.log.trace(`api request, node ${this.channelName}, ${method} ${twitchData.url_base}${endpoint} 401`);
                if(refresh){
                    this.credential = await this.authentificationRefresh()
                    await this.updateTwitch(this.credential);
                    return this.push<T>(method, endpoint, false)
                }
            } else {
                global.worker.log.error(`api request, node ${this.channelName}, ${method} ${twitchData.url_base}${endpoint}`);
            }
        } catch(ex) {
            global.worker.log.error(`twitch error - function push - ${ex.message}`);
        }

        return null;
    }
    //#endregion

    //#region API
    async GetChannel(id: string){
        return await this.push('GET', '/channels?broadcaster_id=' + id);
    }

    async GetStream(id: string) : Promise<streamItem>{
        return await this.push<streamItem>('GET', '/streams?user_id=' + id);
    }

    async getUser(id: string){
        return await this.push('GET', '/users?id=' + id);
    }

    async getCurrentUser(credential: credentialItem) : Promise<credentialUserItem>{
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
        const result = json.data[0] as globalThis.credentialUserItem;
        return result;
    } else if(response.status === 401) {
        global.worker.log.trace('refresh access token');
    }

    return null;
    }
    //#endregion

    //#region Authentification
    async authentification(code: string) {
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
                const result = (await twitch.json()) as globalThis.credentialItem;
                global.worker.log.trace(result);
                return result;
            }
        } catch(ex) {
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
                const result = (await twitch.json()) as globalThis.credentialItem;
                global.worker.log.trace(result);
                return result;
            }
        } catch(ex) {
            global.worker.log.error(`twitch error - function authentificationRefresh - ${ex.message}`);
        }

        return null;
    }
    //#endregion

    //#region Login
    async login(state: string, code: string): Promise<boolean> {
        try {
            this.credential = await this.authentification(code);

            if(this.credential){
                this.credentialUser = await this.getCurrentUser(this.credential);

                if(this.credentialUser){
                    await this.saveTwitch(state, this.credential, this.credentialUser);
                    await this.saveTwitchUser(this.credentialUser);
                    return true;
                }
            }
        } catch(ex) {
            global.worker.log.error(`twitch error - function login - ${ex.message}`);
        }
        return false;
    }

    async saveTwitch(state: string, credential: credentialItem, user: globalThis.credentialUserItem): Promise<Model<TwitchItem>>{
        try {
            this.twitch = (await global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
                defaults: { state },
                where: { channelName: user.login }
            }))[0] as Model<TwitchItem>;

            this.twitch.setDataValue('accessToken', credential.access_token);
            this.twitch.setDataValue('refreshToken', credential.refresh_token);
            this.twitch.setDataValue('scope', credential.scope.join(' '));
            this.twitch.setDataValue('tokenType', credential.token_type);
            this.twitch.setDataValue('state', state);

            return await this.twitch.save() as Model<TwitchItem>;
        } catch(ex) {
            global.worker.log.error(`twitch error - function saveTwitch - ${ex.message}`);
        }

        return null;
    }

    async updateTwitch(credential: credentialItem): Promise<Model<TwitchItem>>{
        try {
            this.twitch = (await global.worker.globalDatabase.sequelize.models.twitch.findByPk(this.channelName)) as Model<TwitchItem>;

            this.twitch.setDataValue('accessToken', credential.access_token);
            this.twitch.setDataValue('refreshToken', credential.refresh_token);
            this.twitch.setDataValue('scope', credential.scope.join(' '));
            this.twitch.setDataValue('tokenType', credential.token_type);

            return await this.twitch.save() as Model<TwitchItem>;
        } catch(ex) {
            global.worker.log.error(`twitch error - function updateTwitch - ${ex.message}`);
        }

        return null;
    }

    async saveTwitchUser(user: globalThis.credentialUserItem): Promise<Model<TwitchUserItem>>{
        try {
            this.twitchUser = (await global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
                defaults: { viewCount: 0 },
                where: { channelName: user.login }
            }))[0] as Model<TwitchUserItem>;

            this.twitchUser.setDataValue('displayName', user.display_name);
            this.twitchUser.setDataValue('type', user.type);
            this.twitchUser.setDataValue('broadcasterType', user.broadcaster_type);
            this.twitchUser.setDataValue('description', user.description);
            this.twitchUser.setDataValue('profileImageUrl', user.profile_image_url);
            this.twitchUser.setDataValue('viewCount', user.view_count);
            this.twitchUser.setDataValue('eMail', user.email);
            this.twitchUser.setDataValue('id', user.id);

            return await this.twitchUser.save() as Model<TwitchUserItem>;
        } catch(ex) {
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
                const result = (await twitch.json()) as globalThis.credentialItem;
                global.worker.log.trace(result);
                return result;
            }
        } catch(ex) {
            global.worker.log.error(`twitch error - function botAuthentification - ${ex.message}`);
        }

        return null;
    }
    //#endregion
}

module.exports.default = Twitch;