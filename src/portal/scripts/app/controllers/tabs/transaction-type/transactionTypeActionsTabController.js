/**
 * Created by szhitenev on 27.09.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    module.exports = function ($scope) {
        logService.controller('TransactionTypeActionsTabController', 'initialized');

        var vm = this;
        vm.entity = $scope.$parent.vm.entity;

        vm.entity.actions = [{
            action_notes: 'First action (instrument)',
            transaction: {}
        }, {
            action_notes: 'Second action (transaction))',
            instrument: {}
        }];

        vm.addAction = function (actionType) {
            if (actionType == 'instrument') {
                vm.entity.actions.push({
                    isExpanded: true,
                    instrument: {}
                })
            } else {
                vm.entity.actions.push({
                    isExpanded: true,
                    transaction: {}
                })
            }
        }
    }

}());