/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var entityResolverService = require('../../services/entityResolverService');

    var usersService = require('../../services/usersService');

    var uiService = require('../../services/uiService');

    var metaService = require('../../services/metaService');
    var layoutService = require('../../services/layoutService');

    var metaPermissionsService = require('../../services/metaPermissionsService');

    module.exports = function ($scope, $mdDialog, parentScope, $state) {

        logService.controller('EntityViewerAddDialogController', 'initialized');

        logService.property('parentScope', parentScope);

        var vm = this;
        vm.readyStatus = {content: false, entity: true, permissions: true};
        vm.entityType = parentScope.vm.entityType;
        vm.evAction = 'create';

        if (parentScope.vm.isEventBook) {
            vm.isEventBook = parentScope.vm.isEventBook;
            vm.eventBook = parentScope.vm.eventBook;
        }

        vm.entityTypeSlug = function () {

            console.log('here?');

            if (vm.entityType == 'complex-transaction') {
                return 'Transaction';
            }

            return vm.entityType.split('-').join(' ').capitalizeFirstLetter();
        };

        vm.cancel = function () {
            localStorage.setItem('entityIsChanged', false);
            $mdDialog.cancel();
        };

        vm.editLayout = function () {
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
        };

        vm.checkVisibility = function (btnName) {

            if (btnName == 'edit-form-btn' && vm.entityType == 'complex-transaction') {
                return false;
            }

            if (btnName == 'edit-form-btn' && vm.entityType == 'transaction-type') {
                return false;
            }

            return true;
        };

        vm.save = function ($event) {

            if (vm.isEventBook && vm.isEventBook == true) {

                vm.saveCallback().then(function (options) {
                    $mdDialog.hide({
                        status: 'agree', data: {
                            eventBook: options.entity
                        }
                    });
                });

            } else {
                vm.saveCallback().then(function (options) {

                    console.log('options.entityType', options);
                    console.log('vm', vm);

                    entityResolverService.create(options.entityType, options.entity).then(function (data) {
                        console.log('DATA', data);
                        if (data.status == 200 || data.status == 201) {

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
                                } else {

                                    $mdDialog.hide({res: 'agree'});
                                }
                            } else {

                                $mdDialog.hide({res: 'agree'});
                            }
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