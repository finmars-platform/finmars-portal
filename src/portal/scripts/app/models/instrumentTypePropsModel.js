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
                "value_type": 10
            },
            {
                "key": "is_active",
                "name": "Is active",
                "value_type": "boolean"
            },
            {
                "key": "instrument_class",
                "name": "Instrument class",
                "value_type": "field"
            },
            {
                "key": "one_off_event",
                "name": "One off event",
                "value_type": "field"
            },
            {
                "key": "regular_event",
                "name": "Regular event",
                "value_type": "field"
            },
            {
                "key": "factor_same",
                "name": "Factor same",
                "value_type": "field"
            },
            {
                "key": "factor_up",
                "name": "Factor up",
                "value_type": "field"
            },
            {
                "key": "factor_down",
                "name": "Factor down",
                "value_type": "field"
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field"
            },
            {
                "key": "object_permissions_user",
                "name": "Users permissions",
                "value_type": "mc_field"
            },
            {
                "key": "object_permissions_group",
                "name": "Groups permissions",
                "value_type": "mc_field"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())