// DSS tool routes
var _ = require('underscore');

var DSSRoute = function (app, db) {

    app.get('/query/:collection', function (req, res) {
        var columns = req.query.columns || "";
        var collection = req.params.collection;

        if (!_.isEmpty(collection)) {
            db.query("SELECT " + columns + " FROM " + collection)
                .then(function (results) {
                    return (_.isEmpty(results)) ? res.json(404, '') : res.json(200, results);
                })
                .error(function (error) {
                   return res.json(500, error);
                });
        }
    });
};

module.exports = DSSRoute;
