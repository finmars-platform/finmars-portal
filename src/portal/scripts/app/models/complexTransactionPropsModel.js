/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "code",
                "name": "Code",
                "value_type": 20
            },
            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            },
            {
                "key": "status",
                "name": "Status",
                "value_type": 10 // actually field
            },
            {
                "key": "text",
                "name": "Description",
                "value_type": 10
            },
            {
                "key": "transaction_type",
                "name": "Transaction type",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())