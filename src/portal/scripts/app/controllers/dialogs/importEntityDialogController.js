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

        vm.config = {
            error_handler: 'break'
        };

        vm.loadIsAvailable = function () {
            if (vm.config.scheme != null) {
                return true;
            }
            return false;
        };

        metaContentTypesService.findEntityByAPIContentType().then(function (data) {
            vm.listOfEntities = data;
            $scope.$apply();
        });

        vm.getSchemeList = function () {
            entitySchemeService.getEntitiesSchemesList().then(function (data) {
                vm.entitySchemes = data.results;
                vm.readyStatus.mapping = true;
                $scope.$apply();
            });
        };

        vm.getSchemeList();

        vm.updateEntitySchemes = function () {
            entitySchemeService.getEntitySchemesByModel(vm.config.entity).then(function (data) {
                vm.entitySchemes = data.results;
                $scope.$apply();
            });
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

        vm.load = function ($event) {

            vm.readyStatus.processing = true;

            var formData = new FormData();

            formData.append('file', vm.config.file);
            formData.append('scheme', vm.config.scheme);
            formData.append('error_handler', vm.config.error_handler);

            console.log('vm.config', vm.config);

            importEntityService.startImport(formData).then(function (data) {

                console.log('data', data);

                if (data.status !== 500 && data.status !== 400) {

                    vm.readyStatus.processing = false;
                    vm.dataIsImported = true;

                    $mdDialog.show({
                        controller: 'SuccessDialogController as vm',
                        templateUrl: 'views/dialogs/success-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            success: {
                                title: "",
                                description: "You have successfully imported csv file"
                            }
                        },
                        multiple: true,
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    });

                }


                if (data.status === 500 || data.status === 400) {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        targetEvent: $event,
                        locals: {
                            validationData: "An error occurred. Please try again later"
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }

            })
        };

        vm.createScheme = function ($event) {

            $mdDialog.show({
                controller: 'EntityMappingCreateDialogController as vm',
                templateUrl: 'views/dialogs/entity-mapping-create-dialog-view.html',
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
                controller: 'EntityMappingEditDialogController as vm',
                templateUrl: 'views/dialogs/entity-mapping-edit-dialog-view.html',
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

    };

}());