(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "mismatch",
                "name": "Mismatch",
                "value_type": "float"
            },
            {
                "key": "mismatch_portfolio",
                "name": "Mismatch Portfolio",
                "value_type": "field"
            },
            {
                "key": "mismatch_account",
                "name": "Mismatch Account",
                "value_type": "field"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());