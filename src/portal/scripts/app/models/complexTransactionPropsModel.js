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
                "value_type": "float"
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
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())