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

db.open(function (err) {
  if (err) throw err;
})
    .then(function(results) {
      //Details
      console.log("Database '" + db.databaseName + "' has " + db.clusters.length + " clusters");

      //SQL Statement
      var sql  = 'SELECT FROM OUser';
      var opts = {};

      //Queries
      db.query(sql, opts)
          .then(function(results) {
            console.log(results);
          })
          .error(function(error) {
            console.log(error);
          });
    })
    .error(function(error) {
      console.log(error);
    });

// start server
http.createServer(app).listen(app.get('port'), function () {
  console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});