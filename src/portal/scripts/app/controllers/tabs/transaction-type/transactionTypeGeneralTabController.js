/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var transactionTypeGroupService = require('../../../services/transaction/transactionTypeGroupService');
    var portfolioService = require('../../../services/portfolioService');
    var instrumentTypeService = require('../../../services/instrumentTypeService');

    module.exports = function ($scope) {
        logService.controller('TransactionTypeGeneralTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.entity.book_transaction_layout = vm.entity.book_transaction_layout || '';
        vm.entity.actions = vm.entity.actions || [];
        vm.entity.inputs = vm.entity.inputs || [];

        vm.readyStatus = {transactionTypeGroups: false, instrumentTypes: false, portfolios: false};

        vm.getTransactionTypeGroups = function () {
            transactionTypeGroupService.getList().then(function (data) {
                vm.transactionTypeGroups = data.results;
                vm.readyStatus.transactionTypeGroups = true;
                $scope.$apply();
            })
        };

        vm.getPortfolios = function () {
            portfolioService.getList().then(function (data) {
                vm.portfolios = data.results;
                vm.readyStatus.portfolios = true;
                $scope.$apply();
            })
        };

        vm.getInstrumentTypes = function () {
            instrumentTypeService.getList().then(function (data) {
                vm.instrumentTypes = data.results;
                vm.readyStatus.instrumentTypes = true;
                $scope.$apply();
            })
        };

        vm.bindSelectedText = function (entity, fallback) {
            if (entity) {
                return '[' + entity.length + ']';
            }
            return fallback;
        };

        vm.getTransactionTypeGroups();
        vm.getPortfolios();
        vm.getInstrumentTypes();

        vm.checkReadyStatus = function () {
            if (vm.readyStatus.transactionTypeGroups == true && vm.readyStatus.portfolios == true && vm.readyStatus.instrumentTypes == true) {
                return true;
            }
            return false;
        }
    }

}());