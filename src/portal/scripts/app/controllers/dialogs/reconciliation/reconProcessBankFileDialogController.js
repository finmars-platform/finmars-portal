/**
 * Created by szhitenev on 10.12.2019.
 */
(function () {

    'use strict';

    var transactionSchemeService = require('../../../services/import/transactionSchemeService');
    var reconciliationProcessFileService = require('../../../services/reconciliation/reconciliationProcessFileService');

    module.exports = function ($scope, $mdDialog, data) {

        var vm = this;

        vm.data = data;

        vm.config = {
            delimiter: ',',
            mode: 1,
            missing_data_handler: 'throw_error',
            error_handling: 'break'
        };

        vm.readyStatus = {
            schemes: false,
            processing: false
        };

        vm.loadIsAvailable = function () {
            return !vm.readyStatus.processing && vm.config.scheme;
        };

        vm.schemes = [];

        vm.checkExtension = function (file, extension, $event) {
            console.log('file', file);

            if (file) {

                var ext = file.name.split('.')[1]

                if (ext !== extension) {

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "Warning!",
                                description: 'You are trying to load incorrect file'
                            }
                        },
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    }).then(function () {

                        vm.config.file = null;

                    });

                }

            }

        };

        vm.getSchemes = function () {

            transactionSchemeService.getList().then(function (data) {
                vm.schemes = data.results;
                vm.readyStatus.schemes = true;
                $scope.$apply();
            });

        };

        vm.editScheme = function ($event) {
            $mdDialog.show({
                controller: 'TransactionImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/transaction-import/transaction-import-scheme-dialog-view.html',
                locals: {
                    schemeId: vm.config.scheme
                },
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true
            }).then(function (res) {
                if (res && res.status === 'agree') {
                    console.log('res', res.data);
                    transactionSchemeService.update(vm.config.scheme, res.data).then(function () {
                        //vm.getList();
                        $scope.$apply();
                    })
                }
            });
        };

        vm.process = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            if (vm.config.task_id) {
                formData.append('task_id', vm.config.task_id);
            } else {

                formData.append('file', vm.config.file);
                formData.append('scheme', vm.config.scheme);
                formData.append('error_handling', vm.config.error_handling);
                formData.append('delimiter', vm.config.delimiter);
                formData.append('missing_data_handler', vm.config.missing_data_handler);

                vm.fileLocal = vm.config.local;

            }

            reconciliationProcessFileService.process(formData).then(function (data) {

                vm.config = data;

                if (vm.config.task_status === 'SUCCESS') {

                    console.log('Processing is finished', data);

                    $mdDialog.hide({
                        status: 'agree', data: {
                            config: vm.config,
                            results: data.results
                        }
                    });

                } else {

                    setTimeout(function () {
                        vm.process($event);
                    }, 1000)

                }

            })

        };

        vm.cancel = function () {
            $mdDialog.hide({status: 'disagree'});
        };

        vm.init = function () {

            vm.getSchemes();

        };

        vm.init();
    }

}());