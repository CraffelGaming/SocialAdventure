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
const twitch_json_1 = __importDefault(require("../twitch.json"));
const node_fetch_1 = __importDefault(require("node-fetch"));
class Twitch {
    //#region Load
    load(channelName) {
        return __awaiter(this, void 0, void 0, function* () {
            global.worker.log.trace(`api connect with node ${channelName}`);
            this.channelName = channelName;
            this.twitch = (yield global.worker.globalDatabase.sequelize.models.twitch.findByPk(this.channelName));
            this.twitchUser = (yield global.worker.globalDatabase.sequelize.models.twitchUser.findByPk(this.channelName));
            if (this.twitch && this.twitchUser) {
                global.worker.log.trace(`api connected accessToken ${this.twitch.getDataValue("accessToken")}, refreshToken ${this.twitch.getDataValue("refreshToken")}`);
                global.worker.log.trace(`api connected broadcasterType ${this.twitchUser.getDataValue("broadcasterType")}, displayName ${this.twitchUser.getDataValue("displayName")}`);
            }
            else
                global.worker.log.error(`api connection failed`);
        });
    }
    //#endregion
    //#region Push
    push(method, endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(twitch_json_1.default.url_base + endpoint, {
                method,
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': twitch_json_1.default.client_id,
                    'Authorization': 'Bearer ' + this.twitch.getDataValue('accessToken'),
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const json = yield response.json();
                global.worker.log.trace(`api request, node ${this.channelName}, ${method} ${twitch_json_1.default.url_base}${endpoint} OK`);
                global.worker.log.trace(json);
                const result = json.data[0];
                global.worker.log.trace(result);
                return result;
            }
            else if (response.status === 401) {
                global.worker.log.trace(`api request, node ${this.channelName}, ${method} ${twitch_json_1.default.url_base}${endpoint} 401`);
                global.worker.log.trace('refresh access token');
            }
            else {
                global.worker.log.error(`api request, node ${this.channelName}, ${method} ${twitch_json_1.default.url_base}${endpoint}`);
            }
            return null;
        });
    }
    //#endregion
    //#region API
    GetChannel(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.push('GET', '/channels?broadcaster_id=' + id);
        });
    }
    GetStream(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.push('GET', '/streams?user_id=' + id);
        });
    }
    getUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.push('GET', '/users?id=' + id);
        });
    }
    getCurrentUser(credential) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, node_fetch_1.default)(twitch_json_1.default.url_base + '/users', {
                method: 'GET',
                withCredentials: true,
                credentials: 'include',
                headers: {
                    'client-id': twitch_json_1.default.client_id,
                    'Authorization': 'Bearer ' + credential.access_token,
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const result = ((yield response.json()).data[0]);
                global.worker.log.trace(result);
                return result;
            }
            else if (response.status === 401) {
                global.worker.log.trace('refresh access token');
            }
            return null;
        });
    }
    //#endregion
    //#region Authentification
    authentification(code) {
        return __awaiter(this, void 0, void 0, function* () {
            const twitch = yield (0, node_fetch_1.default)(twitch_json_1.default.url_token + '?client_id=' + twitch_json_1.default.client_id +
                '&client_secret=' + twitch_json_1.default.client_secret +
                '&code=' + code +
                '&grant_type=' + twitch_json_1.default.user_grant_type +
                '&redirect_uri=' + twitch_json_1.default.redirect_uri, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (yield twitch.json());
                global.worker.log.trace(result);
                return result;
            }
            return null;
        });
    }
    //#endregion
    //#region Login
    login(state, code) {
        return __awaiter(this, void 0, void 0, function* () {
            this.credential = yield this.authentification(code);
            if (this.credential) {
                this.credentialUser = yield this.getCurrentUser(this.credential);
                if (this.credentialUser) {
                    yield this.saveTwitch(state, this.credential, this.credentialUser);
                    yield this.saveTwitchUser(this.credentialUser);
                    return true;
                }
            }
            return false;
        });
    }
    saveTwitch(state, credential, user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.twitch = (yield global.worker.globalDatabase.sequelize.models.twitch.findOrCreate({
                defaults: { state },
                where: { channelName: user.login }
            }))[0];
            this.twitch.setDataValue('accessToken', credential.access_token);
            this.twitch.setDataValue('refreshToken', credential.refresh_token);
            this.twitch.setDataValue('scope', credential.scope.join(' '));
            this.twitch.setDataValue('tokenType', credential.token_type);
            this.twitch.setDataValue('state', state);
            return yield this.twitch.save();
        });
    }
    saveTwitchUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            this.twitchUser = (yield global.worker.globalDatabase.sequelize.models.twitchUser.findOrCreate({
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
            return yield this.twitchUser.save();
        });
    }
    //#endregion
    //#region Bot
    static botAuthentification() {
        return __awaiter(this, void 0, void 0, function* () {
            const twitch = yield (0, node_fetch_1.default)(twitch_json_1.default.url_token + '?client_id=' + twitch_json_1.default.client_id +
                '&client_secret=' + twitch_json_1.default.client_secret +
                '&grant_type=' + twitch_json_1.default.bot_grant_type, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
            });
            if (twitch.ok) {
                const result = (yield twitch.json());
                global.worker.log.trace(result);
                return result;
            }
            return null;
        });
    }
}
exports.Twitch = Twitch;
module.exports.default = Twitch;
//# sourceMappingURL=twitch.js.map