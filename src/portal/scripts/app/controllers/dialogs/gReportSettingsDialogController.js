/**
 * Created by szhitenev on 15.11.2016.
 */
(function () {

    'use strict';

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

    var portfolioService = require('../../services/portfolioService');
    var accountService = require('../../services/accountService');
    var strategyService = require('../../services/strategyService');
    var transactionClassService = require('../../services/transaction/transactionClassService');


    module.exports = function ($scope, $mdDialog, reportOptions, options) {

        var vm = this;

        console.log('reportOptions', reportOptions);

        vm.reportOptions = JSON.parse(JSON.stringify(reportOptions));

        if (vm.reportOptions.accounts_cash && vm.reportOptions.accounts_cash.length) {
            vm.accountsCash = vm.reportOptions.accounts_cash[0];
        } else {
            vm.accountsCash = 0;
        }

        if (vm.reportOptions.accounts_position && vm.reportOptions.accounts_position.length) {
            vm.accountsPosition = vm.reportOptions.accounts_position[0];
        } else {
            vm.accountsPosition = 0;
        }

        // console.log('vm.accountsCash', vm.accountsCash);
        // console.log('vm.accountsPosition', vm.accountsPosition);

        vm.selectOptions = [
            {
                value: 0,
                caption: "Ignore"
            },
            {
                value: 1,
                caption: "Independent"
            }
        ];

        vm.strategiesSelectOptions = [
            {
                value: 0,
                caption: "Ignore"
            },
            {
                value: 1,
                caption: "Independent"
            },
            {
                value: 2,
                caption: 'Offsetting (Interdependent - 0/100, 100/0, 50/50)'
            }
        ];


        vm.entityType = options.entityType;

        vm.readyStatus = {
            pricingPolicy: false,
            currency: false,
            // portfolio: false,
            // account: false,
            // strategy1: false,
            // strategy2: false,
            // strategy3: false,
            transactionClass: false
        };

        vm.checkGeneralSettings = function () {
            return vm.entityType == 'balance-report' || vm.entityType == 'pl-report' || vm.entityType == 'performance-report';
        };

        vm.getPricingPolicies = function () {

            vm.readyStatus.pricingPolicy = false;

            var opitons = {
                pageSize: 1000,
                page: 1
            };

            pricingPolicyService.getList(opitons).then(function (data) {

                vm.pricingPolicies = data.results;
                vm.readyStatus.pricingPolicy = true;

                $scope.$apply();

            });
        };

        vm.onSearchChange = function ($event) {
            $event.stopPropagation();
        };

        vm.getCurrencies = function () {

            vm.readyStatus.currency = false;

            var options = {
                page: 1,
                pageSize: 1000
            };

            currencyService.getList(options).then(function (data) {

                vm.currencies = data.results;
                vm.readyStatus.currency = true;

                $scope.$apply();

            });
        };

        /*vm.getPortfolios = function () {

            vm.readyStatus.portfolio = false;

            portfolioService.getList().then(function (data) {

                vm.portfolios = data.results;
                vm.readyStatus.portfolio = true;

                $scope.$apply();

            });
        };*/
        vm.optionsForMultiselect = {
            page: 1,
            pageSize: 1000
        };

        vm.getPortfolios = function (options) {
            return portfolioService.getList(options);
        };

        /*vm.getAccounts = function () {

            vm.readyStatus.account = false;

            accountService.getList().then(function (data) {

                vm.accounts = data.results;
                vm.readyStatus.account = true;

                $scope.$apply();

            });
        };*/
        vm.getAccounts = function (options) {
            return accountService.getList(options);
        };

        /*vm.getStrategies1 = function () {

            vm.readyStatus.strategy1 = false;

            strategyService.getList(1).then(function (data) {

                vm.strategies1 = data.results;
                vm.readyStatus.strategy1 = true;

                $scope.$apply();

            });
        };*/

        vm.getStrategies1 = function (options) {
            return strategyService.getList(1, options);
        };

        /*vm.getStrategies2 = function () {

            vm.readyStatus.strategy2 = false;

            strategyService.getList(2).then(function (data) {

                vm.strategies2 = data.results;
                vm.readyStatus.strategy2 = true;

                $scope.$apply();

            });
        };*/

        vm.getStrategies2 = function (options) {
            return strategyService.getList(2, options);
        };

        /*vm.getStrategies3 = function () {

            vm.readyStatus.strategy3 = false;

            strategyService.getList(3).then(function (data) {

                vm.strategies3 = data.results;
                vm.readyStatus.strategy3 = true;

                $scope.$apply();

            });
        };*/

        vm.getStrategies3 = function (options) {
            return strategyService.getList(3, options);
        };

        vm.getTransactionClasses = function () {

            vm.readyStatus.transactionClass = false;

            transactionClassService.getList().then(function (data) {

                vm.transactionClasses = data;
                vm.readyStatus.transactionClass = true;

                $scope.$apply();
            })
        };


        vm.checkReadyStatus = function () {

            var ready = true;

            var keys = Object.keys(vm.readyStatus);

            for (var i = 0; i < keys.length; i = i + 1) {

                //console.log(keys[i], vm.readyStatus[keys[i]]);

                if (vm.readyStatus[keys[i]] == false) {
                    ready = false;
                }

            }

            return ready;
        };

        vm.getPricingPolicies();
        vm.getCurrencies();
        // vm.getPortfolios();
        // vm.getAccounts();
        vm.getTransactionClasses();
        // vm.getStrategies1();
        // vm.getStrategies2();
        // vm.getStrategies3();

        vm.saveSettings = function () {

            // console.log('saveSettings.reportOptions', vm.reportOptions);
            // console.log('saveSettings.accountsCash', vm.accountsCash);
            // console.log('saveSettings.accountsPosition', vm.accountsPosition);

            if (vm.accountsCash === 1) {
                vm.reportOptions.accounts_cash[0] = 1;
            } else {
                vm.reportOptions.accounts_cash = [];
            }

            if (vm.accountsPosition === 1) {
                vm.reportOptions.accounts_position[0] = 1;
            } else {
                vm.reportOptions.accounts_position = [];
            }

            $mdDialog.hide({status: 'agree', data: vm.reportOptions});
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

    }

}());