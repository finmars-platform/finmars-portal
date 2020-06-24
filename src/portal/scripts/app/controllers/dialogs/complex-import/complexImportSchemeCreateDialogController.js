/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var complexImportSchemeService = require('../../../services/import/complexImportSchemeService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var transactionImportSchemeService = require('../../../services/import/transactionImportSchemeService');

    var toastNotificationService = require('../../../../../../core/services/toastNotificationService');


    module.exports = function complexImportSchemeCreateDialogController($scope, $mdDialog, data) {

        var vm = this;

        vm.processing = false;

        vm.scheme = {
            scheme_name: [],
            actions: []
        };

        vm.csvImportSchemes = [];
        vm.transactionImportSchemes = [];

        vm.readyStatus = {
            csvImportSchemes: false,
            transactionImportSchemes: false
        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.csvImportSchemes && vm.readyStatus.transactionImportSchemes;
        };

        vm.deleteAction = function (item, $index) {
            vm.scheme.actions.splice($index, 1);
        };

        vm.moveUp = function (item, $index) {

            var swap = JSON.parse(JSON.stringify(item));
            vm.scheme.actions[$index] = vm.scheme.actions[$index - 1];
            vm.scheme.actions[$index - 1] = swap;

        };

        vm.moveDown = function (item, $index) {

            var swap = JSON.parse(JSON.stringify(item));
            vm.scheme.actions[$index] = vm.scheme.actions[$index + 1];
            vm.scheme.actions[$index + 1] = swap;

        };

        vm.addSimpleEntityImportAction = function () {
            vm.scheme.actions.push({
                action_notes: '',
                csv_import_scheme: {}
            })
        };

        vm.addTransactionImportAction = function () {
            vm.scheme.actions.push({
                action_notes: '',
                complex_transaction_import_scheme: {}

            })
        };

        vm.getTransactionImportSchemesList = function () {

            transactionImportSchemeService.getListLight().then(function (data) {

                vm.transactionImportSchemes = data.results;
                vm.readyStatus.transactionImportSchemes = true;
                $scope.$apply();

            })

        };

        vm.getCsvImportSchemesList = function () {

            csvImportSchemeService.getListLight().then(function (data) {

                vm.csvImportSchemes = data.results;
                vm.readyStatus.csvImportSchemes = true;
                $scope.$apply();

            })

        };

        vm.agree = function ($event) {

            vm.processing = true;

            complexImportSchemeService.create(vm.scheme).then(function (data) {

                toastNotificationService.success("Complex Import Scheme " + vm.scheme.scheme_name + ' was successfully created');

                vm.processing = false;

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

                vm.processing = false;

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason.message
                    },
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        };

        vm.init = function () {

            vm.getTransactionImportSchemesList();
            vm.getCsvImportSchemesList();

            if (data && data.hasOwnProperty('scheme')) {
                vm.scheme = data.scheme;
            }

        };

        vm.init();

    };

}());