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
                "key": "public_name",
                "name": "Public name",
                "value_type": 10
            },
            {
                "key": "instrument_type",
                "name": "Instrument type",
                "value_type": "field",
                "value_content_type": "instruments.instrumenttype",
                "value_entity": "instrument-type",
                "code": "user_code"
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
                "value_content_type": "integrations.pricedownloadscheme",
                "value_entity": "price-download-scheme",
                "code": "user_code",
                "value_type": "field"
            },
            {
                "key": "pricing_currency",
                "name": "Pricing currency",
                "value_content_type": "currencies.currency",
                "value_entity": "currency",
                "code": "user_code",
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
                "value_content_type": "currencies.currency",
                "value_entity": "currency",
                "code": "user_code",
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
                "value_content_type": "instruments.dailypricingmodel",
                "value_entity": "daily-pricing-model",
                "code": "system_code",
                "value_type": "field"
            },
            {
                "key": "pricing_condition",
                "name": "Pricing Condition",
                "value_content_type": "instruments.pricingcondition",
                "value_entity": "pricing-condition",
                "code": "system_code",
                "value_type": "field"
            },
            {
                "key": "payment_size_detail",
                "name": "Payment size detail",
                "value_content_type": "instruments.paymentsizedetail",
                "value_entity": "payment-size-detail",
                "code": "system_code",
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


}());