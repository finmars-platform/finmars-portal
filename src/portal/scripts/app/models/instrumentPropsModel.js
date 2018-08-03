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
                "key": "instrument_type",
                "name": "Instrument type",
                "value_type": "field"
            },
            {
                "key": "is_active",
                "name": "Is active",
                "value_type": "boolean"
            },
            {
                "key": "reference_for_pricing",
                "name": "Reference for pricing",
                "value_type": 10
            },
            {
                "key": "price_download_scheme",
                "name": "Price download scheme",
                "value_type": "field"
            },
            {
                "key": "pricing_currency",
                "name": "Pricing currency",
                "value_type": "field"
            },
            {
                "key": "price_multiplier",
                "name": "Price multiplier",
                "value_type": 20
            },
            {
                "key": "accrued_currency",
                "name": "Accrued currency",
                "value_type": "field"
            },
            {
                "key": "maturity_date",
                "name": "Maturity date",
                "value_type": 40
            },
            {
                "key": "maturity_price",
                "name": "Maturity price",
                "value_type": 20
            },
            {
                "key": "accrued_multiplier",
                "name": "Accrued multiplier",
                "value_type": 20
            },
            {
                "key": "daily_pricing_model",
                "name": "Daily pricing model",
                "value_type": "field"
            },
            {
                "key": "payment_size_detail",
                "name": "Payment size detail",
                "value_type": "field"
            },
            {
                "key": "default_price",
                "name": "Default price",
                "value_type": 20
            },
            {
                "key": "default_accrued",
                "name": "Default accrued",
                "value_type": 20
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
                "key": "object_permissions_user",
                "name": "Users permissions",
                "value_type": "mc_field"
            },
            {
                "key": "object_permissions_group",
                "name": "Groups permissions",
                "value_type": "mc_field"
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