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

import settings from './settings.json';
import routes from './routes/index';
import api from './routes/api';

const app = express();

// session handler
app.use(session({
    'secret': settings.secret,
    'resave': true,
    'saveUninitialized': true
  }))

// security
app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('trust proxy', 1);

app.use(favicon(path.join(__dirname, settings.favicon)));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
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
import log4js = require('log4js');

log4js.configure({
    appenders: { file: { type: "file", filename: settings.logOutputPath }, console: { type: "console" } },
    categories: { default: { appenders: ["file", 'console'], level: settings.logLevel } }
});

app.set('log', log4js.getLogger("default"));
app.get('log').trace('Execution Path: ' + __dirname);

// set routes
app.use('/', routes);
app.use('/api', api);
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/popper', express.static(__dirname + '/node_modules/popper.js/dist'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err: any, req, res, next) => {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.set('port', settings.port);

// start server
if (fs.existsSync(path.join(__dirname, settings.key)) && fs.existsSync(path.join(__dirname, settings.cert))) {
    https.createServer({
        key: fs.readFileSync(path.join(__dirname, settings.key)),
        cert: fs.readFileSync(path.join(__dirname, settings.cert))
    }, app)
        .listen(app.get('port'), () => {
                app.get('log').info('HTTPS Server listening on port ' + app.get('port'));
            })
} else {
    http.createServer(app)
        .listen(app.get('port'), () => {
                app.get('log').info('HTTP Server listening on port ' + app.get('port'));
            })
}