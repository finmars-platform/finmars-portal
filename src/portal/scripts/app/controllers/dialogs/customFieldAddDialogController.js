/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var customFieldService = require('../../services/reports/customFieldService');
    var rvAttributesHelper = require('../../helpers/rvAttributesHelper');

    var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');


    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.entityType = data.entityType;
        vm.customField = {};

        vm.readyStatus = {
            content: true
        };

        vm.inputsGroups = [
            {
                "name": "<b>Columns</b>",
                "key": 'input'
            },
            {
                "name": "<b>Custom Columns</b>",
                "key": 'custom_field'
            }];

        vm.inputsFunctions = [];

        vm.valueTypes = [
            {
                name: 'Number',
                value: 20
            },
            {
                name: 'Text',
                value: 10
            },
            {
                name: 'Date',
                value: 40
            }
        ];

        vm.validateUserCode = function () {

            var expression = /^\w+$/;

            if (expression.test(vm.customField.user_code)) {
                vm.userCodeError = false;
            } else {
                vm.userCodeError = true;

            }

        };

        vm.setupConfig = function ($event) {
            $mdDialog.show({
                controller: 'CustomFieldsConfigDialogController as vm',
                templateUrl: 'views/dialogs/custom-fields-config-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        customField: vm.attribute
                    }
                },
                preserveScope: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {

                console.log('res', res);

                if (res.status === 'agree') {

                    vm.attribute.expr = res.data.expression;
                    vm.attribute.layout = res.data.layout;

                }
            });
        };

        vm.agree = function () {

            customFieldService.create(vm.entityType, vm.customField).then(function (value) {

                $mdDialog.hide({status: 'agree'});

            })

        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.getBalanceReportAttrs = function () {

            return new Promise(function (resolve, reject) {

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

                dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {

                    var portfolioDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['portfolios.portfolio'], 'portfolios.portfolio', 'portfolio', 'Portfolio');
                    var accountDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account', 'Account');
                    var instrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'instrument', 'Instrument');
                    var allocationDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation', 'Allocation');

                    attrsList = attrsList.concat(balanceAttrs);
                    attrsList = attrsList.concat(allocationAttrs);
                    attrsList = attrsList.concat(allocationDynamicAttrs);

                    attrsList = attrsList.concat(balancePerformanceAttrs);
                    attrsList = attrsList.concat(balanceMismatchAttrs);

                    attrsList = attrsList.concat(instrumentAttrs);
                    attrsList = attrsList.concat(instrumentDynamicAttrs);

                    attrsList = attrsList.concat(accountAttrs);
                    attrsList = attrsList.concat(accountDynamicAttrs);

                    attrsList = attrsList.concat(portfolioAttrs);
                    attrsList = attrsList.concat(portfolioDynamicAttrs);

                    attrsList = attrsList.concat(strategy1attrs);
                    attrsList = attrsList.concat(strategy2attrs);
                    attrsList = attrsList.concat(strategy3attrs);

                    var captions = {
                        10: 'String',
                        20: 'Number',
                        40: 'Date'
                    };


                    result = attrsList.map(function (attr) {

                        return {
                            "name": "Column: " + attr.name + ' (' + attr.key + ')',
                            "description": "Column Name: " + attr.name + "\nReference (key ID): " + attr.key + '\nValue Type: ' + captions[attr.value_type],
                            "groups": "input",
                            "func": attr.key
                        }

                    });

                    resolve(result);

                });
            })

        };

        vm.getTransactionReportAttrs = function () {

            return new Promise(function (resolve, reject) {

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


                dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {

                    var portfolioDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['portfolios.portfolio'], 'portfolios.portfolio', 'portfolio', 'Portfolio');
                    var complexTransactionDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['transactions.complextransaction'], 'transactions.complextransaction', 'complex_transaction', 'Complex Transaction');
                    var responsibleDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['counterparties.responsible'], 'counterparties.responsible', 'responsible', 'Responsible');
                    var counterpartyDynmicAttrs = rvAttributesHelper.formatAttributeTypes(data['counterparties.counterparty'], 'counterparties.counterparty', 'counterparty', 'Counterparty');

                    var instrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'instrument', 'Instrument');
                    var linkedInstrumentDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'linked_instrument', 'Linked Instrument');
                    var allocationBalanceDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation_balance', 'Allocation Balance');
                    var allocationPlDnymaicAttrs = rvAttributesHelper.formatAttributeTypes(data['instruments.instrument'], 'instruments.instrument', 'allocation_pl', 'Allocation PL');

                    var accountPositionDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_position', 'Account Position');
                    var accountCashDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_cash', 'Account Cash');
                    var accountInterimDynamicAttrs = rvAttributesHelper.formatAttributeTypes(data['accounts.account'], 'accounts.account', 'account_interim', 'Account Interim');


                    attrsList = attrsList.concat(transactionAttrs);
                    attrsList = attrsList.concat(complexTransactionAttrs);
                    attrsList = attrsList.concat(portfolioAttrs);
                    attrsList = attrsList.concat(instrumentAttrs);
                    attrsList = attrsList.concat(responsibleAttrs);
                    attrsList = attrsList.concat(counterpartyAttrs);

                    attrsList = attrsList.concat(portfolioDynamicAttrs);
                    attrsList = attrsList.concat(complexTransactionDynamicAttrs);
                    attrsList = attrsList.concat(responsibleDynamicAttrs);
                    attrsList = attrsList.concat(counterpartyDynmicAttrs);


                    // instruments

                    attrsList = attrsList.concat(linkedInstrumentAttrs);
                    attrsList = attrsList.concat(allocationBalanceAttrs);
                    attrsList = attrsList.concat(allocationPlAttrs);

                    attrsList = attrsList.concat(instrumentDynamicAttrs);
                    attrsList = attrsList.concat(linkedInstrumentDynamicAttrs);
                    attrsList = attrsList.concat(allocationBalanceDynamicAttrs);
                    attrsList = attrsList.concat(allocationPlDnymaicAttrs);

                    // currencies

                    attrsList = attrsList.concat(transactionCurrencyAttrs);
                    attrsList = attrsList.concat(settlementCurrencyAttrs);

                    // accounts

                    attrsList = attrsList.concat(accountPositionAttrs);
                    attrsList = attrsList.concat(accountCashAttrs);
                    attrsList = attrsList.concat(accountInterimAttrs);

                    attrsList = attrsList.concat(accountPositionDynamicAttrs);
                    attrsList = attrsList.concat(accountCashDynamicAttrs);
                    attrsList = attrsList.concat(accountInterimDynamicAttrs);

                    // strategies

                    attrsList = attrsList.concat(strategy1cashAttrs);
                    attrsList = attrsList.concat(strategy1positionAttrs);
                    attrsList = attrsList.concat(strategy2cashAttrs);
                    attrsList = attrsList.concat(strategy2positionAttrs);
                    attrsList = attrsList.concat(strategy3cashAttrs);
                    attrsList = attrsList.concat(strategy3positionAttrs);


                    var captions = {
                        10: 'String',
                        20: 'Number',
                        40: 'Date'
                    };


                    result = attrsList.map(function (attr) {

                        return {
                            "name": "Column: " + attr.name + ' (' + attr.key + ')',
                            "description": "Column Name: " + attr.name + "\nReference (key ID): " + attr.key + '\nValue Type: ' + captions[attr.value_type],
                            "groups": "input",
                            "func": attr.key
                        }

                    });

                    resolve(result);

                });

            })

        };

        vm.getCustomFields = function () {
            return new Promise(function (resolve, reject) {

                customFieldService.getList(vm.entityType).then(function (data) {

                    var captions = {
                        10: 'String',
                        20: 'Number',
                        40: 'Date'
                    };


                    var result = data.results.map(function (item) {

                        return {
                            "name": "Custom Column: " + item.name,
                            "description": "Custom Column: " + item.name + " (" + item.user_code + ") :: " + captions[item.value_type] + '\n' + item.notes + '\nExpression: \n' + item.expr,
                            "groups": "custom_field",
                            "func": item.user_code
                        }

                    });

                    resolve(result)

                })

            })
        };

        vm.getInputFunctions = function (entityType) {

            return new Promise(function (resolve, reject) {

                var promises = [];

                if (entityType === 'balance-report') {

                    promises.push(vm.getBalanceReportAttrs());

                }

                if (entityType === 'pl-report') {

                    promises.push(vm.getBalanceReportAttrs());

                }

                if (entityType === 'transaction-report') {

                    promises.push(vm.getTransactionReportAttrs());

                }

                promises.push(vm.getCustomFields());

                Promise.all(promises).then(function (data) {

                    resolve(data);

                });


            })

        };


        vm.init = function () {

            vm.getInputFunctions(vm.entityType).then(function (data) {

                vm.inputsFunctions = data;

                console.log('vm.inputsFunctions', vm.inputsFunctions);

                vm.readyStatus.content = true;

                $scope.$apply();

            })

        };

        vm.init();

    }

}());