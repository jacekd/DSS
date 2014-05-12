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
          hour: [11,12,13,14,15,16,17],
          minutes: [10,11,12,13,14,15,16,17,18,19,20,22,23,24,25,26,27,28,29,30,32,33,34,35,36,37,38,39,40,44,45,46,47,50,52,53,54,55,56,57,58,59,1,2,3,4,5,6,7,8]
      },
      interval: 10 * 1000 // every 1 minute
  }
};

module.exports = config;