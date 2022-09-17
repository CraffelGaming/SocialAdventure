import * as express from 'express';
import { TwitchItem } from '../model/twitchItem';
import { TwitchUserItem } from '../model/twitchUserItem';
import twitchData from '../twitch.json';

import fetch from 'node-fetch';

export class Twitch {

    async twitchBotAuthentification() {
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

        return null;
    }

    async twitchAuthentification(request: express.Request, response: express.Response) {
        const twitch = await fetch(twitchData.url_token + '?client_id=' + twitchData.client_id +
            '&client_secret=' + twitchData.client_secret +
            '&code=' + request.query.code +
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
            request.session.twitch = result;
            return true;
        }

        return false;
    }

    async TwitchPush(request: express.Request, response: express.Response, method: string, endpoint: string) {
        const twitch = await fetch(twitchData.url_base + endpoint, {
                method,
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': twitchData.client_id,
                    'Authorization': "Bearer " + request.session.twitch.access_token,
                    'Content-Type': 'application/json'
                },
            });

        if (twitch.ok) {
            const result = ((await twitch.json()).data[0]) as globalThis.credentialUserItem;
            global.worker.log.trace(result);
            return result;
        }

        return null;
    }

    async saveTwitch(request: express.Request, response: express.Response, user: globalThis.credentialUserItem){
        const twitch: TwitchItem = await global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
            defaults: { state: request.session.state },
            where: { channelName: user.login }
        }) as unknown as TwitchItem;

        twitch.accessToken = request.session.twitch.access_token;
        twitch.refreshToken = request.session.twitch.refresh_token;
        twitch.scope = request.session.twitch.scope.join(' ');
        twitch.tokenType = request.session.twitch.token_type;
        twitch.state = request.session.state;
        return await global.worker.globalDatabase.sequelize.models.twitch.update(twitch,{where: { channelName: user.login }});
    }

    async saveTwitchUser(request: express.Request, response: express.Response, user: globalThis.credentialUserItem){
        const twitchUser: TwitchUserItem = await global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
            defaults: { viewCount: 0 },
            where: { channelName: user.login }
        }) as unknown as TwitchUserItem;

        twitchUser.displayName = user.display_name;
        twitchUser.type = user.type;
        twitchUser.broadcasterType = user.broadcaster_type;
        twitchUser.description = user.description;
        twitchUser.profileImageUrl = user.profile_image_url;
        twitchUser.viewCount = user.view_count;
        twitchUser.eMail = user.email;
        return await global.worker.globalDatabase.sequelize.models.twitchUser.update(twitchUser,{where: { channelName: user.login }});
    }
}

module.exports.default = Twitch;