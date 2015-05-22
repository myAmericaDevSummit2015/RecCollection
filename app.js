/*jshint node:true*/

var express = require('express'),
    globals = require('./config/globals'),
    Settings = require('./config/settings'),
    Routes = require('./config/routes');

var app = express();

var initialize = function() {
    var initSettings = function() {
        globals.apply(__dirname);
        Settings.apply(app, express);
    };

    var initRoutes = function() {
        Routes.apply(app);
    };

    initSettings();
    initRoutes();
};

var start = function() {
    var host = (process.env.VCAP_APP_HOST || 'localhost');
    var port = (process.env.VCAP_APP_PORT || 3000);

    var listen = function() {
        app.listen(port, host);
    };

    var log = function() {
        console.log('App started on port ' + port);
    };

    listen();
    log();
};

initialize();
start();
