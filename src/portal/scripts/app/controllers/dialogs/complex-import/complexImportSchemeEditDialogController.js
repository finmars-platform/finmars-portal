/**
 * Created by szhitenev on 19.03.2018.
 */

/**
 * Simple Entity Import Edit Dialog Controller.
 * @module SimpleEntityImportEitDialogController
 */

(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');
    var complexImportSchemeService = require('../../../services/import/complexImportSchemeService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var transactionSchemeService = require('../../../services/import/transactionSchemeService');

    module.exports = function ($scope, $mdDialog, schemeId) {

        logService.controller('EntityMappingEditDialogController', 'initialized');

        /** JSDOC ignores vm methods, only works for var variable. */
        var vm = this;
        vm.scheme = {};
        vm.readyStatus = {
            scheme: false,
            csvImportSchemes: false,
            transactionImportSchemes: false
        };

        vm.checkReadyStatus = function () {
            return vm.readyStatus.csvImportSchemes && vm.readyStatus.transactionImportSchemes && vm.readyStatus.scheme;
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

        vm.getScheme = function () {

            complexImportSchemeService.getByKey(schemeId).then(function (data) {

                vm.scheme = data;
                vm.readyStatus.scheme = true;
                $scope.$apply();

            });

        };

        vm.addSimpleEntityImportAction = function () {

            console.log('here?');

            vm.scheme.actions.push({
                action_notes: '',
                csv_import_scheme: {}
            });

            console.log('vm.scheme.actions', vm.scheme.actions);
        };

        vm.addTransactionImportAction = function () {
            vm.scheme.actions.push({
                action_notes: '',
                complex_transaction_import_scheme: {}

            })
        };

        vm.getTransactionImportSchemes = function () {

            transactionSchemeService.getList().then(function (data) {

                vm.transactionImportSchemes = data.results;
                vm.readyStatus.transactionImportSchemes = true;
                $scope.$apply();

            })

        };

        vm.getCsvImportSchemes = function () {

            csvImportSchemeService.getList().then(function (data) {

                vm.csvImportSchemes = data.results;
                vm.readyStatus.csvImportSchemes = true;
                $scope.$apply();

            })

        };

        vm.cancel = function () {
            $mdDialog.hide();
        };

        vm.agree = function ($event) {

            complexImportSchemeService.update(vm.scheme.id, vm.scheme).then(function (data) {

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    locals: {
                        validationData: reason.message
                    },
                    multiple: true,
                    preserveScope: true,
                    autoWrap: true,
                    skipHide: true
                })

            })
        };

        vm.makeCopy = function ($event) {

            var scheme = JSON.parse(JSON.stringify(vm.scheme));

            delete scheme.id;
            scheme["scheme_name"] = scheme["scheme_name"] + '_copy';

            $mdDialog.show({
                controller: 'ComplexImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/complex-import/complex-import-scheme-create-dialog-view.html',
                parent: angular.element(document.body),
                targetEvent: $event,
                locals: {
                    data: {
                        scheme: scheme
                    }
                }
            });

            $mdDialog.hide({status: 'disagree'});

        };

        vm.init = function () {
            vm.getScheme();
            vm.getTransactionImportSchemes();
            vm.getCsvImportSchemes();
        };

        vm.init();


    };

}());