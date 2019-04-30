/**
 * Created by szhitenev on 14.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../../core/services/logService');

    var metaService = require('../../../services/metaService');
    var metaContentTypesService = require('../../../services/metaContentTypesService');
    var csvImportSchemeService = require('../../../services/import/csvImportSchemeService');

    var importEntityService = require('../../../services/import/importEntityService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('ImportEntityDialogControllers', 'initialized');

        var vm = this;

        vm.closeButtonText = "Cancel";

        vm.readyStatus = {
            mapping: false,
            processing: false,
            dailyModel: false,
            priceDownloadScheme: false,
            instrumentType: false,
            currency: false
        };
        vm.dataIsImported = false;
        vm.activeContentType = null;

        vm.config = {
            delimiter: ',',
            error_handler: 'break',
            mode: 'skip',
            missing_data_handler: 'throw_error'
        };

        vm.loadIsAvailable = function () {
            if (vm.config.scheme != null && vm.config.file !== null && vm.config.file !== undefined) {
                return true;
            }
            return false;
        };

        vm.contentTypes = metaContentTypesService.getListForSimleEntityImport();

        vm.getSchemeList = function () {

            var options = {filters: {'content_type': vm.activeContentType}};

            csvImportSchemeService.getList(options).then(function (data) {
                vm.entitySchemes = data.results;
                vm.readyStatus.mapping = true;
                $scope.$apply();
            });

        };

        vm.getSchemeList();

        vm.updateEntitySchemes = function () {
            vm.getSchemeList();
        };

        vm.validate = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);
            formData.append('error_handler', vm.config.error_handler);
            formData.append('delimiter', vm.config.delimiter);
            formData.append('mode', vm.config.mode);
            formData.append('missing_data_handler', vm.config.missing_data_handler);

            console.log('vm.config', vm.config);

            var schemeObject;

            vm.entitySchemes.forEach(function (scheme) {

                if (scheme.id == vm.config.scheme) {
                    schemeObject = scheme;
                }

            });

            importEntityService.validateImport(formData).then(function (data) {

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                if (data.errors.length === 0) {

                    vm.load();

                } else {

                    data.process_mode = 'validate';

                    $mdDialog.show({
                        controller: 'SimpleEntityImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: {
                                validationResult: data,
                                scheme: schemeObject,
                                config: vm.config
                            }
                        }
                    }).then(function (res) {

                        if (res && res.status === 'agree') {
                            vm.load();
                        } else {
                            vm.closeButtonText = "Cancel";
                        }

                    })

                }


            }).catch(function (reason) {

                vm.readyStatus.processing = false;

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        validationData: {
                            message: "An error occurred. Please try again later"
                        }
                    }
                });

                $scope.$apply();

            })
        };

        vm.load = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);
            formData.append('error_handler', vm.config.error_handler);
            formData.append('delimiter', vm.config.delimiter);
            formData.append('mode', vm.config.mode);
            formData.append('missing_data_handler', vm.config.missing_data_handler);

            console.log('vm.config', vm.config);

            importEntityService.startImport(formData).then(function (data) {

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                if (data.errors.length === 0) {

                    $mdDialog.hide();

                    var description = '';

                    description = '<div>' +
                        '<div>Rows total: ' + data.total + '</div>' +
                        '<div>Rows success import: ' + (data.total - data.errors.length) + '</div>' +
                        '<div>Rows fail import: ' + data.errors.length + '</div>' +
                        '</div><br/>';

                    console.log('description', description);

                    description = description + '<div> You have successfully imported csv file </div>';

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            success: {
                                title: "Success",
                                description: description
                            }
                        }

                    });

                    vm.closeButtonText = "OK";

                } else {

                    $mdDialog.show({
                        controller: 'SimpleEntityImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: data
                        }
                    });

                    vm.closeButtonText = "Cancel";

                }


            }).catch(function (reason) {

                console.log('here? ', reason);

                vm.readyStatus.processing = false;

                $mdDialog.show({
                    controller: 'ValidationDialogController as vm',
                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                    targetEvent: $event,
                    preserveScope: true,
                    multiple: true,
                    autoWrap: true,
                    skipHide: true,
                    locals: {
                        validationData: {
                            message: "An error occurred. Please try again later"
                        }
                    }
                });

                $scope.$apply();

            })
        };

        vm.createScheme = function ($event) {

            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-create-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            }).then(function () {

                vm.getSchemeList();

            })

        };

        vm.editScheme = function ($event) {
            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import/simple-entity-import-scheme-edit-dialog-view.html',
                targetEvent: $event,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    schemeId: vm.config.scheme
                }
            })
        };

        vm.cancel = function () {
            $mdDialog.cancel();
        };

        vm.import = function () {

            vm.validate(); //TODO refactor later?

        }

    };

}());