var express = require('express'),
    config = require('./config'),
    http = require('http'),
    app = exports.app =  express();

// environment setup
app.set('port', config.application.port || 3000);
app.set('name', config.application.name || "APP");
app.use(express.favicon());
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);

// start server
http.createServer(app).listen(app.get('port'), function () {
  console.log(app.get('name') + ' server: started [port: ' + app.get('port') + ']');
});