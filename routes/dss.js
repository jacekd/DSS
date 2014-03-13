// DSS tool routes
var _ = require('underscore'),
    queryInterface = require('./../interfaces/queryInterface');

var DSSRoute = function (app, db) {

    app.get('/query/:collection', function (req, res) {
        var columns = req.query.columns || "";
        var conditions = req.query.conditions || "";
        var collection = req.params.collection;
        var query = "SELECT " + columns + " FROM " + collection;

        if (!_.isEmpty(conditions)) query = query + queryInterface.compileConditions(conditions);

        if (!_.isEmpty(collection)) {
            db.query(query)
                .then(function (results) {
                    return (_.isEmpty(results)) ? res.json(404, '') : res.json(200, results);
                })
                .error(function (error) {
                   return res.json(404, error);
                });
        }
    });
};

module.exports = DSSRoute;
