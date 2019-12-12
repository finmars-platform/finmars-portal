/**
 * Created by szhitenev on 11.12.2019.
 */
(function(){

    'use strict';

    var reconciliationBankFieldService = require('../../../services/reconciliation/reconciliationBankFieldService');
    var reconciliationComplexTransactionFieldService = require('../../../services/reconciliation/reconciliationComplexTransactionFieldService');

    module.exports = function($scope, $mdDialog, data){

        var vm = this;

        vm.parentEntityViewerDataService = data.parentEntityViewerDataService;
        vm.entityViewerDataService = data.entityViewerDataService;

        vm.bankFieldStatuses = [
            {
                name: 'Conflicts',
                id: 2
            },
            {
                name: 'Resolved Conflicts',
                id: 3
            },
            {
                name: 'Matched',
                id: 1
            }
        ];

        vm.complexTransactionFieldStatus = [
            {
                name: 'Matched',
                id: 1
            },
            {
                name: 'Unmatched',
                id: 2
            }
        ];

        vm.complexTransactionStatusChange = function($event, field) {

            console.log('vm.complexTransactionStatusChange.field', field);

            field.processing = true;

            reconciliationComplexTransactionFieldService.update(field.id, field).then(function (data) {

                console.log('complex transaction field updated', data);

                field.processing = false;

                $scope.$apply();

            })

        };

        vm.bankFieldStatusChange = function($event, field) {

            console.log('vm.bankFieldStatusChange.field', field);

            field.processing = true;

            if (field.type === 'new') {

                delete field.id;

                reconciliationBankFieldService.create(field).then(function (data) {

                    console.log('bank field created', data);

                    field.processing = false;

                    field = data

                    $scope.$apply();

                })
            } else {

                reconciliationBankFieldService.update(field.id, field).then(function (data) {

                    console.log('bank field updated', data);

                    field.processing = false;

                    $scope.$apply();

                })
            }


        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.agree = function () {
            $mdDialog.hide({status: 'agree'});
        };

        vm.init = function () {

            console.log("vm", vm);

            var parentFlatList = vm.parentEntityViewerDataService.getFlatList();

            var flatList = vm.entityViewerDataService.getFlatList();

            console.log('parentFlatList', parentFlatList);
            console.log('flatList', flatList);


            vm.complexTransactionList  = parentFlatList.filter(function (item) {
                return item.___is_activated
            });

            vm.bankLinesList = flatList.filter(function (item) {
                return item.___is_activated;
            });

            console.log('parentSelectedList', vm.complexTransactionList);
            console.log('selectedList', vm.bankLinesList);

        };

        vm.init();
    }

}());