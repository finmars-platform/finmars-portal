(function () {

    'use strict';
    
    var requiredAttrs = ['name',];
    var requiredAttrs2 = ['name', 'group'];
    var instrumentAttrs = ['name', 'maturity_date'];
    var pricesAttrs = ['instrument', 'accrued_price', 'principal_price', 'pricing_policy'];
    var currenciesAttrs = ['currency', 'pricing_policy', 'fx_rate'];
    var instrumentTypeAttrs = ['name', 'instrument_class'];

    module.exports = {
        requiredAttrs: requiredAttrs,
        requiredAttrs2: requiredAttrs2,
        instrumentAttrs: instrumentAttrs,
        pricesAttrs: pricesAttrs,
        currenciesAttrs: currenciesAttrs,
        instrumentTypeAttrs: instrumentTypeAttrs
    }

}());