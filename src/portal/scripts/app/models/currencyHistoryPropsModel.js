/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            //{
            //    "key": "name",
            //    "name": "Name",
            //    "value_type": 10
            //},
            //{
            //    "key": "short_name",
            //    "name": "Short name",
            //    "value_type": 10
            //},
            //{
            //    "key": "notes",
            //    "name": "Notes",
            //    "value_type": 10
            //},
            {
                "key": "currency",
                "name": "Currency",
                "value_type": "field",
                "entity": "currency",
                "content_type": "",
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
                "entity": "pricing_policy",
                "content_type": "instruments.pricingpolicy",
                "code": "user_code"
            }
            //{
            //    "key": "fx_rate_expr",
            //    "name": "fx_rate_expr",
            //    "value_type": 10
            //}
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())