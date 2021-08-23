(function () {

    'use strict';
    
    var requiredAttrs = ['name'];
    var requiredAttrs2 = ['name', 'group'];
    var strategiesAttrs = ['name', 'subgroup'];
    var instrumentAttrs = ['name', 'maturity_date'];
    var pricesAttrs = ['instrument', 'accrued_price', 'principal_price', 'pricing_policy'];
    var currenciesAttrs = ['currency', 'pricing_policy', 'fx_rate'];
    var instrumentTypeAttrs = ['name', 'user_code', 'instrument_class', 'accrued_currency', 'accrued_multiplier', 'payment_size_detail', 'default_accrued'];

    module.exports = {
        requiredAttrs: requiredAttrs,
        requiredAttrs2: requiredAttrs2,
		strategiesAttrs: strategiesAttrs,
        instrumentAttrs: instrumentAttrs,
        pricesAttrs: pricesAttrs,
        currenciesAttrs: currenciesAttrs,
        instrumentTypeAttrs: instrumentTypeAttrs
    }

}());