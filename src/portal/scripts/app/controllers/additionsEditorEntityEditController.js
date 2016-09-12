/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

        'use strict';

        var logService = require('../../../../core/services/logService');

        var attributeTypeService = require('../services/attributeTypeService');
        var entityResolverService = require('../services/entityResolverService');

        var uiService = require('../services/uiService');

        var gridHelperService = require('../services/gridHelperService');
        var metaService = require('../services/metaService');
        var layoutService = require('../services/layoutService');


        // codemonkey

        module.exports = function ($scope, $state, $mdDialog) {

            logService.controller('AdditionsEditorEntityEditController', 'initialized');

            //console.log('scope', $scope);

            var vm = this;

            vm.readyStatus = {content: false};
            vm.entityType = $scope.$parent.entityType;
            vm.entity = {attributes: []};
            vm.entityId = '';
            vm.evAction = 'update';

            vm.readyStatus.entityId = false;

            $scope.$parent.$watch('itemId', function (newItemId) {
                vm.readyStatus.entityId = false;
                setTimeout(function () {
                    vm.entityId = newItemId;
                    if (vm.entityId !== undefined) {
                        vm.evAction = 'update';
                        vm.readyStatus.entityId = true;
                    }
                    $scope.$apply();
                }, 100)

            });

            vm.cancel = function() {
                var entityId = vm.entityId;
                vm.entityId = undefined;
                vm.readyStatus.entityId = false;
                setTimeout(function () {
                    vm.entityId = entityId;
                    vm.readyStatus.entityId = true;
                    $scope.$apply();
                }, 100)
            };

            vm.editLayout = function () {
                $state.go('app.data-constructor', {entityType: vm.entityType});
            };

            vm.manageAttrs = function (ev) {
                $state.go('app.attributesManager', {entityType: vm.entityType});
            };

            vm.copy = function () {
                vm.copyCallback().then(function () {
                    vm.evAction = 'create';
                    $scope.$apply();
                }); // look at entityEditorController
            };

            vm.save = function () {

                if (vm.evAction = 'create') {
                    vm.saveCallback().then(function (options) {

                        entityResolverService.create(options.entityType, options.entity).then(function () {
                            vm.evAction = 'update';
                            $scope.$apply();
                        });

                    })
                } else {
                    vm.saveCallback().then(function (options) {

                        entityResolverService.update(options.entityType, options.entityId, options.entity).then(function () {
                            $scope.$apply();
                        });
                    })

                }

            }
        }

    }()
);