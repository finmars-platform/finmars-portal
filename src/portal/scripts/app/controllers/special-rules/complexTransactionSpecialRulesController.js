/**
 * Created by szhitenev on 03.10.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var portfolioService = require('../../services/portfolioService');
    var instrumentService = require('../../services/instrumentService');
    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope) {

        logService.controller('complexTransactionSpecialRulesController', 'initialized');

        var vm = this;

        $scope.$parent.vm.specialRulesReady = false;

        portfolioService.getList().then(function (data) {
            vm.portfolios = data.results;
            $scope.$apply();
        });

        instrumentService.getList().then(function (data) {
            vm.instruments = data.results;
            $scope.$apply();
        });

        vm.loadTransactionTypes = function () {
            transactionTypeService.getList().then(function (data) {
                vm.transactionTypes = data.results;
                $scope.$apply();
            })
        };

        vm.transactionTypeHandler = function () {
            $scope.$parent.vm.specialRulesReady = false;
            setTimeout(function () {
                $scope.$parent.vm.editLayoutEntityInstanceId = vm.transactionTypeId;
                $scope.$parent.vm.specialRulesReady = true;
                $scope.$parent.vm.entity._transaction_type_id = vm.transactionTypeId;
                console.log('PARENT', $scope.$parent.vm);
                $scope.$parent.vm.getEditListByInstanceId($scope.$parent.vm.entityType, $scope.$parent.vm.editLayoutEntityInstanceId);
                $scope.$apply();
            }, 200); // but why?

        }

    }

}());