var express = require('express'),
    config = require('./config'),
    http = require('http'),
    Orientdb = require('node-orientdb');
Db = Orientdb.GraphDb;
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
var db = new Db({
    //Server
    server_host: config.database.host,
    server_port: config.database.port,
    server_username: config.database.serverUsername,
    server_password: config.database.serverPassword,

    //Database
    database_name: config.database.databaseName,
    database_username: config.database.databaseUser,
    database_password: config.database.databasePassword
});

exports.db = db.open()
    .then(function () {
        console.log(app.get('name') + ' database: connected OK');
    })
    .error(function (error) {
        db.close();
        console.log(error);
    });


// routes
require('./routes/dss')(app, db);
require('./routes/wsdl')(app, db);

// start server
http.createServer(app).listen(app.get('port'), function () {
    console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});