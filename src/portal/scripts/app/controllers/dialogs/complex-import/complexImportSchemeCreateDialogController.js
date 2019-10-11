/**
 * Created by szhitenev on 19.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');
    var complexImportSchemeService = require('../../../services/import/complexImportSchemeService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');
    var transactionSchemeService = require('../../../services/import/transactionSchemeService');


    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var metaService = require('../../../services/metaService');
    var attributeTypeService = require('../../../services/attributeTypeService');

    var modelService = require('../../../services/modelService');

    module.exports = function ($scope, $mdDialog, data) {

        logService.controller('SimpleEntityImportCreateDialogController', 'initialized');

        var vm = this;

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
            $mdDialog.hide();
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

        vm.agree = function ($event) {

            complexImportSchemeService.create(vm.scheme).then(function (data) {

                $mdDialog.hide({status: 'agree'});

            }).catch(function (reason) {

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

            vm.getTransactionImportSchemes();
            vm.getCsvImportSchemes();

            if (data && data.hasOwnProperty('scheme')) {
                vm.scheme = data.scheme;
            }

        };

        vm.init();

    };

}());