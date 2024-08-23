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
                "key": "configuration_code",
                "name": "Configuration code",
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
                "key": "portfolio_class",
                "name": "Portfolio class",
                "value_type": "field",
                "value_content_type": "portfolios.portfolioclass",
                "value_entity": "portfolio-class",
                "code": "user_code",
                "allow_null": false
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());