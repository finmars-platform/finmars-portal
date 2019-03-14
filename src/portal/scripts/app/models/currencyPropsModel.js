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
                "key": "reference_for_pricing",
                "name": "Reference for pricing",
                "value_type": 10
            },
            {
                "key": "daily_pricing_model",
                "name": "Daily pricing model",
                "value_type": "field",
                "entity": "daily-pricing-model",
                "code": "system_code",
                "allow_null": false
            },
            {
                "key": "price_download_scheme",
                "name": "Price download scheme",
                "value_type": "field",
                "entity": "price_download_scheme",
                "content_type": "integrations.pricedownloadscheme",
                "code": "user_code"
            },
            {
                "key": "default_fx_rate",
                "name": "Default FX rate",
                "value_type": 20
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