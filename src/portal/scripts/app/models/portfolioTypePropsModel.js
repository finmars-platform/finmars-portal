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
                "key": "source",
                "name": "Source",
                "value_type": "field",
                "value_content_type": "provenance.source",
                "value_entity": "source",
                "code": "user_code"
            },
            {
                "key": "source_version",
                "name": "Source Version",
                "value_type": "field",
                "value_content_type": "provenance.sourceversion",
                "value_entity": "source-version",
                "code": "user_code"
            },
            {
                "key": "provider",
                "name": "Provider",
                "value_type": "field",
                "value_content_type": "provenance.provider",
                "value_entity": "provider",
                "code": "user_code"
            },
            {
                "key": "provider_version",
                "name": "Provider Version",
                "value_type": "field",
                "value_content_type": "provenance.providerversion",
                "value_entity": "provider-version",
                "code": "user_code"
            },
            {
                "key": "platform_version",
                "name": "Platform Version",
                "value_type": "field",
                "value_content_type": "provenance.platform_version",
                "value_entity": "platform-version",
                "code": "user_code"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }

}());