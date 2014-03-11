var _ = require('underscore');

exports.compileConditions = function (json) {
    var conditions = "",
        i = 0;
    _.each(JSON.parse(json), function (value, key) {
        if (i === 0) {
            conditions = " WHERE " + key + value.operator + "\"" + value.value + "\"";
            i++;
        } else {
            conditions = " AND " + key + value.operator + "\"" + value.value + "\"";
        }
    });
    return conditions;
};
