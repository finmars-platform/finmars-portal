/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

        'use strict';

        var entityResolverService = require('../services/entityResolverService');

        var evEvents = require('../services/entityViewerEvents');

        module.exports = function ($scope, $state, $mdDialog) {

            var vm = this;

            vm.readyStatus = {content: false};
            vm.entityType = $scope.$parent.evDataService.getEntityType();
            vm.entity = {attributes: []};
            vm.entityId = '';
            vm.evAction = 'update';

            vm.entityId = $scope.evDataService.getEditorEntityId();

            console.log('vm.entityId', vm.entityId);

            if (vm.entityId !== undefined) {
                vm.evAction = 'update';
                vm.readyStatus.entityId = true;
            }

            console.log('$scope.$parent.evEventService', $scope.$parent.evEventService);

            $scope.$parent.evEventService.addEventListener(evEvents.ADDITIONS_EDITOR_ENTITY_ID_CHANGE, function () {

                // console.log('ADDITIONS_EDITOR_ENTITY_ID_CHANGE', vm.entityId);

                vm.readyStatus.entityId = false;
                vm.entityId = undefined;
                $scope.$apply();

                setTimeout(function () {

                    vm.entityId = $scope.$parent.evDataService.getEditorEntityId();

                    // console.log('entityId', vm.entityId);

                    if (vm.entityId !== undefined) {
                        vm.evAction = 'update';
                        vm.readyStatus.entityId = true;
                    }

                    $scope.$apply();

                    // console.log('HEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEREEEEEEEEEEEEEEEEEEEEE??');

                }, 100)

            });

            vm.readyStatus.entityId = false;

            vm.cancel = function () {
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

                if (vm.evAction == 'create') {
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