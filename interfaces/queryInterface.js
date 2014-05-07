var _ = require('underscore');

function checkAndFormatCondition (string) {
    return (typeof string == "number" || // value is a number
        string.slice(0,1) == "(" && string.slice(-1) == ")" || // string wrapped in (...)
        string.substring(string.indexOf(")")-1, string.indexOf(")")) == "(") ? // string contains ()
         string : "\"" + string + "\"";
}

exports.compileConditions = function (json) {
    var conditions = "",
        i = 0;
    json = (typeof json == "string") ? JSON.parse(json) : json;
    _.each(json, function (value, key) {
        switch (key) {
            case 'WHERE':
                _.each(value, function (value, key) {
                    if (i == 0) {
                        conditions = " WHERE "
                            + key
                            + " "
                            + value.operator
                            + " "
                            + checkAndFormatCondition(value.value);
                        i++;
                    } else {
                        conditions = conditions
                            + " AND "
                            + key
                            + " "
                            + value.operator
                            + " "
                            + checkAndFormatCondition(value.value);
                    }
                });
                break;
            case 'SKIP':
            case 'LIMIT':
                if (typeof value != "number") value = Number(value);
                if (value != "NaN") {
                    conditions = conditions
                        + (key == 'SKIP') ? "SKIP " : "LIMIT "
                        + value;
                }
                break;
            case 'GROUPBY':
                conditions = conditions
                    + "GROUP BY "
                    + value;
                break;
            case 'ORDERBY':
                var projections = "";
                _.each(value, function (valueProjection) {
                    projections = projections
                        + " "
                        + valueProjection
                        + (_.last(value) != valueProjection) ? ", " : "";
                });
                conditions = conditions
                    + "GROUP BY "
                    + projections;
                break;
        }
    });
    return conditions;
};
