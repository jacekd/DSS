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
var db = exports.db = new Db({
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

db.open(function (error, results) {
  if (error) {
    db.close();
    console.log(error);
    return;
  }
  console.log(app.get('name') + ' database: connected OK with sessionId: ' + results.sessionId);
});


// routes
require('./routes/dss')(app, db);

// start server
http.createServer(app).listen(app.get('port'), function () {
  console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});