/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "name",
                "name": "Name",
                "value_type": 10
            },
            {
                "key": "short_name",
                "name": "Short name",
                "value_type": 10
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
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
                "key": "group",
                "name": "Group",
                "value_type": "field",
                "value_entity": "counterparty-group",
                "value_content_type": "counterparties.counterpartygroup",
                "code": "user_code"
            },
            {
                "key": "portfolios",
                "name": "Portfolios",
                "value_type": "mc_field"
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())