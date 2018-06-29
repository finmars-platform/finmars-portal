/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var toQueryParamsString = function (params) {

        var resultArr = [];

        var keys = Object.keys(params);

        var i, x;
        var keysLen = keys.length;
        var values;
        var valuesLen;

        for (i = 0; i < keysLen; i = i + 1) {

            values = params[keys[i]];

            if (typeof values === 'string' || typeof values === 'number') {

                resultArr.push(keys[i] + '=' + values)

            } else {

                if (values) {

                    valuesLen = values.length;

                    for (x = 0; x < valuesLen; x = x + 1) {

                        resultArr.push(keys[i] + '=' + values[x])

                    }

                }
            }

        }

        return resultArr.join('&')

    };

    module.exports = {
        toQueryParamsString: toQueryParamsString
    }

}());