/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var metaContentTypesService = require('../../services/metaContentTypesService');
        var evHelperService = require('../../services/entityViewerHelperService');
        var usersService = require('../../services/usersService');

        var complexTransactionService = require('../../services/transaction/complexTransactionService');
        var instrumentService = require('../../services/instrumentService');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var SplitPanelExchangeService = require('../../services/groupTable/exchangeWithSplitPanelService');
        var AttributeDataService = require('../../services/attributeDataService');

        var evDataProviderService = require('../../services/ev-data-provider/ev-data-provider.service');
        var middlewareService = require('../../services/middlewareService');


        module.exports = function ($scope, $mdDialog, $state, $stateParams, $transitions, $customDialog, $bigDrawer) {

            var vm = this;

            var doNotCheckLayoutChanges = false;

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

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

            var deregisterOnBeforeTransitionHook;

            // $customDialog.show({
            //     controller: 'LoaderDialogController as vm',
            //     templateUrl: 'views/dialogs/loader-dialog-view.html',
            //     locals: {
            //         data: {}
            //     }
            // }).then(function (data) {
            //
            //     console.log('Resolved??', data);
            //
            // });

            var initTransitionHooks = function () {

                deregisterOnBeforeTransitionHook = $transitions.onBefore({}, checkLayoutForChanges);

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
                    var flatList = vm.entityViewerDataService.getFlatList();

                    var manageTransactionsLockedAndCanceledProps = function (actionType) {

                        var selectedRows = flatList.filter(function (row) {
                            return row.___is_activated;
                        });

                        selectedRows.forEach(function (row) {

                            var transactionObj = vm.entityViewerDataService.getObject(row.___id, row.___parentId);

                            switch (actionType) {
                                case 'lock':
                                    if (!transactionObj.is_locked) {

                                        transactionObj.is_locked = true;
                                        transactionObj.is_canceled = false;

                                        complexTransactionService.updateProperties(transactionObj.id,
                                            {
                                                is_locked: transactionObj.is_locked,
                                                is_canceled: transactionObj.is_canceled
                                            }
                                        );

                                    }

                                    break;

                                case 'unlock':
                                    if (transactionObj.is_locked) {

                                        transactionObj.is_locked = false;

                                        complexTransactionService.updateProperties(transactionObj.id,
                                            {is_locked: transactionObj.is_locked}
                                        );

                                    }

                                    break;

                                case 'ignore':
                                    if (!transactionObj.is_canceled) {

                                        transactionObj.is_locked = false;
                                        transactionObj.is_canceled = true;

                                        complexTransactionService.updateProperties(transactionObj.id,
                                            {
                                                is_locked: transactionObj.is_locked,
                                                is_canceled: transactionObj.is_canceled
                                            }
                                        );

                                    }

                                    break;

                                case 'activate':
                                    if (transactionObj.is_canceled) {

                                        transactionObj.is_canceled = false;

                                        complexTransactionService.updateProperties(transactionObj.id,
                                            {is_canceled: transactionObj.is_canceled}
                                        );

                                    }

                                    break;
                            }

                            vm.entityViewerDataService.setObject(transactionObj);

                        });

                    };

                    var manageInstrumentProps = function(actionType){

                        var selectedRows = flatList.filter(function (row) {
                            return row.___is_activated;
                        });

                        selectedRows.forEach(function (row) {

                            var obj = vm.entityViewerDataService.getObject(row.___id, row.___parentId);

                            switch (actionType) {

                                case 'deactivate':

                                    obj.is_active = false;

                                    instrumentService.patch(obj.id,
                                        {
                                            is_active: obj.is_active
                                        }
                                    );

                                    break;

                                case 'activate':
                                    if (obj.is_active) {

                                        obj.is_active = true;

                                        instrumentService.patch(obj.id,
                                            {
                                                is_active: obj.is_active
                                            }
                                        );

                                    }

                                    break;
                            }

                            vm.entityViewerDataService.setObject(obj);

                        });

                    };

                    console.log('activeObject', activeObject);

                    if (activeObject.id) {

                        switch (action) {
                            case 'delete':

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
                                    vm.entityViewerDataService.setActiveObjectActionData(null);

                                    if (res.status === 'agree') {

                                        var objects = vm.entityViewerDataService.getObjects();

                                        objects.forEach(function (obj) {

                                            if (res.data.ids.indexOf(obj.id) !== -1) {

                                                var parent = vm.entityViewerDataService.getData(obj.___parentId)

                                                parent.results = parent.results.filter(function (resultItem) {
                                                    return res.data.ids.indexOf(resultItem.id) === -1
                                                });

                                                vm.entityViewerDataService.setData(parent)

                                            }

                                        });

                                        vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    }
                                });

                                break;

                            case 'edit':

                                switch (entitytype) {
                                    case 'transaction-type':

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
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res && res.res === 'agree') {

                                                if (res.data.action === 'delete') {

                                                    var objects = vm.entityViewerDataService.getObjects();

                                                    objects.forEach(function (obj) {

                                                        if (activeObject.id === obj.id) {

                                                            var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                            parent.results = parent.results.filter(function (resultItem) {
                                                                return resultItem.id !== activeObject.id
                                                            });

                                                            vm.entityViewerDataService.setData(parent)

                                                        }

                                                    });

                                                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                                } else {

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

                                            }
                                        });

                                        break;

                                    case 'complex-transaction':

                                        /*$mdDialog.show({
                                            controller: 'ComplexTransactionEditDialogController as vm',
                                            templateUrl: 'views/entity-viewer/complex-transaction-edit-dialog-view.html',
                                            parent: angular.element(document.body),
                                            targetEvent: activeObject.event,
                                            //clickOutsideToClose: false,
                                            locals: {
                                                entityType: entitytype,
                                                entityId: activeObject.id,
                                                data: {}
                                            }
                                        }).then(function (res) {

                                            vm.entityViewerDataService.setActiveObjectAction(null);
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res && res.res === 'agree') {

                                                if (res.data.action === 'delete') {

                                                    var objects = vm.entityViewerDataService.getObjects();

                                                    objects.forEach(function (obj) {

                                                        if (activeObject.id === obj.id) {

                                                            var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                            parent.results = parent.results.filter(function (resultItem) {
                                                                return resultItem.id !== activeObject.id
                                                            });

                                                            vm.entityViewerDataService.setData(parent)

                                                        }

                                                    });

                                                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                                } else {

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

                                            } else if (res && res.status === 'disagree' && res.data.updateRowIcon) {

                                                var tIsLocked = res.data.updateRowIcon.is_locked;
                                                var tIsCanceled = res.data.updateRowIcon.is_canceled;
                                                var activeObject = vm.entityViewerDataService.getActiveObject();
                                                var transactionObj = vm.entityViewerDataService.getObject(activeObject.___id, activeObject.___parentId);

                                                transactionObj.is_locked = tIsLocked;
                                                transactionObj.is_canceled = tIsCanceled;
                                                vm.entityViewerDataService.setObject(transactionObj);

                                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);
                                            }

                                        });*/

                                        $bigDrawer.show({
                                            controller: 'ComplexTransactionEditDialogController as vm',
                                            templateUrl: 'views/entity-viewer/complex-transaction-edit-drawer-view.html',
                                            locals: {
                                                entityType: entitytype,
                                                entityId: activeObject.id,
                                                data: {}
                                            }

                                        }).then(function (res) {

                                            vm.entityViewerDataService.setActiveObjectAction(null);
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res && res.res === 'agree') {

                                                if (res.data.action === 'delete') {

                                                    var objects = vm.entityViewerDataService.getObjects();

                                                    objects.forEach(function (obj) {

                                                        if (activeObject.id === obj.id) {

                                                            var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                            parent.results = parent.results.filter(function (resultItem) {
                                                                return resultItem.id !== activeObject.id
                                                            });

                                                            vm.entityViewerDataService.setData(parent)

                                                        }

                                                    });

                                                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                                } else {

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

                                            } else if (res && res.status === 'disagree' &&
                                                       res.data && res.data.updateRowIcon) {

                                                var tIsLocked = res.data.updateRowIcon.is_locked;
                                                var tIsCanceled = res.data.updateRowIcon.is_canceled;
                                                var activeObject = vm.entityViewerDataService.getActiveObject();
                                                var transactionObj = vm.entityViewerDataService.getObject(activeObject.___id, activeObject.___parentId);

                                                transactionObj.is_locked = tIsLocked;
                                                transactionObj.is_canceled = tIsCanceled;
                                                vm.entityViewerDataService.setObject(transactionObj);

                                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_PROJECTION);
                                            }

                                        });

                                        break;

                                    case 'price-history-error':

                                        $mdDialog.show({
                                            controller: 'PriceHistoryErrorEditDialogController as vm',
                                            templateUrl: 'views/entity-viewer/price-history-error-edit-dialog-view.html',
                                            parent: angular.element(document.body),
                                            targetEvent: activeObject.event,
                                            locals: {
                                                entityId: activeObject.id
                                            }
                                        }).then(function (res) {

                                            vm.entityViewerDataService.setActiveObjectAction(null);
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res.status === 'agree') {

                                                var objects = vm.entityViewerDataService.getObjects();

                                                console.log('objects', objects);

                                                objects.forEach(function (obj) {

                                                    if (res.data.ids.indexOf(obj.id) !== -1) {

                                                        var parent = vm.entityViewerDataService.getData(obj.___parentId)

                                                        parent.results = parent.results.filter(function (resultItem) {
                                                            return res.data.ids.indexOf(resultItem.id) === -1
                                                        });

                                                        console.log('parent', parent);

                                                        vm.entityViewerDataService.setData(parent)

                                                    }

                                                });

                                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                            }
                                        });

                                        break;

                                    case 'currency-history-error':

                                        $mdDialog.show({
                                            controller: 'CurrencyHistoryErrorEditDialogController as vm',
                                            templateUrl: 'views/entity-viewer/currency-history-error-edit-dialog-view.html',
                                            parent: angular.element(document.body),
                                            targetEvent: activeObject.event,
                                            locals: {
                                                entityId: activeObject.id
                                            }
                                        }).then(function (res) {

                                            vm.entityViewerDataService.setActiveObjectAction(null);
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res.status === 'agree') {

                                                var objects = vm.entityViewerDataService.getObjects();

                                                objects.forEach(function (obj) {

                                                    if (res.data.ids.indexOf(obj.id) !== -1) {

                                                        var parent = vm.entityViewerDataService.getData(obj.___parentId)

                                                        parent.results = parent.results.filter(function (resultItem) {
                                                            return res.data.ids.indexOf(resultItem.id) === -1
                                                        });

                                                        vm.entityViewerDataService.setData(parent)

                                                    }

                                                });

                                                vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                            }
                                        });

                                        break;

                                    default:
                                        $mdDialog.show({
                                            controller: 'EntityViewerEditDialogController as vm',
                                            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                                            parent: angular.element(document.body),
                                            targetEvent: activeObject.event,
                                            //clickOutsideToClose: false,
                                            locals: {
                                                entityType: entitytype,
                                                entityId: activeObject.id,
                                                data: {}
                                            }
                                        }).then(function (res) {

                                            vm.entityViewerDataService.setActiveObjectAction(null);
                                            vm.entityViewerDataService.setActiveObjectActionData(null);

                                            if (res && res.res === 'agree') {


                                                if (res.data.action === 'delete') {

                                                    var objects = vm.entityViewerDataService.getObjects();

                                                    objects.forEach(function (obj) {

                                                        if (activeObject.id === obj.id) {

                                                            var parent = vm.entityViewerDataService.getData(obj.___parentId);

                                                            parent.results = parent.results.filter(function (resultItem) {
                                                                return resultItem.id !== activeObject.id
                                                            });

                                                            vm.entityViewerDataService.setData(parent)

                                                        }

                                                    });

                                                    vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                                } else {

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

                                            }
                                        });
                                }

                                break;

                            case 'edit_instrument':

                                $mdDialog.show({
                                    controller: 'EntityViewerEditDialogController as vm',
                                    templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: activeObject.event,
                                    locals: {
                                        entityType: 'instrument',
                                        entityId: activeObject.instrument,
                                        data: {}
                                    }
                                }).then(function (res) {

                                    vm.entityViewerDataService.setActiveObjectAction(null);
                                    vm.entityViewerDataService.setActiveObjectActionData(null);

                                    if (res && res.res === 'agree') {
                                        vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                    }

                                });

                                break;

                            case 'lock_transaction':
                                manageTransactionsLockedAndCanceledProps('lock');
                                break;

                            case 'unlock_transaction':
                                manageTransactionsLockedAndCanceledProps('unlock');
                                break;

                            case 'ignore_transaction':
                                manageTransactionsLockedAndCanceledProps('ignore');
                                break;

                            case 'activate_transaction':
                                manageTransactionsLockedAndCanceledProps('activate');
                                break;

                            case 'activate_instrument':
                                manageInstrumentProps('activate');
                                break;
                            case 'deactivate_instrument':
                                manageInstrumentProps('deactivate');
                                break;
                        }

                    }

                });

            };

            vm.setLayout = function (layoutData) {

                vm.entityViewerDataService.setLayoutCurrentConfiguration(layoutData, uiService, false);
                vm.setFiltersValuesFromQueryParameters();
                vm.readyStatus.layout = true;
                console.log('vm', vm);
                evDataProviderService.updateDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                var additions = vm.entityViewerDataService.getAdditions();
                var interfaceLayout = vm.entityViewerDataService.getInterfaceLayout();
                if (additions.isOpen && interfaceLayout.splitPanel.height && interfaceLayout.splitPanel.height > 0) {
                    vm.entityViewerDataService.setSplitPanelStatus(true);
                }

                $scope.$apply();

            };

            vm.getActiveObjectFromQueryParameters = function () {

                var queryParameters = window.location.href.split('?')[1];

                var result = null;

                if (queryParameters) {

                    var parameters = queryParameters.split('&');

                    result = {};

                    parameters.forEach(function (parameter) {

                        var pieces = parameter.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        result[key] = decodeURI(value);

                    });

                    return result;

                }

            };

            vm.setFiltersValuesFromQueryParameters = function () {

                var activeObject = vm.getActiveObjectFromQueryParameters();

                console.log('vm.getView activeObject', activeObject);

                if (activeObject) {

                    var filters = vm.entityViewerDataService.getFilters();

                    filters.forEach(function (item) {

                        if (activeObject.hasOwnProperty(item.key)) {
                            item.options.filter_values = [activeObject[item.key]]
                        }

                    })
                }


            };

            vm.isLayoutFromUrl = function () {
                return window.location.href.indexOf('?layout=') !== -1
            };

            /* vm.getLayoutByUserCode = function (userCode) {

                console.log('vm.getLayoutByUserCode.userCode', userCode);

                var contentType = metaContentTypesService.findContentTypeByEntity(vm.entityType, 'ui');

                uiService.getListLayoutDefault({
                    pageSize: 1000,
                    filters: {
                        content_type: contentType,
                        user_code: userCode
                    }
                }).then(function (activeLayoutData) {

                    var activeLayout = null;

                    if (activeLayoutData.hasOwnProperty('results') && activeLayoutData.results[0]) {
                        activeLayout = activeLayoutData.results[0];
                    }

                    if (activeLayout) {

                        vm.setLayout(activeLayout);

                    } else {

                        $mdDialog.show({
                            controller: 'InfoDialogController as vm',
                            templateUrl: 'views/info-dialog-view.html',
                            parent: angular.element(document.body),
                            clickOutsideToClose: false,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            multiple: true,
                            locals: {
                                info: {
                                    title: 'Warning',
                                    description: "Layout " + name + " is not found. Switching back to Default Layout."
                                }
                            }
                        }).then(function (value) {

                            vm.getDefaultLayout();

                        })

                    }

                });

            }; */


            /* vm.getDefaultLayout = function () {

                uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                    var defaultLayout = null;
                    if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {
                        defaultLayout = defaultLayoutData.results[0];
                    }

                    vm.setLayout(defaultLayout);

                });

            }; */

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
                vm.entityViewerDataService.setViewContext('entity_viewer');
                vm.entityViewerDataService.setCurrentMember(vm.currentMember);

                vm.downloadAttributes();

                vm.entityViewerDataService.setRootEntityViewer(true);

                setEventListeners();

                var layoutUserCode;

                if (vm.isLayoutFromUrl()) {

                    var queryParams = window.location.href.split('?')[1];
                    var params = queryParams.split('&');

                    params.forEach(function (param) {

                        var pieces = param.split('=');
                        var key = pieces[0];
                        var value = pieces[1];

                        if (key === 'layout') {
                            layoutUserCode = value;

                            if (layoutUserCode.indexOf('%20') !== -1) {
                                layoutUserCode = layoutUserCode.replace(/%20/g, " ")
                            }
                        }

                    });

                    // vm.getLayoutByUserCode(layoutUserCode);
                    evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

                } else if ($stateParams.layoutUserCode) {

                    layoutUserCode = $stateParams.layoutUserCode;
                    // vm.getLayoutByUserCode(layoutUserCode);
                    evHelperService.getLayoutByUserCode(vm, layoutUserCode, $mdDialog);

                } else {
                    // vm.getDefaultLayout();
                    evHelperService.getDefaultLayout(vm);
                }


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

            vm.getCurrentMember = function () {

                return usersService.getMyCurrentMember().then(function (data) {

                    vm.currentMember = data;

                    $scope.$apply();

                });
            };

            var checkLayoutForChanges = function () { // called on attempt to change or reload page

                return new Promise(function (resolve, reject) {

                    if (!doNotCheckLayoutChanges) {

                        var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();

                        var spChangedLayout = false;
                        var additions = vm.entityViewerDataService.getAdditions();
                        if (additions.isOpen) {
                            spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                        }

                        var layoutIsUnchanged = true;
                        if (activeLayoutConfig && activeLayoutConfig.data) {
                            var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                            layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false);
                        }

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

                                                /* When saving is_default: true layout on backend, others become is_default: false
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

                                                }); */

												uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
													saveLayoutRes(true);
												});

                                            }

                                            layoutsSavePromises.push(saveLayoutChanges);

                                        });
                                    }

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

                });

            };

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                var layoutCurrentConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(false);

                var layoutIsUnchanged = true;
                if (activeLayoutConfig && activeLayoutConfig.data) {
                    layoutIsUnchanged = evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, layoutCurrentConfig, false);
                }

                var spChangedLayout = false;
                var additions = vm.entityViewerDataService.getAdditions();
                if (additions.isOpen) {
                    spChangedLayout = vm.splitPanelExchangeService.getSplitPanelChangedLayout();
                }

                if (!layoutIsUnchanged || spChangedLayout) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }

            };

            var removeTransitionWatcher = function () {
                if (vm.stateWithLayout) {
                    deregisterOnBeforeTransitionHook();

                    window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss);
                }
            };

            vm.init = function () {

                if (vm.stateWithLayout) {
                    initTransitionHooks();

                    window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);
                }

                middlewareService.onMasterUserChanged(function () {

                    doNotCheckLayoutChanges = true;
                    removeTransitionWatcher();

                });

                middlewareService.onLogOut(function () {

                    doNotCheckLayoutChanges = true;
                    removeTransitionWatcher();

                });

                vm.getCurrentMember().then(function (value) {

                    vm.getView();

                });

            };

            vm.init();

            this.$onDestroy = function () {
                removeTransitionWatcher();
            }
        }

    }()
);