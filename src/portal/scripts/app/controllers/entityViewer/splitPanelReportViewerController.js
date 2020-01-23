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

        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var AttributeDataService = require('../../services/attributeDataService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');
        var middlewareService = require('../../services/middlewareService');

        module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService, splitPanelExchangeService) {

            var vm = this;

            console.log('parentEntityViewerDataService', parentEntityViewerDataService);
            console.log('parentEntityViewerEventService', parentEntityViewerEventService);

            vm.readyStatus = {
                attributes: false,
                layout: false
            };

            vm.entityViewerDataService = null;
            vm.entityViewerEventService = null;

            vm.setEventListeners = function () {

                parentEntityViewerEventService.addEventListener(evEvents.ACTIVE_OBJECT_CHANGE, function () {

                    var activeObject = parentEntityViewerDataService.getActiveObject();
                    var columns = parentEntityViewerDataService.getColumns();

                    vm.entityViewerDataService.setActiveObjectFromAbove(activeObject);
                    vm.entityViewerDataService.setAttributesFromAbove(columns);


                    vm.entityViewerEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE);

                });

                parentEntityViewerEventService.addEventListener(evEvents.UPDATE_SPLIT_PANEL_TABLE_VIEWPORT, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                });

                parentEntityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    vm.entityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

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

                    var spActiveLayout = vm.entityViewerDataService.getSplitPanelLayoutToOpen();
                    parentEntityViewerDataService.setSplitPanelLayoutToOpen(spActiveLayout);

                    vm.getView();

                });

                vm.entityViewerEventService.addEventListener(evEvents.SPLIT_PANEL_DEFAULT_LIST_LAYOUT_CHANGED, function () {

                    var spDefaultLayout = vm.entityViewerDataService.getSplitPanelDefaultLayout();
                    var additions = parentEntityViewerDataService.getAdditions();

                    additions.layoutData.layoutId = spDefaultLayout.layoutId;
                    additions.layoutData.name = spDefaultLayout.name;
                    additions.layoutData.content_type = spDefaultLayout.content_type;

                    parentEntityViewerDataService.setAdditions(additions);

                });

                // Events that dispatch events inside parent
                vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

            };

            var getLayoutChanges = function () {
                var activeLayoutConfig = vm.entityViewerDataService.getActiveLayoutConfiguration();

                if (activeLayoutConfig && activeLayoutConfig.data) {
                    var currentLayoutConfig = vm.entityViewerDataService.getLayoutCurrentConfiguration(true);

                    if (!evHelperService.checkForLayoutConfigurationChanges(activeLayoutConfig, currentLayoutConfig, true)) {
                        return currentLayoutConfig;
                    }
                }

                return false
            };

            splitPanelExchangeService.setSplitPanelLayoutChangesCheckFn(getLayoutChanges);

            vm.downloadAttributes = function(){

                var promises = [];

                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('balance-report'));
                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('pl-report'));
                promises.push(vm.attributeDataService.downloadCustomFieldsByEntityType('transaction-report'));

                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('portfolio'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('account'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('instrument'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('responsible'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('counterparty'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('transaction-type'));
                promises.push(vm.attributeDataService.downloadDynamicAttributesByEntityType('complex-transaction'));

                if (vm.entityType === 'balance-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                }

                if (vm.entityType === 'pl-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                }

                if (vm.entityType === 'transaction-report') {
                    promises.push(vm.attributeDataService.downloadInstrumentUserFields());
                    promises.push(vm.attributeDataService.downloadTransactionUserFields());
                }

                Promise.all(promises).then(function (data) {

                    vm.readyStatus.attributes = true;
                    $scope.$apply();

                })

            };

            vm.getView = function () {

                // middlewareService.setNewSplitPanelLayoutName(false); // reset split panel layout name

                vm.readyStatus.layout = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();
                vm.attributeDataService = new AttributeDataService();

                console.log('scope, ', $scope);

                vm.entityType = $scope.$parent.vm.entityType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(false);
                vm.entityViewerDataService.setUseFromAbove(true);
                vm.entityViewerDataService.setViewContext('split_panel');


                vm.downloadAttributes();

                var columns = parentEntityViewerDataService.getColumns();

                var splitPanelLayoutToOpen = parentEntityViewerDataService.getSplitPanelLayoutToOpen();
                var additions = parentEntityViewerDataService.getAdditions();

                var spDefaultLayoutData = {
                    layoutId: additions.layoutData.layoutId,
                    name: additions.layoutData.name,
                    content_type: additions.layoutData.content_type
                };

                var defaultLayoutId = null;

                if (splitPanelLayoutToOpen) {
                    defaultLayoutId = splitPanelLayoutToOpen;
                } else {
                    defaultLayoutId = additions.layoutId; // needed in order for old system layouts work

                    if (additions.layoutData && additions.layoutData.layoutId) {
                        defaultLayoutId = additions.layoutData.layoutId;
                    }

                }

                vm.entityViewerDataService.setAttributesFromAbove(columns);

                vm.setEventListeners();

                var setLayout = function (layout) {

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(layout, uiService, true);

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

                                vm.readyStatus.layout = true;

                                rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                                $scope.$apply();

                                //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                            });


                        } else {

                            vm.readyStatus.layout = true;

                            rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                            $scope.$apply();

                            //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});

                        }
                    // < Check if there is need to solve report datepicker expression >
                    } else {

                        vm.readyStatus.layout = true;

                        rvDataProviderService.requestReport(vm.entityViewerDataService, vm.entityViewerEventService);

                        $scope.$apply();

                        //vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});


                    }

                    vm.entityViewerDataService.setSplitPanelDefaultLayout(spDefaultLayoutData);

                };

                if (defaultLayoutId) {

                    uiService.getListLayoutByKey(defaultLayoutId).then(function (spLayoutData) {

                        if (spLayoutData) {
                            middlewareService.setNewSplitPanelLayoutName(spLayoutData.name);
                        }

                        setLayout(spLayoutData);

                    });

                } else {

                    uiService.getDefaultListLayout(vm.entityType).then(function (defaultLayoutData) {

                        var defaultLayout = null;
                        if (defaultLayoutData.results && defaultLayoutData.results.length > 0) {

                            defaultLayout = defaultLayoutData.results[0];
                            middlewareService.setNewSplitPanelLayoutName(defaultLayout.name);

                        }

                        setLayout(defaultLayout);

                    });
                }

            };

            vm.init = function () {

                vm.getView();

            };

            vm.init();


        }

    }()
);