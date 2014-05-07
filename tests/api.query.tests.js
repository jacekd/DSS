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
           var conditions = {
               conditions: {
                   "WHERE": {
                       "category": {
                           "operator": "=",
                           "value": "Location"
                       }
                   }
               }
           };

           request(app)
               .get('/query/assets')
               .query(conditions)
               .expect(200)
               .end(function (err, res) {
                  if (err) throw err;
                  res.body.should.not.be.empty;
                  res.body[0].should.have.property('category');
                  res.body[0].category.should.equal('Location');
                  done();
               });
       });

       it('should limit the result to 1', function (done) {
          var conditions = {
            conditions: {
                "LIMIT": 1
            }
          };

          request(app)
              .get('/query/cloudservice')
              .query(conditions)
              .end(function (err, res) {
                 if (err) throw err;
                 res.body.should.have.length(1);
                  done();
              });
       });
   });
});
