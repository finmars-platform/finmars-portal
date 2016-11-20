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
        vm.evAction = 'update';
        vm.entityId = entityId;
        vm.saveCallback = ''; // save callback handler in inner controller;
        vm.copyCallback = ''; // copy callback handler in inner controller;

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

        vm.copy = function () {
            vm.copyCallback().then(function () {
                vm.evAction = 'create';
                $scope.$apply();
            }); // look at entityEditorController
        };

        vm.save = function ($event) {
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
                vm.saveCallback().then(function (options) {

                    entityResolverService.update(options.entityType, options.entityId, options.entity).then(function (data) {
                        console.log('DATA', data);
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

            }
        };

    }

}());