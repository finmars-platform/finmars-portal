/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var transactionTypeService = require('../../../services/transactionTypeService');

    module.exports = function ($scope) {
        logService.controller('BookTransactionActionsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.transactionTypeId = $scope.$parent.vm.editLayoutEntityInstanceId;

        transactionTypeService.getByKey(vm.transactionTypeId).then(function (data) {
            vm.transactionType = data;

            vm.transactionActions = {
                action_order: [],
                action_type: [],
                description: [],
                transaction_class: [],
                portfolio: [],
                instrument: []
            };

            vm.transactionType.actions.forEach(function (action, $index) {
                vm.transactionActions.action_order.push(action.order);
                vm.transactionActions.description.push(action.action_notes);
                if (action.instrument !== null) {
                    vm.transactionActions.action_type.push('Instrument');
                    vm.transactionActions.transaction_class.push('-');
                    vm.transactionActions.portfolio.push('-');
                    vm.transactionActions.instrument.push('-');
                } else {
                    vm.transactionActions.action_type.push('Transaction');
                    vm.transactionActions.transaction_class.push(action.transaction.transaction_class_object.name);
                    vm.transactionActions.portfolio.push(action.transaction.portfolio_object.name);
                    vm.transactionActions.instrument.push(action.transaction.instrument_object.name);
                }

            });


            $scope.$apply();
        })

    }

}());