/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "date_formatted",
                "name": "Date",
                "value_type": 10
            },
            {
                "key": "username",
                "name": "Member",
                "value_type": 10
            },
            {
                "key": "field_name",
                "name": "Field",
                "value_type": 10
            },
            {
                "key": "old_value",
                "name": "Old value",
                "value_type": 10
            },
            {
                "key": "value",
                "name": "New value",
                "value_type": 10
            },
            {
                "key": "message",
                "name": "Message",
                "value_type": 10
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())