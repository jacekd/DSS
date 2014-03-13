var _ = require('underscore'),
    xmlInterface = require('./../interfaces/xmlInterface');

var WSDLroute = function (app, db) {

    app.post('/wsdl', function (req, res) {

        var XMLObject = xmlInterface.parseXML(req.body.xml);

        _.each(XMLObject, function (value, key) {

        });
    });
};

module.exports = WSDLroute;
