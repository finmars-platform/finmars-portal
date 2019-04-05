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
                "key": "subgroup",
                "name": "Sub Group",
                "value_type": "field",
                "value_entity": "strategy-3-subgroup",
                "value_content_type": "strategies.strategy3subgroup",
                "code": "user_code"
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