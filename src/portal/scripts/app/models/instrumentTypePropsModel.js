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
                "key": "notes",
                "name": "Notes",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "user_code",
                "name": "User code",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "public_name",
                "name": "Public name",
                "value_type": 10,
                "allow_null": true
            },
            {
                "key": "is_active",
                "name": "Is active",
                "value_type": "boolean",
                "allow_null": true
            },
            {
                "key": "instrument_class",
                "name": "Instrument class",
                "value_type": "field",
                "entity": "instrument-class",
                "code": "system_code",
                "allow_null": false
            },
            {
                "key": "one_off_event",
                "name": "One off event",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "regular_event",
                "name": "Regular event",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "factor_same",
                "name": "Factor same",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "factor_up",
                "name": "Factor up",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "factor_down",
                "name": "Factor down",
                "value_type": "field",
                "entity": "transaction-type",
                "code": "user_code",
                "allow_null": false
            },
            {
                "key": "tags",
                "name": "Tags",
                "value_type": "mc_field",
                "entity": "tag",
                "code": "user_code",
                "allow_null": true
            }
            // {
            //     "key": "object_permissions_user",
            //     "name": "Users permissions",
            //     "value_type": "mc_field",
            //     "allow_null": true
            // },
            // {
            //     "key": "object_permissions_group",
            //     "name": "Groups permissions",
            //     "value_type": "mc_field",
            //     "allow_null": true
            // }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());