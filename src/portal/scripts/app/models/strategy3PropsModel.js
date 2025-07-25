/**
 * Created by szhitenev on 03.04.2017.
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
                "value_type": 10
            },
            {
                "key": "short_name",
                "name": "Short name",
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
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            },
            {
                "key": "subgroup",
                "name": "Group",
                "value_type": "field",
                "value_entity": "strategy-3-subgroup",
                "value_content_type": "strategies.strategy3subgroup",
                "code": "user_code"
            },
            {
                "key": "object_permissions",
                "name": "Object permissions",
                "value_type": "mc_field"
            },
            {
                "key": "created_at",
                "name": "Created At",
                "value_type": 80,
                "readonly": true
            },
            {
                "key": "modified_at",
                "name": "Modified At",
                "value_type": 80,
                "readonly": true
            },
            {
                "key": "deleted_at",
                "name": "Delete At",
                "value_type": 40,
                "readonly": true
            },
            {
                "key": "resource_groups",
                "name": "Resource Groups",
                "value_type": "mc_field",
                "value_content_type": "iam.resourcegroup",
                "value_entity": "resource-group",
                "code": "user_code"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())