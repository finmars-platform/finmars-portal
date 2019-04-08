/**
 * Created by szhitenev on 14.03.2018.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var metaService = require('../../services/metaService');
    var metaContentTypesService = require('../../services/metaContentTypesService');
    var entitySchemeService = require('../../services/import/entitySchemeService');

    var importEntityService = require('../../services/import/importEntityService');


    module.exports = function ($scope, $mdDialog) {

        logService.controller('ImportEntityDialogControllers', 'initialized');

        var vm = this;

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
            error_handler: 'break'
        };

        vm.loadIsAvailable = function () {
            if (vm.config.scheme != null && vm.config.file !== null && vm.config.file !== undefined) {
                return true;
            }
            return false;
        };

        vm.contentTypes = metaContentTypesService.getListForSimleEntityImport();

        vm.getSchemeList = function () {
            entitySchemeService.getEntitiesSchemesList(vm.activeContentType).then(function (data) {
                vm.entitySchemes = data.results;
                vm.readyStatus.mapping = true;
                $scope.$apply();
            });
        };

        vm.getSchemeList();

        vm.updateEntitySchemes = function () {
            vm.getSchemeList();
        };

        vm.findError = function (item, type, state) {

            var message = '';
            var haveError = false;

            if (type == 'entityAttr') {
                if (vm.config.errors.hasOwnProperty(item)) {
                    message = vm.config.errors[item].join(' ');
                    haveError = true;
                }
            }

            if (type == 'dynAttr') {
                //console.log('item', item);
                if (vm.config.errors.hasOwnProperty('attribute_type_' + item.attribute_type)) {
                    message = vm.config.errors['attribute_type_' + item.attribute_type].join(' ');
                    haveError = true;
                }
            }

            if (state == 'message') {
                return message
            } else {
                return haveError;
            }
        };

        vm.validate = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);
            formData.append('error_handler', vm.config.error_handler);
            formData.append('delimiter', vm.config.delimiter);

            console.log('vm.config', vm.config);

            importEntityService.validateImport(formData).then(function (data) {

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                if (data.errors.length === 0) {

                    vm.load()

                } else {

                    data.process_mode = 'validate';

                    $mdDialog.show({
                        controller: 'SimpleEntityImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/simple-entity-import-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: data
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {
                            vm.load();
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

            console.log('vm.config', vm.config);

            importEntityService.startImport(formData).then(function (data) {

                vm.readyStatus.processing = false;
                vm.dataIsImported = true;

                if (data.errors.length === 0) {

                    $mdDialog.hide();

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
                                title: "",
                                description: "You have successfully imported csv file"
                            }
                        }

                    });

                } else {

                    $mdDialog.show({
                        controller: 'SimpleEntityImportErrorsDialogController as vm',
                        templateUrl: 'views/dialogs/simple-entity-import-errors-dialog-view.html',
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            data: data
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

        vm.createScheme = function ($event) {

            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeCreateDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import-scheme-create-dialog-view.html',
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

        vm.openEditMapping = function ($event) {
            $mdDialog.show({
                controller: 'SimpleEntityImportSchemeEditDialogController as vm',
                templateUrl: 'views/dialogs/simple-entity-import-scheme-edit-dialog-view.html',
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