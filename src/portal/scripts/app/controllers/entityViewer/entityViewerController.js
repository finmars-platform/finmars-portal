/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var evHelperService = require('../../services/entityViewerHelperService');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');
        var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $state, $transitions) {

            var vm = this;

            var setEventListeners = function () {

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    evDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                    evDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = vm.entityViewerDataService.getActiveObject();
                    var action = vm.entityViewerDataService.getActiveObjectAction();
                    var entitytype = vm.entityViewerDataService.getEntityType();

                    if (action === 'delete' && activeObject.id) {

                        $mdDialog.show({
                            controller: 'EntityViewerDeleteDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            //clickOutsideToClose: false,
                            locals: {
                                entity: {
                                    id: activeObject.id,
                                    name: activeObject.name
                                },
                                entityType: vm.entityViewerDataService.getEntityType()
                            }
                        }).then(function (res) {

                            vm.entityViewerDataService.setActiveObjectAction(null);

                            if (res.status === 'agree') {

                                var objects = vm.entityViewerDataService.getObjects();

                                objects.forEach(function (obj) {

                                    if (res.data.id === obj.id) {

                                        var parent = vm.entityViewerDataService.getData(obj.___parentId)

                                        parent.results = parent.results.filter(function (resultItem) {
                                            return resultItem.id !== res.data.id
                                        });

                                        vm.entityViewerDataService.setData(parent)

                                    }

                                });

                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                            }
                        })


                    }

                    if (action === 'edit' && activeObject.id) {

                        if (entitytype === 'transaction-type') {

                            $mdDialog.show({
                                controller: 'TransactionTypeEditDialogController as vm',
                                templateUrl: 'views/entity-viewer/transaction-type-edit-dialog-view.html',
                                parent: angular.element(document.body),
                                targetEvent: activeObject.event,
                                //clickOutsideToClose: false,
                                locals: {
                                    entityType: entitytype,
                                    entityId: activeObject.id
                                }
                            }).then(function (res) {

                                vm.entityViewerDataService.setActiveObjectAction(null);

                                if (res && res.res === 'agree') {

                                    console.log('res', res);

                                    var objects = vm.entityViewerDataService.getObjects();

                                    objects.forEach(function (obj) {

                                        if (res.data.id === obj.id) {

                                            Object.keys(res.data).forEach(function (key) {

                                                obj[key] = res.data[key]

                                            });

                                            vm.entityViewerDataService.setObject(obj);

                                        }

                                    });

                                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                }
                            });

                        } else {

                            if (entitytype === 'complex-transaction') {

                                $mdDialog.show({
                                    controller: 'ComplexTransactionEditDialogController as vm',
                                    templateUrl: 'views/entity-viewer/complex-transaction-edit-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: activeObject.event,
                                    //clickOutsideToClose: false,
                                    locals: {
                                        entityType: entitytype,
                                        entityId: activeObject.id
                                    }
                                }).then(function (res) {

                                    vm.entityViewerDataService.setActiveObjectAction(null);

                                    if (res && res.res === 'agree') {



                                        var objects = vm.entityViewerDataService.getObjects();

                                        objects.forEach(function (obj) {

                                            if (res.data.complex_transaction.id === obj.id) {

                                                Object.keys(res.data.complex_transaction).forEach(function (key) {

                                                    obj[key] = res.data.complex_transaction[key]

                                                });

                                                vm.entityViewerDataService.setObject(obj);

                                            }

                                        });

                                        vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                                    }
                                });

                            } else {

                                $mdDialog.show({
                                    controller: 'EntityViewerEditDialogController as vm',
                                    templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: activeObject.event,
                                    //clickOutsideToClose: false,
                                    locals: {
                                        entityType: entitytype,
                                        entityId: activeObject.id
                                    }
                                }).then(function (res) {

                                    vm.entityViewerDataService.setActiveObjectAction(null);

                                    if (res && res.res === 'agree') {

                                        var objects = vm.entityViewerDataService.getObjects();

                                        objects.forEach(function (obj) {

                                            if (res.data.id === obj.id) {

                                                Object.keys(res.data).forEach(function (key) {

                                                    obj[key] = res.data[key]

                                                });

                                                vm.entityViewerDataService.setObject(obj);

                                            }

                                        });

                                        vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    }
                                });

                            }

                        }

                    }
                });

            };

            vm.getView = function () {

                middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.listViewIsReady = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();

                vm.entityType = $scope.$parent.vm.entityType;
                vm.contentType = $scope.$parent.vm.contentType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setContentType($scope.$parent.vm.contentType);

                vm.entityViewerDataService.setRootEntityViewer(true);

                setEventListeners();

                uiService.getActiveListLayout(vm.entityType).then(function (activeLayoutData) {

                    if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results.length > 0) {

                        var activeLayout = activeLayoutData.results[0];
                        activeLayout.is_active = false;

                        uiService.updateListLayout(activeLayout.id, activeLayout);

                        vm.entityViewerDataService.setLayoutCurrentConfiguration(activeLayout, uiService, false);
                        vm.listViewIsReady = true;
                        console.log('vm', vm);
                        evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                        $scope.$apply();
                        vm.entityViewerDataService.setActiveLayoutConfiguration();

                    } else {

                        uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                            var defaultLayout = null;
                            if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {
                                defaultLayout = defaultLayoutData.results[0];
                            }

                            vm.entityViewerDataService.setLayoutCurrentConfiguration(defaultLayout, uiService, false);
                            vm.listViewIsReady = true;
                            console.log('vm', vm);
                            evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                            $scope.$apply();
                            vm.entityViewerDataService.setActiveLayoutConfiguration();

                        });

                    }

                });

            };

            vm.init = function () {

                /*vm.entityType = $scope.$parent.vm.entityType;
                vm.contentType = $scope.$parent.vm.contentType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setContentType($scope.$parent.vm.contentType);*/

                // setEventListener();

                vm.getView();

                // entityViewerReducer.initReducer(vm.entityViewerDataService, vm.entityViewerEventService, $mdDialog, vm.getView);

            };

            vm.init();

            var listOfStatesWithLayout = [
                'app.data.portfolio',
                'app.data.account',
                'app.data.account-type',
                'app.data.counterparty',
                'app.data.responsible',
                'app.data.instrument',
                'app.data.instrument-type',
                'app.data.pricing-policy',
                'app.data.complex-transaction',
                'app.data.transaction',
                'app.data.transaction-type',
                'app.data.currency-history',
                'app.data.price-history',
                'app.data.currency',
                'app.data.strategy-group',
                'app.data.strategy'
            ];

            vm.stateWithLayout = false;

            if (listOfStatesWithLayout.indexOf($state.current.name) !== -1) {
                vm.stateWithLayout = true;
            }

            var checkLayoutForChanges = function () {

                return new Promise(function (resolve, reject) {

                    var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                    var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false)) {

                        $mdDialog.show({
                            controller: 'LayoutChangesLossWarningDialogController as vm',
                            templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                            parent: angular.element(document.body),
                            preserveScope: true,
                            autoWrap: true,
                            multiple: true,
                            locals: {
                                data: {
                                    evDataService: vm.entityViewerDataService,
                                    entityType: vm.entityType
                                }
                            }
                        }).then(function (res, rej) {

                            if (res.status === 'save_layout') {

                                if (layoutCurrentConfig.hasOwnProperty('id')) {

                                    uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                        resolve(true);
                                    });

                                } else {

                                    if (res.data && res.data.layoutName) {
                                        layoutCurrentConfig.name = res.data.layoutName;
                                    }

                                    uiService.getDefaultListLayout(vm.entityType).then(function (data) {

                                        layoutCurrentConfig.is_default = true;

                                        if (data.count > 0 && data.results) {
                                            var activeLayout = data.results[0];
                                            activeLayout.is_default = false;

                                            uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                                uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                    resolve(true);
                                                });

                                            });

                                        } else {
                                            uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                resolve(true);
                                            });
                                        }

                                    });

                                }

                            } else if (res.status === 'do_not_save_layout') {

                                resolve(true);

                            } else {

                                reject(false);

                            }

                        }).catch(function () {
                            reject(false);
                        });

                    } else {
                        resolve(true);
                    };

                });

            };

            var deregisterOnBeforeTransitionHook = $transitions.onBefore({}, checkLayoutForChanges);

            var doOnMasterUserSelect = function () {
                deregisterOnBeforeTransitionHook();
                return checkLayoutForChanges();
            };

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false)) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }

            };

            if (vm.stateWithLayout) {

                middlewareService.setWarningOnLayoutChangeFn(doOnMasterUserSelect);

                window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);
            }

            this.$onDestroy = function () {

                if (vm.stateWithLayout) {
                    deregisterOnBeforeTransitionHook();
                }

                window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);
                middlewareService.setWarningOnLayoutChangeFn(false);
            }
        }

    }()
);