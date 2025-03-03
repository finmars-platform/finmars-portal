/**
 * Created by szhitenev on 02.02.2024.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "id",
                "name": "ID",
                "value_type": 20
            },
            {
                "key": "name",
                "name": "Name",
                "value_type": 10,
                "allow_null": false
            },
            {
                "key": "short_name",
                "name": "Short name",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "user_code",
                "name": "User code",
                "value_type": 10
            },
            {
                "key": "public_name",
                "name": "Public name",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "is_active",
                "name": "Is active",
                "value_type": 50,
                "allow_null": true
            },
            {
                "key": "portfolios",
                "name": "Portfolios",
                "value_type": "mc_field",
                "value_content_type": "portfolios.portfolio",
                "value_entity": "portfolio",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "precision",
                "name": "Precision",
                "value_type": 20,
                "allow_null": true
            },
            {
                "key": "report_ttl",
                "name": "Time To Live (Days max count: 90)",
                "value_type": 20,
                "allow_null": true,
            },
            {
                "key": "only_errors",
                "name": "Show Only Errors",
                "value_type": 50,
                "allow_null": true
            },
            {
                "key": "round_digits",
                "name": "Round Digits (digits after decimal point)",
                "value_type": 20,
                "allow_null": true
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());