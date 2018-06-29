/**
 * Created by szhitenev on 07.12.2016.
 */
(function () {

    'use strict';

    var resolve = function (entityType) {

        switch (entityType) {

            case 'portfolio':
                return 'portfolios/portfolio';
            case 'account':
                return 'accounts/account';
            case 'responsible':
                return 'counterparties/responsible';
            case 'counterparty':
                return 'counterparties/counterparty';
            case 'instrument':
                return 'instruments/instrument';
            case 'transaction':
                return 'transactions/transaction';
            case 'currency':
                return 'currencies/currency'


        }
    };

    module.exports = {
        resolve: resolve
    }

}());