/**
 * Created by mevstratov on 25.06.2019.
 */
(function () {

    'use strict';

    var transactionTypeService = require('../../services/transactionTypeService');

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

        vm.entitiesFolded = false;
        vm.transactionTypesFolded = false;
        vm.readyStatus = {transactionType: false};

        vm.entities = [
            {
                name: 'Portfolio',
                entityType: 'portfolio'
            },
            {
                name: 'Accounts',
                entityType: 'account'
            },
            {
                name: 'Instruments',
                entityType: 'instrument'
            },
            {
                name: 'Responsible',
                entityType: 'responsible'
            },
            {
                name: 'Counterparties',
                entityType: 'counterparty'
            },
            {
                name: 'Currencies',
                entityType: 'currency'
            },
            {
                name: 'Strategy 1',
                entityType: 'strategy-1'
            },
            {
                name: 'Strategy 2',
                entityType: 'strategy-2'
            },
            {
                name: 'Strategy 3',
                entityType: 'strategy-3'
            },
            {
                name: 'Instrument Types',
                entityType: 'instrument-type'
            },
            {
                name: 'Account Type',
                entityType: 'account-type'
            }
        ];

        vm.openFormEditor = function ($event, entityType, id) {

            var data = {
                entityType: entityType,
                fromEntityType: '',
                hideManageAttributesButton: true
            };

            if (id) {
                data.instanceId = id;
            }
            console.log("forms openFOrmEditor", data, id);
            $mdDialog.show({
                controller: 'EntityDataConstructorDialogController as vm',
                templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                locals: {
                    data: data
                }
            });
        };

        transactionTypeService.getList({pageSize: 1000}).then(function (data) {
            console.log("forms transactionType", data);
            vm.transactionTypes = data.results;
            vm.readyStatus.transactionType = true;
            $scope.$apply();
        });

    }

}());