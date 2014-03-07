// DSS tool routes
var DSSRoute = function (app, db) {
  app.get('/resources', function (req, res) {

    db.query('SELECT FROM OUser')
        .then(function (results) {
          return res.json(200, results);
        })
        .error(function (error) {
          return res.json(500, error);
        });
  });
};

module.exports = DSSRoute;
