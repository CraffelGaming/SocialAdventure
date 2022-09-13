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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = __importStar(require("express"));
const help_1 = __importDefault(require("./help"));
const streamer_1 = __importDefault(require("./streamer"));
const twitch_1 = __importDefault(require("./twitch"));
const daily_1 = __importDefault(require("./daily"));
const command_1 = __importDefault(require("./command"));
const hero_1 = __importDefault(require("./hero"));
const heroes_1 = __importDefault(require("./heroes"));
const item_1 = __importDefault(require("./item"));
const itemCategory_1 = __importDefault(require("./itemCategory"));
const say_1 = __importDefault(require("./say"));
const statistic_1 = __importDefault(require("./statistic"));
const taverne_1 = __importDefault(require("./taverne"));
const level_1 = __importDefault(require("./level"));
const location_1 = __importDefault(require("./location"));
const enemy_1 = __importDefault(require("./enemy"));
const adventure_1 = __importDefault(require("./adventure"));
const endpoint = 'index';
const type = 'app';
const router = express.Router();
// Adventure
router.get('/adventure', adventure_1.default);
// Help
router.get('/help', help_1.default);
// Streamer
router.get('/streamer', streamer_1.default);
// Twitch
router.get('/twitch', twitch_1.default);
// Daily
router.get('/daily', daily_1.default);
// Command
router.get('/command', command_1.default);
// Hero
router.get('/hero', hero_1.default);
// Heroes
router.get('/heroes', heroes_1.default);
// Item
router.get('/item', item_1.default);
// Item Category
router.get('/itemCategory', itemCategory_1.default);
// Location
router.get('/location', location_1.default);
// Enemy
router.get('/enemy', enemy_1.default);
// Say
router.get('/say', say_1.default);
// Statistic
router.get('/statistic', statistic_1.default);
// Taverne
router.get('/taverne', taverne_1.default);
// Level
router.get('/level', level_1.default);
// index
router.get('/', (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    if (request.query.node) {
        const channel = global.worker.channels.find(x => x.node.name === request.query.node);
        if (channel) {
            request.session.node = channel.node;
        }
    }
    response.render(endpoint, {
        title: 'Social Adventure'
    });
}));
exports.default = router;
//# sourceMappingURL=index.js.map