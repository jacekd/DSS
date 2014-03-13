var parseString = require('xml2js').parseString;

exports.parseXML = function (xmlString) {
    parseString(xmlString, {trim: true}, function (error, result) {
       if (error) return error;
       return result;
    });
};