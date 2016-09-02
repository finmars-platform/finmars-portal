/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    var getEntitiesWithoutBaseAttrsList = function () {
        return ['price-history', 'currency-history'];
    };

    var getEntitiesWithoutDynamicAttrsList = function () {
        return ['price-history', 'currency-history',
            'instrument-type', 'currency', 'account-type', 'pricing-policy',
            'strategy-1', 'strategy-2', 'strategy-3', 'transaction-type',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup']
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return ['daily_pricing_model', 'payment_size_detail', 'accrued_currency', 'pricing_currency'];
    };

    module.exports = {
        getEntitiesWithoutDynamicAttrsList: getEntitiesWithoutDynamicAttrsList,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField
    }


}());