var express = require('express'),
    config = require('./config'),
    path = require('path'),
    app = exports.app =  express();

// environment setup
app.set('port', config.application.port || 3000);