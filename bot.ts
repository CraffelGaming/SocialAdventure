import express from 'express';
import session from 'express-session';
import path from 'path';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import favicon from 'serve-favicon';
import https from 'https';
import http from 'http';
import logFile from 'rotating-file-stream';
import * as fs from 'fs';
import log4js from 'log4js';
import morgan from 'morgan';
import routes from './routes/index.js';
import api from './routes/api.js';
import { Worker } from './controller/worker.js';
import { NodeItem } from "./model/nodeItem.js";
import { fileURLToPath } from 'url';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const settings = JSON.parse(fs.readFileSync(path.join(dirname, 'settings.json')).toString());
const app = express();

// Global
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

      type twitchModeratorItem = {
        user_id: string;
        user_login: string;
        user_name: string;
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

global.isModerator = function isRegistered(request: express.Request, response: express.Response, moderators: twitchModeratorItem[]) : boolean{
    if(moderators?.length > 0 && request.session != null && request.session.userData != null && request.session.userData.login != null){
        if(moderators.some(x => x.user_login.toLocaleLowerCase() === request.session.userData.login.toLocaleLowerCase())){
            return true;
        }
    }
    return false;
}

// extend session
declare module 'express-session' {
    interface SessionData {
        state: string,
        twitch: globalThis.credentialItem,
        node: NodeItem,
        userData: credentialUserItem,
        redirect: string
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
app.set('views', path.join(dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(favicon(path.join(dirname, settings.favicon)));
app.use(express.static(path.join(dirname, 'public')));
app.use(bodyParser.json()); // { limit: '20mb' }
app.use(bodyParser.urlencoded({ extended: false })); // { limit: '20mb', extended: true }
app.use(cookieParser());

// create a rotating write stream
const accessLogStream = logFile.createStream('request.log', {
    interval: '1d', // rotate daily
    path: path.join(dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))
app.use(morgan('dev'));

// setup debug
log4js.configure({
    appenders: { file: { type: "dateFile", filename: path.join(dirname, settings.logOutputPath), compress: true }, console: { type: "console" } },
    categories: { default: { appenders: ["file", 'console'], level: settings.logLevel } }
});

log4js.getLogger("default").trace('Logger initialized.');

// set routes
app.use('/', routes);
app.use('/api', api);
app.use('/jquery', express.static(path.join(dirname, '/node_modules/jquery/dist/')));
app.use('/devExpress', express.static(path.join(dirname, '/node_modules/devextreme/dist')));
app.use('/moment', express.static(path.join(dirname, '/node_modules/moment/src')));

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
await global.worker.initialize();

// Logging
global.worker.log.trace('Execution Path: ' + dirname);

start();

function start(){
    try{
        // start server
        if (fs.existsSync(path.join(dirname, settings.key)) && fs.existsSync(path.join(dirname, settings.cert))) {
            https.createServer({
                key: fs.readFileSync(path.join(dirname, settings.key)),
                cert: fs.readFileSync(path.join(dirname, settings.cert))
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
        global.worker.log.error('Error start server! Restart...');
        global.worker.log.error(ex);
        setTimeout(start, 5000);
        start();
    }
}
