(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "mismatch",
                "name": "Mismatch",
                "value_type": 20
            },
            {
                "key": "mismatch_portfolio",
                "name": "Mismatch Portfolio",
                "value_content_type": "portfolios.portfolio",
                "value_entity": "portfolio",
                "value_type": "field"
            },
            {
                "key": "mismatch_account",
                "name": "Mismatch Account",
                "value_content_type": "accounts.account",
                "value_entity": "account",
                "value_type": "field"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());