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

        module.exports = function ($scope, $mdDialog, $transitions, parentEntityViewerDataService, parentEntityViewerEventService) {

            var vm = this;

            console.log("Split Panel Report Viewer Controller init");

            console.log('parentEntityViewerDataService', parentEntityViewerDataService);
            console.log('parentEntityViewerEventService', parentEntityViewerEventService);

            vm.listViewIsReady = false;

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

                    vm.getView();

                });

                // Events that dispatch events inside parent
                vm.entityViewerEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

                    parentEntityViewerEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);

                });

            };

            vm.getView = function () {

                vm.listViewIsReady = false;

                vm.entityViewerDataService = new EntityViewerDataService();
                vm.entityViewerEventService = new EntityViewerEventService();

                vm.entityType = $scope.$parent.vm.entityType;
                vm.entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                vm.entityViewerDataService.setRootEntityViewer(false);

                console.log('here? 1231232', vm.entityViewerDataService.isRootEntityViewer());

                var columns = parentEntityViewerDataService.getColumns();

                console.log('parent columns', columns);

                vm.entityViewerDataService.setAttributesFromAbove(columns);

                vm.setEventListeners();

                uiService.getDefaultListLayout(vm.entityType).then(function (res) {

                    vm.entityViewerDataService.setLayoutCurrentConfiguration(res.results[0], uiService, true);

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

                        vm.entityViewerDataService.setActiveLayoutConfiguration({isReport: true});


                    }

                });

            };

            vm.init = function () {

                vm.getView();

            };

            vm.init();


        }

    }()
);