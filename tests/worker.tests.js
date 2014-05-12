var worker = require('../worker'),
    assert = require('chai').assert,
    DataParser = new worker.DataParser('testing'),
    data, url, file;

describe('Worker tests', function () {
   it('should be able to read list of files', function (done) {
       data = worker.readDataFeeds('./dataFeeds');
       assert.isNotNull(data);
       assert.isArray(data);
       assert.match(data[0], /\.json$/);
       file = data[0];
       done();
   });

   it('should be able to read config file', function (done) {
      data = DataParser.readConfig(file);
      assert.isNotNull(data);
      assert.isObject(data);
      done();
   });

    it('should be able to prepare the url correctly', function (done) {
        var isUrl = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
            url = DataParser.prepareUrl(data);
        assert.isNotNull(url);
        assert.isString(url);
        assert.isTrue(isUrl.test(url));
        done();
    });

   it('should be able to fetch some kind of data', function (done) {
      DataParser.fetchData(url, function (body) {
          assert.isDefined(body);
          assert.isNotNull(body);
          assert.isObject(body);
          done();
      });
   });
});