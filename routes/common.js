var _ = require('underscore');

function checkAndFormatCondition (string) {
    return (typeof string == "number" ||
        string.slice(0,1) == "(" && string.slice(-1) == ")" ||
        string.substring(string.indexOf(")")-1, string.indexOf(")")) == "(") ?
         string : "\"" + string + "\"";
}

exports.compileConditions = function (json) {
    var conditions = "",
        i = 0;
    _.each(JSON.parse(json), function (value, key) {
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
        }
    });
    return conditions;
};
