import "reflect-metadata";

import express = require('express');
import session = require('express-session');
import cookieParser = require('cookie-parser');
import bodyParser = require('body-parser');
import favicon = require('serve-favicon');
import https = require('https');
import http = require('http');
import path = require('path');
import logFile = require('rotating-file-stream')
import morgan = require('morgan');
import * as fs from 'fs';
import log4js = require('log4js');
import settings from './settings.json';
import routes from './routes/index';
import api from './routes/api';

import { Worker } from './controller/worker';
import { NodeItem } from "./model/nodeItem";

const app = express();

// Global Database
declare global {
    var worker: Worker;

    type credentialItem = {
        access_token: string;
        expires_in: number;
        refresh_token: string;
        scope: string[];
        token_type: string;
      };

      type credentialUserItem = {
        id: string;
        login: string;
        display_name: string;
        type: string;
        broadcaster_type: string;
        description: string;
        profile_image_url: string;
        offline_image_url: string;
        view_count: number;
        email: string;
        created_at: string;
      };

      type twitchStreamItem = {
        id: string;
        user_id: string;
        user_login: string;
        user_name: string;
        game_id: string;
        game_name: string;
        type: string;
        title: string;
        viewer_count: string;
        started_at: string;
        language: string;
        thumbnail_url: string;
      };

      type twitchChannelItem = {
        broadcaster_id: string;
        broadcaster_login: string;
        broadcaster_name: string;
        broadcaster_language: string;
        game_id: string;
        game_name: string;
        title: string;
        delay: string;
      };
}

global.defaultNode = async function defaultNode(request: express.Request, response: express.Response) : Promise<NodeItem> {
    if(!request.session.node){
        request.session.node = await global.worker.globalDatabase.sequelize.models.node.findOne() as NodeItem;
    }
    return request.session.node;
}

global.isMaster = function isMaster(request: express.Request, response: express.Response, node: NodeItem) : boolean{
    if(request.session != null && request.session.userData != null && request.session.userData.login != null){
        if(request.session.userData.login === node.name){
            return true;
        }
    }
    return false;
}
global.isChannel = function isChannel(request: express.Request, response: express.Response, channelName: string) : boolean{
    if(request.session != null && request.session.userData != null && request.session.userData.login != null){
        if(request.session.userData.login === channelName){
            return true;
        }
    }
    return false;
}

global.isRegistered = function isRegistered(request: express.Request, response: express.Response) : boolean{
    if(request.session != null && request.session.userData != null && request.session.userData.login != null){
        return true;
    }
    return false;
}
// extend session
declare module 'express-session' {
    interface SessionData {
        state: string,
        twitch: globalThis.credentialItem,
        node: NodeItem,
        userData: credentialUserItem
    }
}

// session handler
app.use(session({
    'secret': settings.secret,
    'resave': false,
    'saveUninitialized': true,
    cookie: { sameSite: 'lax' }
  }))

// security
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(favicon(path.join(__dirname, settings.favicon)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // { limit: '20mb' }
app.use(bodyParser.urlencoded({ extended: false })); // { limit: '20mb', extended: true }
app.use(cookieParser());

// create a rotating write stream
const accessLogStream = logFile.createStream('request.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'));

// setup debug
log4js.configure({
    appenders: { file: { type: "file", filename: settings.logOutputPath }, console: { type: "console" } },
    categories: { default: { appenders: ["file", 'console'], level: settings.logLevel } }
});

// set routes
app.use('/', routes);
app.use('/api', api);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/devExpress', express.static(__dirname + '/node_modules/devextreme/dist'));
app.use('/moment', express.static(__dirname + '/node_modules/moment/src'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, request: express.Request, response: express.Response) => {
        response.status(err.status || 500);
        response.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, request: express.Request, response: express.Response) => {
    response.status(err.status || 500);
    response.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', settings.port);
// app.set('twitch', twitch);

global.worker = new Worker(log4js.getLogger("default"));
global.worker.initialize();

// Logging
global.worker.log.trace('Execution Path: ' + __dirname);

start();

function start(){
    try{
    // start server
    if (fs.existsSync(path.join(__dirname, settings.key)) && fs.existsSync(path.join(__dirname, settings.cert))) {
        https.createServer({
            key: fs.readFileSync(path.join(__dirname, settings.key)),
            cert: fs.readFileSync(path.join(__dirname, settings.cert))
        }, app)
            .listen(app.get('port'), () => {
                global.worker.log.info('HTTPS Server listening on port ' + app.get('port'));
                })
    } else {
        http.createServer(app)
            .listen(app.get('port'), () => {
                    global.worker.log.info('HTTP Server listening on port ' + app.get('port'));
                })
    }
    } catch(ex){
        global.worker.log.info('Error start server! Restart...');
        setTimeout(start, 1000);
        start();
    }

}
