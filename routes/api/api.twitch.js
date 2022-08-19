"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const uniqid = require("uniqid");
const router = express.Router();
const endpoint = 'twitch';
router.get('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace('GET ' + endpoint);
    const twitch = request.app.get('twitch');
    if (!request.session.state)
        request.session.state = uniqid();
    response.status(200).json({ url: twitch.url_authorize + '?client_id=' + twitch.client_id +
            '&redirect_uri=' + twitch.redirect_uri +
            '&response_type=' + twitch.response_type +
            '&scope=' + twitch.scope +
            '&state=' + request.session.state });
}));
router.get('/' + endpoint + '/userdata', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace('GET ' + endpoint + '/userdata');
    if (request.session.userData != null) {
        response.status(200).json(request.session.userData);
    }
    else
        response.status(404).json();
}));
router.post('/' + endpoint + '/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    global.worker.log.trace('PUT ' + endpoint);
    if (request.session.userData != null) {
        const node = (yield global.worker.globalDatabase.sequelize.models.node.findOrCreate({
            defaults: {
                name: request.session.userData.login,
                displayName: request.session.userData.display_name,
                endpoint: request.app.get("twitch").url_twitch + request.session.userData.login
            },
            where: { name: request.session.userData.login }
        }))[0];
        node.type = request.session.userData.type;
        node.broadcasterType = request.session.userData.broadcaster_type;
        node.description = request.session.userData.description;
        node.profileImageUrl = request.session.userData.profile_image_url;
        node.eMail = request.session.userData.email;
        yield global.worker.globalDatabase.sequelize.models.node.update(node, { where: { name: request.session.userData.login } });
        yield global.worker.startNode(node);
        response.status(200).json();
    }
    else
        response.status(404).json();
}));
exports.default = router;
//# sourceMappingURL=api.twitch.js.map