/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var resolve = function (entityType) {

    };
    module.exports = {
        resolve: resolve
    }

    switch (entityType) {

        case 'portfolio':
            return 'portfolios/portfolio';
        case 'account':
            return 'accounts/account';
        case 'account-type':
            return 'accounts/account-type';
        case 'responsible':
            return 'counterparties/responsible';
        case 'responsible-group':
            return 'counterparties/responsible-group';
        case 'counterparty':
            return 'counterparties/counterparty';
        case 'counterparty-group':
            return 'counterparties/counterparty-group';
        case 'instrument':
            return 'instruments/instrument';
        case 'instrument-type':
            return 'instruments/instrument-type';
        case 'price-history':
            return 'instruments/price-history';
        case 'transaction':
            return 'transactions/transaction';
        case 'transaction-type':
            return 'transactions/transaction-type';
        case 'complex-transaction':
            return 'transaction/complex-transaction';
        case 'currency':
            return 'currencies/currency';
        case 'currency-history':
            return 'currencies/currency-history';
        case 'pricing-policy':
            return 'instruments/pricing-policy';
        case 'strategy-1':
            return 'strategies/1/strategy';
        case 'strategy-1-subgroup':
            return 'strategies/1/subgroup';
        case 'strategy-1-group':
            return 'strategies/1/group';
        case 'strategy-2':
            return 'strategies/2/strategy';
        case 'strategy-2-subgroup':
            return 'strategies/2/subgroup';
        case 'strategy-2-group':
            return 'strategies/2/group';
        case 'strategy-3':
            return 'strategies/3/strategy';
        case 'strategy-3-subgroup':
            return 'strategies/3/subgroup';
        case 'strategy-3-group':
            return 'strategies/3/group'

    }

}());