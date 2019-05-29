/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var customFieldService = require('../../services/reports/customFieldService');
    var rvAttributesHelper = require('../../helpers/rvAttributesHelper');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.customField = data.customField;

        vm.inputsGroup = {
            "name": "<b>Report Columns</b>",
            "key": 'input'
        };

        vm.inputsFunctions = [];


        vm.agree = function () {

            customFieldService.update(vm.entityType, vm.customField.id, vm.customField).then(function (data) {

                $mdDialog.hide({status: 'agree', data: {attribute: vm.attribute}});

            })
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.getBalanceReportAttrs = function () {

            var result = [];
            var attrsList = [];

            var balanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            var balanceMismatchAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            var balancePerformanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.balancereportperfomance', '', 'Perfomance', {maxDepth: 1});

            var allocationAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            var instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            var accountAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            var portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var strategy1attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            var strategy2attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            var strategy3attrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});


            attrsList = attrsList.concat(balanceAttrs);
            attrsList = attrsList.concat(allocationAttrs);
            // attrsList = attrsList.concat(allocationDynamicAttrs);

            attrsList = attrsList.concat(balancePerformanceAttrs);
            attrsList = attrsList.concat(balanceMismatchAttrs);

            attrsList = attrsList.concat(instrumentAttrs);
            // attrsList = attrsList.concat(instrumentDynamicAttrs);

            attrsList = attrsList.concat(accountAttrs);
            // attrsList = attrsList.concat(accountDynamicAttrs);

            attrsList = attrsList.concat(portfolioAttrs);
            // attrsList = attrsList.concat(portfolioDynamicAttrs);

            attrsList = attrsList.concat(strategy1attrs);
            attrsList = attrsList.concat(strategy2attrs);
            attrsList = attrsList.concat(strategy3attrs);

            result = attrsList.map(function (attr) {

                return {
                    "name": "Column: " + attr.name,
                    "description": "Column: " + attr.name + ". Reference: " + attr.key,
                    "groups": "input",
                    "func": attr.key
                }

            });

            return result;

        };

        vm.getTransactionReportAttrs = function () {

            var result = [];
            var attrsList = [];

            var transactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('reports.transactionreport', '', 'Transaction', {maxDepth: 1});

            var complexTransactionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('transactions.complextransaction', 'complex_transaction', 'Complex Transaction', {maxDepth: 1});

            var portfolioAttrs = rvAttributesHelper.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            var instrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            var responsibleAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.responsible', 'responsible', 'Responsible', {maxDepth: 1});

            var counterpartyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('counterparties.counterparty', 'counterparty', 'Counterparty', {maxDepth: 1});


            // instruments

            var linkedInstrumentAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            var allocationBalanceAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_balance', 'Allocation balance', {maxDepth: 1});

            var allocationPlAttrs = rvAttributesHelper.getAllAttributesAsFlatList('instruments.instrument', 'allocation_pl', 'Allocation P&L', {maxDepth: 1});

            // currencies

            var transactionCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'transaction_currency', 'Transaction currency', {maxDepth: 1});

            var settlementCurrencyAttrs = rvAttributesHelper.getAllAttributesAsFlatList('currencies.currency', 'settlement_currency', 'Settlement currency', {maxDepth: 1});

            // accounts

            var accountPositionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_position', 'Account Position', {maxDepth: 1});

            var accountCashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_cash', 'Account Cash', {maxDepth: 1});

            var accountInterimAttrs = rvAttributesHelper.getAllAttributesAsFlatList('accounts.account', 'account_interim', 'Account Interim', {maxDepth: 1});

            // strategies

            var strategy1cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_cash', 'Strategy 1 Cash', {maxDepth: 1});

            var strategy1positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_position', 'Strategy 1 Position', {maxDepth: 1});

            var strategy2cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_cash', 'Strategy 2 Cash', {maxDepth: 1});

            var strategy2positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_position', 'Strategy 2 Position', {maxDepth: 1});

            var strategy3cashAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_cash', 'Strategy 3 Cash', {maxDepth: 1});

            var strategy3positionAttrs = rvAttributesHelper.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_position', 'Strategy 3 Position', {maxDepth: 1});


            attrsList = attrsList.concat(transactionAttrs);
            attrsList = attrsList.concat(complexTransactionAttrs);
            attrsList = attrsList.concat(portfolioAttrs);
            attrsList = attrsList.concat(instrumentAttrs);
            attrsList = attrsList.concat(responsibleAttrs);
            attrsList = attrsList.concat(counterpartyAttrs);

            // attrsList = attrsList.concat(portfolioDynamicAttrs);
            // attrsList = attrsList.concat(complexTransactionDynamicAttrs);
            // attrsList = attrsList.concat(responsibleDynamicAttrs);
            // attrsList = attrsList.concat(counterpartyDynmicAttrs);


            // instruments

            attrsList = attrsList.concat(linkedInstrumentAttrs);
            attrsList = attrsList.concat(allocationBalanceAttrs);
            attrsList = attrsList.concat(allocationPlAttrs);

            // attrsList = attrsList.concat(instrumentDynamicAttrs);
            // attrsList = attrsList.concat(linkedInstrumentDynamicAttrs);
            // attrsList = attrsList.concat(allocationBalanceDynamicAttrs);
            // attrsList = attrsList.concat(allocationPlDnymaicAttrs);

            // currencies

            attrsList = attrsList.concat(transactionCurrencyAttrs);
            attrsList = attrsList.concat(settlementCurrencyAttrs);

            // accounts

            attrsList = attrsList.concat(accountPositionAttrs);
            attrsList = attrsList.concat(accountCashAttrs);
            attrsList = attrsList.concat(accountInterimAttrs);

            // attrsList = attrsList.concat(accountPositionDynamicAttrs);
            // attrsList = attrsList.concat(accountCashDynamicAttrs);
            // attrsList = attrsList.concat(accountInterimDynamicAttrs);

            // strategies

            attrsList = attrsList.concat(strategy1cashAttrs);
            attrsList = attrsList.concat(strategy1positionAttrs);
            attrsList = attrsList.concat(strategy2cashAttrs);
            attrsList = attrsList.concat(strategy2positionAttrs);
            attrsList = attrsList.concat(strategy3cashAttrs);
            attrsList = attrsList.concat(strategy3positionAttrs);


            result = attrsList.map(function (attr) {

                return {
                    "name": "Column: " + attr.name,
                    "description": "Column: " + attr.name + ". Reference: " + attr.key,
                    "groups": "input",
                    "func": attr.key
                }

            });

            return result;

        };

        vm.getInputFunctions = function (entityType) {

            var result = [];


            if (entityType === 'balance-report') {

                result = vm.getBalanceReportAttrs();

            }

            if (entityType === 'pl-report') {

                result = vm.getBalanceReportAttrs();

            }

            if (entityType === 'transaction-report') {

                result = vm.getTransactionReportAttrs();

            }


            return result;

        };


        vm.init = function () {

            vm.inputsFunctions = vm.getInputFunctions(vm.entityType)

        };

        vm.init();

    }

}());