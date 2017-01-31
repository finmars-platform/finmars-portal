/**
 * Created by szhitenev on 03.10.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var portfolioService = require('../../services/portfolioService');
    var instrumentTypeService = require('../../services/instrumentTypeService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope) {

        logService.controller('complexTransactionSpecialRulesController', 'initialized');

        var vm = this;

        vm.complexTransactionOptions = {
            portfolio: $scope.$parent.vm.complexTransactionOptions.portfolio,
            instrumentType: $scope.$parent.vm.complexTransactionOptions.instrumentType,
            transactionType: $scope.$parent.vm.complexTransactionOptions.transactionType
        };

        $scope.$parent.vm.specialRulesReady = false;

        portfolioService.getList().then(function (data) {
            vm.portfolios = data.results;
            $scope.$apply();
        });

        instrumentTypeService.getList().then(function (data) {
            vm.instrumentTypes = data.results;
            $scope.$apply();
        });

        transactionTypeService.getList().then(function (data) {
            vm.transactionTypes = data.results;
            $scope.$apply();
        });

        vm.loadTransactionTypes = function () {

            var options = {
                filters: {
                    portfolio: vm.complexTransactionOptions.portfolio,
                    'instrument_type': vm.complexTransactionOptions.instrumentType
                }
            };

            transactionTypeService.getList(options).then(function (data) {
                vm.transactionTypes = data.results;
                $scope.$apply();
            })
        };

        $scope.$parent.$watchCollection('vm.complexTransactionOptions', function () {
            console.log('hererer?');
            vm.complexTransactionOptions = $scope.$parent.vm.complexTransactionOptions;

            vm.loadTransactionTypes();
        });


        vm.transactionTypeHandler = function () {
            $scope.$parent.vm.specialRulesReady = false;
            setTimeout(function () {
                $scope.$parent.vm.complexTransactionOptions.transactionType = vm.complexTransactionOptions.transactionType;
                $scope.$parent.vm.editLayoutEntityInstanceId = vm.complexTransactionOptions.transactionType;
                $scope.$parent.vm.specialRulesReady = true;
                $scope.$parent.vm.entity._transaction_type_id = vm.complexTransactionOptions.transactionType;
                console.log('PARENT', $scope.$parent.vm);
                $scope.$parent.vm.getEditListByInstanceId();
                $scope.$apply();
            }, 200); // but why?

        }

    }

}());