/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [

            {
                "key": "currency",
                "name": "Currency",
                "value_type": "field",
                "value_entity": "currency",
                "value_content_type": "",
                "code": "currencies.currency"
            },
            {
                "key": "date",
                "name": "Date",
                "value_type": 40
            },
            {
                "key": "fx_rate",
                "name": "Fx rate",
                "value_type": 20
            },
            {
                "key": "pricing_policy",
                "name": "Pricing policy",
                "value_type": "field",
                "value_entity": "pricing_policy",
                "value_content_type": "instruments.pricingpolicy",
                "code": "user_code"
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())