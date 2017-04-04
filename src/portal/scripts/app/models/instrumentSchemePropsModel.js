/**
 * Created by szhitenev on 03.04.2017.
 */
(function () {

    'use strict';

    var getAttributes = function () {
        return [
            {
                key: 'reference_for_pricing',
                name: 'Reference for pricing',
                "value_type": 10
            },
            {
                key: 'factor_schedule_method',
                name: 'Factor schedule method',
                type: 'field'
            },
            {
                key: 'accrual_calculation_schedule_method',
                name: 'Accrual calculation schedule method',
                type: 'field'
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
                "key": "instrument_type",
                "name": "Instrument type",
                "value_type": 10
            },
            {
                "key": "pricing_currency",
                "name": "Pricing currency",
                "value_type": 10
            },
            {
                "key": "price_multiplier",
                "name": "Price multiplier",
                "value_type": 10
            },
            {
                "key": "accrued_currency",
                "name": "Accrued currency",
                "value_type": 10
            },
            {
                "key": "accrued_multiplier",
                "name": "Accrued multiplier",
                "value_type": 10
            },
            {
                "key": "user_text_1",
                "name": "User text 1",
                "value_type": 10
            },
            {
                "key": "user_text_2",
                "name": "User text 2",
                "value_type": 10
            },
            {
                "key": "user_text_3",
                "name": "User text 3",
                "value_type": 10
            },
            {
                "key": "maturity_date",
                "name": "Maturity date",
                "value_type": 10
            },
            {
                "key": "payment_size_detail",
                "name": "Payment size detail",
                "value_type": 'field'
            },
            {
                "key": "daily_pricing_model",
                "name": "Daily pricing model",
                "value_type": 'field'
            },
            {
                "key": "price_download_scheme",
                "name": "Price download scheme",
                "value_type": 'field'
            },
            {
                "key": "default_price",
                "name": "Default price",
                "value_type": 10
            },
            {
                "key": "default_accrued",
                "name": "Default accrued",
                "value_type": 10
            }
        ]
    };

    module.exports = {

        getAttributes: getAttributes

    }


}())