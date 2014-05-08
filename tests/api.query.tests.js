var request = require('supertest'),
    assert = require('chai').assert,
    app = require('../server').app,
    conditions;

describe('API tests', function () {
   describe('data queries', function () {
       it('should run basic query', function (done) {
           request(app)
               .get('/query/cloudservice')
               .expect(200)
               .end(function (err, res) {
                   if (err) throw err;
                   assert.isNotNull(res.body);
                   done();
               });
       });

       it('should be able to run the query with "where"', function (done) {
           conditions = {
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
                  assert.isNotNull(res.body);
                  assert.deepProperty(res.body[0], 'category');
                  assert.deepEqual(res.body[0].category, 'Location');
                  done();
               });
       });

       it('should limit the result to 1', function (done) {
          conditions = {
            conditions: {
                "LIMIT": 1
            }
          };

          request(app)
              .get('/query/cloudservice')
              .query(conditions)
              .end(function (err, res) {
                 if (err) throw err;
                 assert.lengthOf(res.body, 1);
                 done();
              });
       });

       it('should be able to run "group by"', function (done) {
          conditions = {
              conditions: {
                  "GROUPBY": "hasDatabase"
              }
          };

          var allResults;
          request(app)
              .get('/query/cloudservice')
              .end(function (err, res) {
                 if (err) throw err;
                 allResults = res.body.length;
              });

          request(app)
              .get('/query/cloudservice')
              .query(conditions)
              .end(function (err, res) {
                 if (err) throw err;
                 assert.deepProperty(res.body[0], "website");
                 assert.notEqual(res.body.length, allResults);
                 done();
              });
       });

       it('should select only relevant columns', function (done) {
          conditions = {
              conditions: {
                  "LIMIT": 1
              },
              columns: "name, hasDatabase"
          };

           request(app)
               .get('/query/cloudservice')
               .query(conditions)
               .end(function (err, res) {
                   if (err) throw err;
                   assert.lengthOf(Object.keys(res.body[0]), 4);
                   assert.notDeepProperty(res.body[0], "website");
                   done();
               });
       });
   });
});
