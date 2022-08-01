import * as express from 'express';
import { TwitchItem } from '../model/twitchItem';
import { TwitchUserItem } from '../model/twitchUserItem';
import log4js = require('log4js');

import server = require('request');

export class Twitch {
    log: log4js.Logger;

    constructor(log: log4js.Logger){
        this.log = log;
    }

    WebAuth(request: express.Request, response: express.Response, callback: any) {
        const twitch = request.app.get('twitch');
        server(twitch.url_token + '?client_id=' + twitch.client_id +
                                   '&client_secret=' + twitch.client_secret +
                                   '&code=' + request.query.code +
                                   '&grant_type=' + twitch.grant_type +
                                   '&redirect_uri=' + twitch.redirect_uri, {
                                        json: true,
                                        method: "POST"
                                    }, (twitchError, twitchResponse, twitchBody) => {
            if (twitchError) { return this.log.error(twitchError);}
            switch(twitchResponse.statusCode){
                case 200:
                    request.session.twitch = twitchResponse.body;
                    this.WebPush(request, response,"GET", "/users?client_id=" + twitch.client_id, this.WebAuthChannel);
                    callback(request, response);
                    break;
                default:
                    this.WebRefresh(request, response, callback);
                    break;
            }
        });
    }

    WebRefresh(request: express.Request, response: express.Response, callback: any) {
        const twitch = request.app.get('twitch');
        server(twitch.url_token + '?client_id=' + twitch.client_id +
                                   '&client_secret=' + twitch.client_secret +
                                   '&grant_type=' + twitch.refresh_type +
                                   '&refresh_token=' + request.session.twitch.refresh_token, {
                                        json: true,
                                        method: "POST"
                                    }, async (twitchError, twitchResponse, twitchBody) => {
            if (twitchError) { return this.log.error(twitchError); }
            switch(twitchResponse.statusCode){
                case 200:
                    request.session.twitch = twitchResponse.body;
                    this.WebPush(request, response,"GET", "/users?client_id=" + twitch.client_id, this.WebAuthChannel);
                    callback(request, response);
                    break;
                default:
                    break;
            }
        });
    }

    WebPush(req, res, method, endpoint, callback) {
        const twitch = req.app.get('twitch');
        server(twitch.url_base + endpoint, {
            method,
            auth : { "bearer": req.session.twitch.access_token },
            headers : { 'client-id' : twitch.client_id }
        }, (twitchError, twitchResponse, twitchBody) => {
            if (twitchError) { return this.log.error(twitchError); }
            callback(req, res, twitchError, twitchResponse, JSON.parse(twitchResponse.body));
        });
    }

    async WebAuthChannel(request: express.Request, response: express.Response, twitchError : any, twitchResponse : any, twitchBody : any){

        const twitch: TwitchItem = await global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
            defaults: { state: request.session.state },
            where: { channelName: twitchBody.data[0].login }
        }) as unknown as TwitchItem;

        twitch.channelName = twitchBody.data[0].login;
        twitch.accessToken = request.session.twitch.access_token;
        twitch.refreshToken = request.session.twitch.refresh_token;
        twitch.scope = request.session.twitch.scope.join(' ');
        twitch.tokenType = request.session.twitch.token_type;
        twitch.state = request.session.state;
        global.worker.globalDatabase.sequelize.models.twitch.create(twitch as any);

        const twitchUser: TwitchUserItem = await global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
            where: { channelName: twitchBody.data[0].login }
        })as unknown as TwitchUserItem;

        twitchUser.displayName = twitchBody.data[0].display_name;
        twitchUser.type = twitchBody.data[0].type;
        twitchUser.broadcasterType = twitchBody.data[0].broadcaster_type;
        twitchUser.description = twitchBody.data[0].description;
        twitchUser.profileImageUrl = twitchBody.data[0].profile_image_url;
        twitchUser.viewCount = twitchBody.data[0].view_count;
        twitchUser.eMail = twitchBody.data[0].email;
        global.worker.globalDatabase.sequelize.models.twitchUser.create(twitchUser as any);
    }
}

module.exports.default = Twitch;