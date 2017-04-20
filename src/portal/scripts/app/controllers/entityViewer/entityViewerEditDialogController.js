/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';
    var logService = require('../../../../../core/services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var entityResolverService = require('../../services/entityResolverService');
    var entityViewerHelperService = require('../../services/entityViewerHelperService');

    var usersService = require('../../services/usersService');

    var uiService = require('../../services/uiService');

    var gridHelperService = require('../../services/gridHelperService');
    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    var metaPermissionsService = require('../../services/metaPermissionsService');

    module.exports = function ($scope, $mdDialog, parentScope, entityId, $state) {

        logService.controller('EntityViewerEditDialogController', 'initialized');

        var vm = this;

        //vm.readyStatus = {content: false, permissions: false, entity: false, me: false};
        vm.entityType = parentScope.entityType;
        console.log('entity edit dialog', parentScope);
        vm.evAction = 'update';
        vm.entityId = entityId;
        vm.saveCallback = ''; // save callback handler in inner controller;
        vm.copyCallback = ''; // copy callback handler in inner controller;

        vm.entityTypeSlug = function () {

            if (vm.entityType == 'complex-transaction') {
                return 'Transaction';
            }

            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            //localStorage.setItem('entityIsChanged', false);
            $mdDialog.cancel();
        };

        vm.editLayout = function (ev) {
            $state.go('app.data-constructor', {entityType: vm.entityType});
            $mdDialog.hide();
        };

        vm.manageAttrs = function (ev) {
            $state.go('app.attributesManager', {entityType: vm.entityType});
            $mdDialog.hide();
        };

        vm.MABtnVisibility = function (entityType) {
            //console.log('custom entity type', entityType);
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        }

        vm.copy = function () {
            vm.copyCallback().then(function () {
                vm.evAction = 'create';
                $scope.$apply();
            }); // look at entityEditorController
        };

        vm.checkVisibility = function () {
            return true;
        };

        vm.save = function ($event, options) {
            if (vm.evAction == 'create') {
                vm.saveCallback().then(function (options) {

                    entityResolverService.create(options.entityType, options.entity).then(function (data) {
                        //console.log('DATA', data);
                        if (data.status == 200 || data.status == 201) {
                            $mdDialog.hide({res: 'agree'});
                        }
                        if (data.status == 400) {
                            $mdDialog.show({
                                controller: 'ValidationDialogController as vm',
                                templateUrl: 'views/dialogs/validation-dialog-view.html',
                                targetEvent: $event,
                                locals: {
                                    validationData: data.response
                                },
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true
                            })
                        }
                    });

                })
            } else {
                vm.saveCallback(options).then(function (options) {

                    var entityType = options.entityType;

                    if (options.entityType == 'complex-transaction') {
                        if (options.complexTransactionChangeStatus == false) {
                            entityType = 'complex-transaction-default'
                        }
                    }

                    entityResolverService.update(entityType, options.entityId, options.entity).then(function (data) {
                        console.log('DATA', data);
                        if (options.entityType == 'complex-transaction') {
                            if (data.response.hasOwnProperty('has_errors') && data.response.has_errors == true) {
                                $mdDialog.show({
                                    controller: 'ValidationDialogController as vm',
                                    templateUrl: 'views/dialogs/validation-dialog-view.html',
                                    targetEvent: $event,
                                    locals: {
                                        validationData: {
                                            complex_transaction_errors: data.response.complex_transaction_errors,
                                            instruments_errors: data.response.instruments_errors,
                                            transactions_errors: data.response.transactions_errors
                                        }
                                    },
                                    preserveScope: true,
                                    autoWrap: true,
                                    skipHide: true
                                })
                            }
                            else {

                                $mdDialog.hide({res: 'agree'});
                            }
                        } else {

                            $mdDialog.hide({res: 'agree'});
                        }
                        if (data.status == 400) {
                            $mdDialog.show({
                                controller: 'ValidationDialogController as vm',
                                templateUrl: 'views/dialogs/validation-dialog-view.html',
                                targetEvent: $event,
                                locals: {
                                    validationData: data.response
                                },
                                preserveScope: true,
                                autoWrap: true,
                                skipHide: true
                            })
                        }
                    });
                })

            }
        };

    }

}());