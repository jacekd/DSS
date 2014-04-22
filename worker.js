/*
Worker is designed to gather the data as well as optimize it and create needed edges for data querying
Should run periodically
 */

"use strict";

// base
var Oriento = require('oriento'),
    config = require('./config'),
    fs = require('fs'),
    path = require('path'),
    request = require('request');

// Connect to DB
var server = Oriento({
    host: config.database.host,
    port: config.database.port,
    username: config.database.databaseUser,
    password: config.database.databasePassword
});

var db = server.use(config.database.databaseName);

// Read files in the directory
function readDataFeeds (directory) {
    var list = fs.readdirSync(directory),
        listFiltered = [];

    for (var i in list) {
        var filePath = dir + "/" + list[i];
        if (!list.hasOwnProperty(i)) continue;
        if (!fs.statSync(filePath).isDirectory() && path.extname(filePath) == ".json")  {
            listFiltered.push(list[i]);
        }
    }

    return listFiltered;
}
