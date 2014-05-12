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

// Data Parser worker
var DataParser = methods.DataParser = function (name) {
    this.name = name;
};

// Read config file
DataParser.prototype.readConfig = function (file) {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
};

// Prepare URL
DataParser.prototype.prepareUrl = function (parserData, offset) {
    var pool = parserData.pool || 1,
        url = parserData.url;
        offset = offset || parserData.offset || 0;

    if (!_.isEmpty(parserData.urlParams.other)) {
        url = url + "&" + parserData.urlParams.other;
    }

    if (!_.isEmpty(parserData.urlParams.offset)) {
        url = url + "&" + parserData.urlParams.offset + "=" + offset;
    }
    return url;
};

// fetch data
DataParser.prototype.fetchData = function (url, callback) {
    request(url, function (err, res, body) {
        if (callback && typeof callback == "function" && (!err)) {
            callback(JSON.parse(body));
        }
    });
};

DataParser.prototype.insertOrUpdateCloudService = function (data, schema) {

    // initiate empty data object based on the schema
    var schemaFilledWithData = {};

    // Fill schemaFilledWithData
    Object.keys(schema).forEach(function (key, value) {
       schemaFilledWithData.push(key, data[value]);
    });

    // Check if row exists
    var recordExists;
    db.select()
        .from('CloudService')
        .where({ id: schemaFilledWithData.id })
        .one()
        .then(function (record) {
           recordExists = record;
        });
    // insert if it does not exist
    if (_.isEmpty(recordExists)) {
        db.insert()
            .into('CloudService')
            .set(schemaFilledWithData)
            .one()
            .then(function () {
                return true;
            })
            .error(function () {
                return false;
            });
        return false;
    } else {
        // update if exist
        var recordId = schemaFilledWithData.id;
        delete schemaFilledWithData.id;
        db.update('CloudService')
            .set(schemaFilledWithData)
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

// Get data from the url
methods.fetchData = function (dataFeedData, callback) {
    var pool = dataFeedData.pool || 1,
        offset = dataFeedData.offset || 0,
        urlParsed;

    // construct url
    if (!_.isEmpty(dataFeedData.urlParams.other)) {
        urlParsed = dataFeedData.url + "&" + dataFeedData.urlParams.other;
    }

    for (var i = 0; i < pool; i++) {
        if (!_.isEmpty(dataFeedData.urlParams.offset)) {
            urlParsed = url + "&" + dataFeedData.urlParams.offset + "=" + offset;
        }
        request(urlParsed, function (error, res, body) {
           if (!error && res.statusCode == 200)  {
               if (!_.isUndefined(callback)) {
                   callback(body); //TODO: think about it
               }
           }
        });
        offset += 10;
    }
    return false;
};

methods.runServicesUpdate = function () {
    var serviceFeeds = methods.readDataFeeds('./dataFeeds');
    serviceFeeds.forEach(function (serviceFeed) {
        var DataParserInstance = new DataParser('serviceFeed'),
            serviceFileData = DataParser.readConfig(serviceFeed),
            serviceData = false;

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