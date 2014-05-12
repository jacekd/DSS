/**
 Main config file for the backend
**/
"use strict";

var config = {
  application: {
    name: 'DSS',
    host: 'localhost',
    port: 3003
  },
  database: {
    host: 'localhost',
    port: 2424,
    serverUsername: 'root',
    serverPassword: '29246DDD3693A2CCA444B3BACC05F04301C8DCE9237F7C892B927B478BD76F12',
    databaseName: 'dss',
    databaseUser: 'root',
    databasePassword: '29246DDD3693A2CCA444B3BACC05F04301C8DCE9237F7C892B927B478BD76F12'
  },
  worker: {
      run: {
          days: [1,12,4],
          hour: [11],
          minutes: [19,20,21]
      },
      interval: 60 * 1000 // every 1 minute
  }
};

module.exports = config;