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
                "key": "instrument",
                "name": "Instrument",
                "value_content_type": "instruments.instrument",
                "value_entity": "instrument",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            },
            {
                "key": "pricing_policy",
                "name": "Pricing policy",
                "value_content_type": "instruments.pricingpolicy",
                "value_entity": "pricing_policy",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "principal_price",
                "name": "Principal price",
                "value_type": 20
            },
            {
                "key": "accrued_price",
                "name": "Accrued price",
                "value_type": 20
            },
            {
                "key": "long_delta",
                "name": "Long delta",
                "value_type": 20
            },
            {
                "key": "short_delta",
                "name": "Short delta",
                "value_type": 20
            },
            {
                "key": "nav",
                "name": "NAV",
                "value_type": 20
            },
            {
                "key": "cash_flow",
                "name": "Cash Flow",
                "value_type": 20
            },
            {
                "key": "factor",
                "name": "Factor",
                "value_type": 20
            },
            {
                "key": "procedure_modified_datetime",
                "name": "Modified Date And Time",
                "value_type": 80,
                "readonly": true
            },

            {
                "key": "is_temporary_price",
                "name": "Is Temporary Price",
                "value_type": 50,
                "allow_null": true
            },
            {
                "key": "ytm",
                "name": "YTM",
                "value_type": 20,
            },
            {
                "key": "modified_duration",
                "name": "Modified Duration",
                "value_type": 20,
            },
            {
                "key": "error_message",
                "name": "Error Message",
                "value_type": 10,
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

            //{
            //    "key": "factor",
            //    "name": "Factor",
            //    "value_type": 20
            //}
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())