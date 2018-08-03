/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                "key": "instrument",
                "name": "Instrument",
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