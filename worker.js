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
var methods = {};
// Read files in the directory
methods.readDataFeeds = function (directory) {
    var list = fs.readdirSync(directory),
        listFiltered = [];
    for (var i in list) {
        var filePath = directory + "/" + list[i];
        if (!list.hasOwnProperty(i)) continue;
        if (!fs.statSync(filePath).isDirectory() && path.extname(filePath) == ".json")  {
            listFiltered.push(path.join(__dirname, filePath));
        }
    }
    return listFiltered;
};

// Read JSON file content
methods.readFileJSON = function (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

// Get data from the url
methods.getData = function (url, urlParams, pool, offset, callback) {
    pool = pool || 1;
    offset = offset || 0;
    var urlParsed;

    // construct url
    if (!_.isEmpty(urlParams.other)) {
        url = url + "&" + urlParams.other;
    }

    for (var i = 0; i < pool; i++) {
        if (!_.isEmpty(urlParams.offset)) {
            urlParsed = url + "&" + urlParams.offset + "=" + offset;
        }
        request(url, function (error, res, body) {
           if (!error && res.statusCode == 200)  {
               if (!_.isUndefined(callback)) {
                   callback(body);
               }
           }
        });
        offset += 10;
    }
    return false;
};

methods.insertCloudService = function (data, schema) {

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
};

methods.runServicesUpdate = function () {
    var serviceFeeds = methods.readDataFeeds('./dataFeeds');
    serviceFeeds.forEach(function (serviceFeed) {
        var fileData = methods.readFileJSON(serviceFeed);
        var serviceData = false;
        if (fileData) serviceData = methods.getData(fileData.url, fileData.urlParams, fileData.pool, fileData.offset);
        if (serviceData) methods.insertCloudService(serviceData, fileData.schema);
    });
};

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
        async.parallel(methods.runServicesUpdate(), function () {
            isNotRunning = true;
        });
    }
}, config.worker.interval);

// export methods
module.exports = methods;