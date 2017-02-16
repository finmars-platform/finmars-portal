/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    //

    var getEntitiesWithoutBaseAttrsList = function () {
        return ['price-history', 'currency-history', 'complex-transaction'
            , 'transaction', 'balance-report', 'pnl-report',
            'transaction-report', 'cash-flow-projection-report',
            'performance-report',
            'audit-transaction', 'audit-instrument'];
    };

    var getEntitiesWithoutDynamicAttrsList = function () {
        return ['price-history', 'currency-history',
            'instrument-type', 'account-type', 'pricing-policy',
            'strategy-1', 'strategy-2', 'strategy-3', 'transaction-type',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'balance-report', 'pnl-report',
            'transaction-report', 'cash-flow-projection-report',
            'performance-report',
            'counterparty-group', 'responsible-group', 'tag', 'transaction-type-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup',
            'audit-transaction', 'audit-instrument']
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