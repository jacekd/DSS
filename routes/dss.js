// DSS tool routes
var DSSRoute = function (app, db) {
  app.get('/resources', function (req, res) {

//    db.query('SELECT FROM OUser', function (results) {
//          return res.json(200, results);
//        })
//        .error(function (error) {
//          return res.json(500, error);
//        });
//  });

    db.open()
        .then(function(results) {
          //Details
          console.log("Database '" + db.databaseName + "' has " + db.clusters.length + " clusters");

          //SQL Statement
          var sql  = 'SELECT FROM OUser';
          var opts = {};

          //Queries
          db.query(sql, opts)
              .then(function(results) {
                return res.json(200, results);
              })
              .error(function(error) {
                console.log(error);
              });
        });
  });
};

module.exports = DSSRoute;
