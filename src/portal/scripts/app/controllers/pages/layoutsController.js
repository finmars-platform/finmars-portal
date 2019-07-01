/**
 * Created by mevstratov on 25.06.2019.
 */
(function () {

    'use strict';

    module.exports = function ($scope, $mdDialog) {

        var vm = this;

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
            },
            {
                name: 'Transaction Types',
                entityType: 'transaction-type'
            }
        ];

        vm.openLayoutsList = function ($event, entityType) {

            $mdDialog.show({
                controller: 'LayoutsListDialogController as vm',
                templateUrl: 'views/dialogs/layouts-list-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        entityType: entityType
                    }
                }
            });
        }

    };

}());