var express = require('express'),
    config = require('./config'),
    http = require('http'),
    Oriento =  require('oriento'); // database driver
var app = exports.app =  express();

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

// routes
require('./routes/dss')(app, db);
require('./routes/wsdl')(app, db);
//require('./routes/json')(app, db);

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});