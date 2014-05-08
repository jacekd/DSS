var worker = require('../worker'),
    assert = require('chai').assert,
    data,
    file;

describe('Worker tests', function () {
   it('should be able to read list of files', function (done) {
       data = worker.readDataFeeds('./dataFeeds');
       assert.isNotNull(data);
       assert.isArray(data);
       assert.match(data[0], /\.json$/);
       file = data[0];
       done();
   });

   it('should be able to read discovered file', function (done) {
       data = worker.readFileJSON(file);
       assert.isNotNull(data);
       assert.isObject(data);
       done();
   });

   it('should get some kind of data from the source', function (done) {
      var fetchData = worker.getData(data.url, data.urlParams, data.pool, data.offset);
      assert.isNotNull(fetchData);
      assert.isObject(fetchData);
      done();
   });
});