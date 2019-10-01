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
        var SplitPanelExchangeService = require('../../services/groupTable/exchangeWithSplitPanelService');
        var AttributeDataService = require('../../services/attributeDataService');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');
        var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $state, $transitions) {

            var vm = this;

            var doNotCheckLayoutChanges = false;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

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
                            controller: 'EntityViewerDeleteBulkDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-bulk-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            //clickOutsideToClose: false,
                            locals: {
                                evDataService: vm.entityViewerDataService,
                                evEventService: vm.entityViewerEventService
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

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.splitPanelExchangeService = new SplitPanelExchangeService();
                vm.attributeDataService = new AttributeDataService();

                vm.entityType = $scope.$parent.vm.entityType;
                vm.contentType = $scope.$parent.vm.contentType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setContentType($scope.$parent.vm.contentType);

                vm.downloadAttributes();

                vm.entityViewerDataService.setRootEntityViewer(true);

                setEventListeners();

                uiService.getActiveListLayout(vm.entityType).then(function (activeLayoutData) {

                    if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results.length > 0) {

                        var activeLayout = activeLayoutData.results[0];
                        activeLayout.is_active = false;

                        uiService.updateListLayout(activeLayout.id, activeLayout);

                        vm.entityViewerDataService.setLayoutCurrentConfiguration(activeLayout, uiService, false);
                        vm.readyStatus.layout = true;
                        console.log('vm', vm);
                        evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                        $scope.$apply();
                        //vm.entityViewerDataService.setActiveLayoutConfiguration();

                    } else {

                        uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                            var defaultLayout = null;
                            if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {
                                defaultLayout = defaultLayoutData.results[0];
                            }

                            vm.entityViewerDataService.setLayoutCurrentConfiguration(defaultLayout, uiService, false);
                            vm.readyStatus.layout = true;
                            console.log('vm', vm);
                            evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);
                            $scope.$apply();
                            //vm.entityViewerDataService.setActiveLayoutConfiguration();

                        });

                    }

                });

            };

            vm.downloadAttributes = function () {

                var promises = [];

                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType(vm.entityType));

                if (vm.entityType === 'instrument') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                }

                if (vm.entityType === 'complex-transaction') {
                    promises.push(vm.attributeDataService.downloadTransactionUserFields());
                }

                if (vm.entityType === 'transaction-type') {
                    promises.push(vm.attributeDataService.downloadTransactionUserFields());
                }

                Promise.all(promises).then(function (data) {

                    vm.readyStatus.attributes = true;
                    $scope.$apply();

                })

            };

            vm.init = function () {

                middlewareService.onMasterUserChanged(function () {

                    doNotCheckLayoutChanges = true;
                    removeTransitionWatcher();

                });

                middlewareService.onLogOut(function () {

                    doNotCheckLayoutChanges = true;
                    removeTransitionWatcher();

                });

                vm.getView();


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

                    if (!doNotCheckLayoutChanges) {

                        var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                        var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                        var spChangedLayout = false;
                        var additions = vm.entityViewerDataService.getAdditions();
                        if (additions.isOpen) {
                            spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                        }
                        ;

                        var layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false);

                        if (!layoutIsUnchanged || spChangedLayout) {

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

                                    var layoutsSavePromises = [];

                                    // if split panel layout changed, save it
                                    if (spChangedLayout) {

                                        var saveSPLayoutChanges = new Promise(function (spLayoutSaveRes, spLayoutSaveRej) {

                                            if (spChangedLayout.hasOwnProperty('id')) {
                                                uiService.updateListLayout(spChangedLayout.id, spChangedLayout).then(function () {
                                                    spLayoutSaveRes(true);
                                                });
                                            } else {
                                                uiService.createListLayout(vm.entityType, spChangedLayout).then(function () {
                                                    spLayoutSaveRes(true);
                                                });
                                            }

                                        });

                                        layoutsSavePromises.push(saveSPLayoutChanges);

                                    }
                                    ;
                                    // < if split panel layout changed, save it >

                                    if (!layoutIsUnchanged) {

                                        var saveLayoutChanges = new Promise(function (saveLayoutRes, saveLayoutRej) {

                                            if (layoutCurrentConfig.hasOwnProperty('id')) {

                                                uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                                    saveLayoutRes(true);
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
                                                                saveLayoutRes(true);
                                                            });

                                                        });

                                                    } else {
                                                        uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                                            saveLayoutRes(true);
                                                        });
                                                    }

                                                });

                                            }
                                            ;

                                            layoutsSavePromises.push(saveLayoutChanges);

                                        });
                                    }
                                    ;

                                    Promise.all(layoutsSavePromises).then(function () {
                                        resolve(true);
                                    });

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
                        }

                    } else {
                        removeTransitionWatcher();
                        resolve(true);
                    }
                    ;

                });

            };

            var deregisterOnBeforeTransitionHook = $transitions.onBefore({}, checkLayoutForChanges);

            /*var doOnMasterUserSelect = function () {
                deregisterOnBeforeTransitionHook();
                return checkLayoutForChanges();
            };*/

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                var layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false);

                var spChangedLayout = false;
                var additions = vm.entityViewerDataService.getAdditions();
                if (additions.isOpen) {
                    spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                }
                ;

                if (!layoutIsUnchanged || spChangedLayout) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }
                ;

            };

            var removeTransitionWatcher = function () {

                if (vm.stateWithLayout) {
                    deregisterOnBeforeTransitionHook();
                }

                window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);
            };

            if (vm.stateWithLayout) {

                window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);
            }

            this.$onDestroy = function () {
                removeTransitionWatcher();
            }
        }

    }()
);