"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Twitch = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
class Twitch {
    twitchAuthentification(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.app.get('twitch');
            const twitch = yield (0, node_fetch_1.default)(data.url_token + '?client_id=' + data.client_id +
                '&client_secret=' + data.client_secret +
                '&code=' + request.query.code +
                '&grant_type=' + data.grant_type +
                '&redirect_uri=' + data.redirect_uri, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (yield twitch.json());
                global.worker.log.trace(result);
                request.session.twitch = result;
                return true;
            }
            return false;
        });
    }
    TwitchPush(request, response, method, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = request.app.get('twitch');
            const twitch = yield (0, node_fetch_1.default)(data.url_base + endpoint, {
                method,
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': data.client_id,
                    'Authorization': "Bearer " + request.session.twitch.access_token,
                    'Content-Type': 'application/json'
                },
            });
            if (twitch.ok) {
                const result = ((yield twitch.json()).data[0]);
                global.worker.log.trace(result);
                return result;
            }
            return null;
        });
    }
    saveTwitch(request, response, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const twitch = yield global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
                defaults: { state: request.session.state },
                where: { channelName: user.login }
            });
            twitch.accessToken = request.session.twitch.access_token;
            twitch.refreshToken = request.session.twitch.refresh_token;
            twitch.scope = request.session.twitch.scope.join(' ');
            twitch.tokenType = request.session.twitch.token_type;
            twitch.state = request.session.state;
            return yield global.worker.globalDatabase.sequelize.models.twitch.update(twitch, { where: { channelName: user.login } });
        });
    }
    saveTwitchUser(request, response, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const twitchUser = yield global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
                defaults: { viewCount: 0 },
                where: { channelName: user.login }
            });
            twitchUser.displayName = user.display_name;
            twitchUser.type = user.type;
            twitchUser.broadcasterType = user.broadcaster_type;
            twitchUser.description = user.description;
            twitchUser.profileImageUrl = user.profile_image_url;
            twitchUser.viewCount = user.view_count;
            twitchUser.eMail = user.email;
            return yield global.worker.globalDatabase.sequelize.models.twitchUser.update(twitchUser, { where: { channelName: user.login } });
        });
    }
}
exports.Twitch = Twitch;
module.exports.default = Twitch;
//# sourceMappingURL=twitch.js.map