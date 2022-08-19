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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const https = require("https");
const http = require("http");
const path = require("path");
const logFile = require("rotating-file-stream");
const morgan = require("morgan");
const fs = __importStar(require("fs"));
const log4js = require("log4js");
const settings_json_1 = __importDefault(require("./settings.json"));
const twitch_json_1 = __importDefault(require("./twitch.json"));
const index_1 = __importDefault(require("./routes/index"));
const api_1 = __importDefault(require("./routes/api"));
const worker_1 = require("./controller/worker");
const app = express();
global.defaultNode = function getDefaultNode(request, response) {
    if (!request.session.node) {
        request.session.node = "craffelmat";
    }
    return request.session.node;
};
global.isMaster = function isMaster(request, response, node) {
    if (request.session != null && request.session.userData != null && request.session.userData.login != null) {
        if (request.session.userData.login === node) {
            return true;
        }
    }
    return false;
};
// session handler
app.use(session({
    'secret': settings_json_1.default.secret,
    'resave': true,
    'saveUninitialized': true
}));
// security
app.disable('x-powered-by');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);
app.use(favicon(path.join(__dirname, settings_json_1.default.favicon)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // { limit: '20mb' }
app.use(bodyParser.urlencoded({ extended: false })); // { limit: '20mb', extended: true }
app.use(cookieParser());
// create a rotating write stream
const accessLogStream = logFile.createStream('request.log', {
    interval: '1d',
    path: path.join(__dirname, 'log')
});
// setup the logger
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));
// setup debug
log4js.configure({
    appenders: { file: { type: "file", filename: settings_json_1.default.logOutputPath }, console: { type: "console" } },
    categories: { default: { appenders: ["file", 'console'], level: settings_json_1.default.logLevel } }
});
// set routes
app.use('/', index_1.default);
app.use('/api', api_1.default);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/devExpress', express.static(__dirname + '/node_modules/devextreme/dist'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/src'));
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, request, response) => {
        response.status(err.status || 500);
        response.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, request, response) => {
    response.status(err.status || 500);
    response.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', settings_json_1.default.port);
app.set('twitch', twitch_json_1.default);
global.worker = new worker_1.Worker(log4js.getLogger("default"));
global.worker.initialize();
// Logging
global.worker.log.trace('Execution Path: ' + __dirname);
start();
function start() {
    try {
        // start server
        if (fs.existsSync(path.join(__dirname, settings_json_1.default.key)) && fs.existsSync(path.join(__dirname, settings_json_1.default.cert))) {
            https.createServer({
                key: fs.readFileSync(path.join(__dirname, settings_json_1.default.key)),
                cert: fs.readFileSync(path.join(__dirname, settings_json_1.default.cert))
            }, app)
                .listen(app.get('port'), () => {
                global.worker.log.info('HTTPS Server listening on port ' + app.get('port'));
            });
        }
        else {
            http.createServer(app)
                .listen(app.get('port'), () => {
                global.worker.log.info('HTTP Server listening on port ' + app.get('port'));
            });
        }
    }
    catch (ex) {
        global.worker.log.info('Error start server! Restart...');
        setTimeout(start, 1000);
        start();
    }
}
//# sourceMappingURL=bot.js.map