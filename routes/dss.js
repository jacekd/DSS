// DSS tool routes
var _ = require('underscore');

var DSSRoute = function (app, db) {
  app.get('/resources', function (req, res) {

    db.query('SELECT FROM Resources')
        .then(function (results) {
          return res.json(200, results);
        })
        .error(function (error) {
          return res.json(500, error);
        });
  });

  app.get('/query', function (req, res) {

    db.query(req.query.query.toString())
        .then(function (results) {
          if (_.isEmpty(results)) return res.json(404, '');
          return res.json(200, results);
        })
        .error(function (error) {
          return res.json(404, error);
        });
  });
};

module.exports = DSSRoute;
