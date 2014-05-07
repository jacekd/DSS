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
    _ = require('underscore'),
    request = require('request');

// Connect to DB
var server = Oriento({
    host: config.database.host,
    port: config.database.port,
    username: config.database.databaseUser,
    password: config.database.databasePassword
});

var db = server.use(config.database.databaseName);


/*
METHODS
 */
// Read files in the directory
function readDataFeeds (directory) {
    var list = fs.readdirSync(directory),
        listFiltered = [];
    for (var i in list) {
        var filePath = directory + "/" + list[i];
        if (!list.hasOwnProperty(i)) continue;
        if (!fs.statSync(filePath).isDirectory() && path.extname(filePath) == ".json")  {
            listFiltered.push(filePath);
        }
    }
    return listFiltered;
}

// Read JSON file content
function readFileJSON (file) {
    fs.readFile(file, 'utf8', function (error, data) {
        if (error) return false;
        return JSON.parse(data);
    });
}

// Get data from the url
function getData (url, urlParams, pool, offset) {
    pool = pool || 1;
    offset = offset || 0;

    // construct url
    if (!_.isEmpty(urlParams.offset)) {
        url = url + "&" + urlParams.offset + "=" + offset;
    }

    if (!_.isEmpty(urlParams.other)) {
        url = url + "&" + urlParams.other;
    }

    for (var i = 0; i < pool; i++) {
        request(url, function (error, res, body) {
           if (!error && res.statusCode == 200)  {
               return JSON.parse(body);
           }
        });
        offset += 10;
    }
    return false;
}

function insertCloudService (data, schema) {

    // prepare the data
    var dataScheme = {};

    Object.keys(schema).forEach(function (key, value) {
       var dataValue = data[value];
       dataScheme.push(key, dataValue);
    });

    // Insert formatted data
    // TODO: check if entry exists
    var recordcheck;
    db.select()
        .from('CloudService')
        .where({ id: dataScheme.id })
        .one()
        .then(function(record) {
       recordcheck = record;
    });
    if (_.isEmpty(recordcheck)) {
        db.insert()
            .into('CloudService')
            .set(dataScheme)
            .one()
            .then(function () {
                return true;
            })
            .error(function () {
                return false;
            });
        return false;
    } else {
        var recordId = dataScheme.id;
        delete dataScheme.id;
        db.update('CloudService')
            .set(dataScheme)
            .where({ id: recordId })
            .scalar()
            .then(function () {
                return true;
            })
            .error(function () {
               return false;
            });
        return false;
    }
}

function runServicesUpdate () {
    var serviceFeeds = readDataFeeds('dataFeeds');
    serviceFeeds.forEach(function (serviceFeed) {
        var fileData = readFileJSON(serviceFeed);
        var serviceData = false;
        if (fileData) serviceData = getData(fileData.url, fileData.urlParams, fileData.pool, fileData.offset);
        if (serviceData) insertCloudService(serviceData, fileData.schema);
    });
}

/*
WORKER
 */
var isNotRunning = true;
setInterval(function () {
    console.log(config.application.name + ': starting worker');
    var date = new Date();
    if (_.contains(config.worker.run.days, date.getUTCDate())
        && _.contains(config.worker.run.hour, date.getHours())
        && _.contains(config.worker.run.minutes, date.getMinutes())
        && isNotRunning
        ) {
        isNotRunning = false;
        async.parallel(runServicesUpdate(), function () {
            isNotRunning = true;
        });
    }
}, 60 * 1000); // every 1 minute