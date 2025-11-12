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
                "value_type": 10
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            },
            {
                "key": "reference_for_pricing",
                "name": "Reference for pricing",
                "value_type": 10
            },
            {
                "key": "default_fx_rate",
                "name": "Default FX rate",
                "value_type": 20
            },
            {
                "key": "pricing_condition",
                "name": "Pricing Condition",
                "value_content_type": "instruments.pricingcondition",
                "value_entity": "pricing-condition",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "country",
                "name": "Country",
                "value_content_type": "instruments.country",
                "value_entity": "country",
                "code": "user_code",
                "value_type": "field"
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


}())