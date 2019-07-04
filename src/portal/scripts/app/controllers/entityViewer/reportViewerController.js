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

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');

        module.exports = function ($scope, $mdDialog, $transitions) {

            console.log("Report Viewer Controller init");

            var vm = this;

            vm.listViewIsReady = false;

            vm.setEventListeners = function () {

                vm.entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                    rvDataProviderService.createDataStructure(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                    rvDataProviderService.sortObjects(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                    rvDataProviderService.sortGroupType(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                    rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                });

                vm.entityViewerEventService.addEventListener(evEvents.LIST_LAYOUT_CHANGE, function () {

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = vm.entityViewerDataService.getActiveObject();
                    var action = vm.entityViewerDataService.getActiveObjectAction();
                    var entitytype = vm.entityViewerDataService.getEntityType();

                    console.log('activeObject', activeObject);

                    if (action === 'edit_instrument' && activeObject.id) {

                        $mdDialog.show({
                            controller: 'EntityViewerEditDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'instrument',
                                entityId: activeObject['instrument.id']
                            }
                        }).then(function (res) {
                            if (res && res.res === 'agree') {
                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });

                    }

                    if (action === 'edit_account' && activeObject.id) {

                        $mdDialog.show({
                            controller: 'EntityViewerEditDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'account',
                                entityId: activeObject['account.id']
                            }
                        }).then(function (res) {
                            if (res && res.res === 'agree') {
                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });

                    }

                    if (action === 'edit_portfolio' && activeObject.id) {

                        $mdDialog.show({
                            controller: 'EntityViewerEditDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'portfolio',
                                entityId: activeObject['portfolio.id']
                            }
                        }).then(function (res) {
                            if (res && res.res === 'agree') {
                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });

                    }

                    if (action === 'edit_price' && activeObject.id) {

                        $mdDialog.show({
                            controller: 'EntityViewerEditDialogController as vm',
                            templateUrl: 'views/entity-viewer/entity-viewer-edit-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'instrument',
                                entityId: activeObject['instrument.id']
                            }
                        }).then(function (res) {
                            if (res && res.res === 'agree') {
                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });

                    }

                    if (action === 'book_transaction' && activeObject.id) {

                        var reportOptions = vm.entityViewerDataService.getReportOptions();

                        var contextData = {
                            effective_date: reportOptions.report_date,
                            instrument: null,
                            portfolio: null,
                            account: null
                        };

                        if (activeObject['instrument.id']) {
                            contextData.instrument = activeObject['instrument.id'];
                            contextData.instrument_object = {
                                id: activeObject['instrument.id'],
                                name: activeObject['instrument.name'],
                                user_code: activeObject['instrument.user_code']
                            };
                        }

                        if (activeObject['portfolio.id']) {
                            contextData.portfolio = activeObject['portfolio.id'];
                            contextData.portfolio_object = {
                                id: activeObject['portfolio.id'],
                                name: activeObject['portfolio.name'],
                                user_code: activeObject['portfolio.user_code']
                            };
                        }

                        if (activeObject['account.id']) {
                            contextData.account = activeObject['account.id'];
                            contextData.account_object = {
                                id: activeObject['account.id'],
                                name: activeObject['account.name'],
                                user_code: activeObject['account.user_code']
                            };
                        }


                        var entity = {
                            contextData: contextData
                        };

                        $mdDialog.show({
                            controller: 'ComplexTransactionAddDialogController as vm',
                            templateUrl: 'views/entity-viewer/complex-transaction-add-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: activeObject.event,
                            locals: {
                                entityType: 'complex-transaction',
                                entity: entity
                            }
                        }).then(function (res) {
                            if (res && res.res === 'agree') {
                                vm.entityViewerDataService.resetData();
                                vm.entityViewerDataService.resetRequestParameters();

                                var rootGroup = vm.entityViewerDataService.getRootGroupData();

                                vm.entityViewerDataService.setActiveRequestParametersId(rootGroup.___id);

                                vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                            }
                        });

                    }


                });


            };


            vm.getView = function () {

                console.log('here?');

                vm.listViewIsReady = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();

                vm.entityType = $scope.$parent.vm.entityType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(true);

                vm.setEventListeners();

                uiService.getActiveListLayout(vm.entityType).then(function (res) {

                    /*var listLayout = {};

                    if (res.results.length) {

                        listLayout = Object.assign({}, res.results[0]);

                    } else {

                        console.log('default triggered');

                        var defaultList = uiService.getDefaultListLayout();

                        listLayout = {};
                        listLayout.data = Object.assign({}, defaultList[0].data);

                    }

                    entityViewerDataService.setListLayout(listLayout);

                    var reportOptions = getReportOptions();
                    var reportLayoutOptions = getReportLayoutOptions();
                    var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);
                    var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, listLayout.data.reportLayoutOptions);

                    setReportOptions(newReportOptions);
                    setReportLayoutOptions(newReportLayoutOptions);

                    entityViewerDataService.setColumns(listLayout.data.columns);
                    entityViewerDataService.setGroups(listLayout.data.grouping);
                    entityViewerDataService.setFilters(listLayout.data.filters);

                    entityViewerDataService.setListLayout(listLayout);

                    listLayout.data.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    entityViewerDataService.setComponents(listLayout.data.components);
                    entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    entityViewerDataService.setRootEntityViewer(true);*/

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(res, uiService, true);

                    var reportOptions = vm.entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = vm.entityViewerDataService.getReportLayoutOptions();

                    // Check if there is need to solve report datepicker expression
                    if (reportLayoutOptions && reportLayoutOptions.datepickerOptions) {

                        var reportFirstDatepickerExpression = reportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression; // field for the first datepicker in reports with two datepickers, e.g. p&l report
                        var reportLastDatepickerExpression = reportLayoutOptions.datepickerOptions.reportLastDatepicker.expression;

                        if (reportFirstDatepickerExpression || reportLastDatepickerExpression) {

                            var datepickerExpressionsToSolve = [];

                            if (reportFirstDatepickerExpression) {

                                var solveFirstExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportFirstDatepickerExpression}).then(function (data) {
                                        reportOptions.pl_first_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveFirstExpression());
                            }

                            if (reportLastDatepickerExpression) {

                                var solveLastExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportLastDatepickerExpression}).then(function (data) {
                                        reportOptions.report_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveLastExpression());
                            }

                            Promise.all(datepickerExpressionsToSolve).then(function () {

                                vm.listViewIsReady = true;

                                rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                                $scope.$apply();

                                vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                            });


                        } else {

                            vm.listViewIsReady = true;

                            rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                            $scope.$apply();

                            vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                        }
                        // < Check if there is need to solve report datepicker expression >
                    } else {

                        vm.listViewIsReady = true;

                        rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        $scope.$apply();

                        entityViewerDataService.setActiveLayoutConfiguration({isReport: true});


                    }

                });

            };

            vm.init = function () {


                vm.getView();

            };

            vm.init();

            /*var checkForLayoutChanges = function (savedLayoutConfiguration, currentLayoutConfiguration) {

                var savedConfig = JSON.parse(JSON.stringify(savedLayoutConfiguration));
                delete savedConfig.data.reportOptions.task_id;
                delete savedConfig.data.reportOptions.recieved_at;

                if (savedConfig.data.hasOwnProperty('reportLayoutOptions')) {

                    if (savedConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                        delete savedConfig.data.reportOptions.pl_first_date;
                    }

                    if (savedConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                        delete savedConfig.data.reportOptions.report_date;
                    }

                }

                var currentConfig = JSON.parse(JSON.stringify(currentLayoutConfiguration));
                delete currentConfig.data.reportOptions.task_id;
                delete currentConfig.data.reportOptions.recieved_at;

                if (currentConfig.data.hasOwnProperty('reportLayoutOptions')) {

                    if (currentConfig.data.reportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
                        delete currentConfig.data.reportOptions.pl_first_date;
                    }

                    if (currentConfig.data.reportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
                        delete currentConfig.data.reportOptions.report_date;
                    }

                }

                var layoutChanged = objectComparisonHelper.compareObjects(savedConfig, currentConfig);

                return layoutChanged;

            };*/

            var checkLayoutForChanges = function () {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, currentLayoutConfig, true)) {

                    return new Promise(function (resolve, reject) {

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

                                delete currentLayoutConfig.data.reportOptions.task_id;

                                if (currentLayoutConfig.hasOwnProperty('id')) {

                                    uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function () {
                                        resolve(true);
                                    });

                                } else {

                                    if (res.data && res.data.layoutName) {
                                        currentLayoutConfig.name = res.data.layoutName;
                                    }

                                    uiService.getActiveListLayout(vm.entityType).then(function (data) {

                                        var activeLayout = data.results[0];
                                        activeLayout.is_default = false;
                                        currentLayoutConfig.is_default = true;

                                        uiService.updateListLayout(activeLayout.id, activeLayout).then(function () {

                                            uiService.createListLayout(vm.entityType, currentLayoutConfig).then(function () {
                                                resolve(true);
                                            });

                                        });

                                    });

                                }

                            } else if (res.status === 'do_not_save_layout') {

                                resolve(true);

                            }

                        }).catch(function () {
                            reject();
                        });
                    });

                }

            };

            var doBeforeStateChange = $transitions.onBefore({}, checkLayoutForChanges);

            var warnAboutLayoutChangesLoss = function (event) {

                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();
                var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, currentLayoutConfig, true)) {
                    event.preventDefault();
                    (event || window.event).returnValue = 'All unsaved changes of layout will be lost.';
                }

            };

            window.addEventListener('beforeunload', warnAboutLayoutChangesLoss);

            this.$onDestroy = function () {
                doBeforeStateChange();

                window.removeEventListener('beforeunload', warnAboutLayoutChangesLoss)
            }
        }

    }()
);