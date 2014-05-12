var express = require('express'),
    config = require('./config'),
    http = require('http'),
    log4js = require('log4js'),
    Oriento =  require('oriento'), // database driver
    app = exports.app =  express();

// environment setup
app.set('port', config.application.port || 3000);
app.set('name', config.application.name || "APP");
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// Database config
var server = Oriento({
    host: config.database.host,
    port: config.database.port,
    username: config.database.databaseUser,
    password: config.database.databasePassword
});

var db = exports.db = server.use(config.database.databaseName);

// Logger settings
log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/application.log'), 'app');

var appLog = exports.appLog = log4js.getLogger('app');

// routes
require('./routes/dss')(app, db);
require('./routes/wsdl')(app, db);
//require('./routes/json')(app, db);

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});