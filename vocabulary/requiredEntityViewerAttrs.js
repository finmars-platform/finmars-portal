(function () {

    'use strict';
    
    var requiredAttrs = ['name',];
    var requiredAttrs2 = ['name', 'group'];
    var instrumentAttrs = ['name', 'pricing_currency'];
    var pricesAttrs = ['instrument', 'accrued_price', 'principal_price', 'pricing_policy'];
    var currenciesAttrs = ['currency', 'pricing_policy', 'fx_rate'];
    var instrumentTypeAttrs = ['name', 'user_code', 'instrument_class', 'accrued_currency', 'accrued_multiplier', 'payment_size_detail', 'default_accrued'];

    module.exports = {
        requiredAttrs: requiredAttrs,
        requiredAttrs2: requiredAttrs2,
        instrumentAttrs: instrumentAttrs,
        pricesAttrs: pricesAttrs,
        currenciesAttrs: currenciesAttrs,
        instrumentTypeAttrs: instrumentTypeAttrs
    }

}());