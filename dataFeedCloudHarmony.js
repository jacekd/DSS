"use strict";

var Oriento =  require('oriento');
var config = require('./config');
var request = require('request');

var server = Oriento({
    host: config.database.host,
    port: config.database.port,
    username: config.database.databaseUser,
    password: config.database.databasePassword
});

var db = server.use(config.database.databaseName);

var pool = 12;
var offset = 0;

for (var i = 0; i < pool; i++) {
    var url = 'http://cloudharmony.com/ws/getClouds&ws-offset=' + offset;
    request(url, function (error, res, body) {
        if (!error && res.statusCode == 200) {

            var data = JSON.parse(body);
            var services = data.response;
            services.forEach(function (cloudService) {
                db.insert().into('CloudService').set({
                    serviceId: cloudService.id,
                    name: cloudService.name,
                    description: cloudService.description,
                    hasContentDelivery: cloudService.hasContentDelivery,
                    hasDatabase: cloudService.hasDatabase,
                    hasDns: cloudService.hasDns,
                    hasMessaging: cloudService.hasMessaging,
                    hasPlatform: cloudService.hasPlatform,
                    hasServers: cloudService.hasServers,
                    hasStorage: cloudService.hasStorage,
                    hasWindows: cloudService.hasWindows,
                    website: cloudService.website
                }).one()
                    .then(function (service) {
                        console.log('created: ', service);
                    });
            });
        }
    });
    offset += 10;
}



