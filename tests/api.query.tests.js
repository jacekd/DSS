var request = require('supertest'),
    should = require('chai').should(),
    app = require('../server').app;

describe('API tests', function () {
   describe('data queries', function () {
       it('should run basic query', function (done) {
           request(app)
               .get('/query/cloudservice')
               .expect(200)
               .end(function (err, res) {
                   if (err) throw err;
                   res.body.should.not.be.empty;
                   done();
               });
       });

       it('should be able to run the query with "with"', function (done) {
           request(app)
               .get('/query/assets')
               .expect(200)
               .end(function (err, res) {
                  if (err) throw err;
                  res.body.should.not.be.empty;
                  done();
               });
       });
   });
});
