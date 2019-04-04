/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');

        module.exports = function ($scope, $mdDialog) {

            var vm = this;

            vm.listViewIsReady = false;

            var entityViewerDataService = new EntityViewerDataService();
            var entityViewerEventService = new EntityViewerEventService();

            vm.entityViewerDataService = entityViewerDataService;
            vm.entityViewerEventService = entityViewerEventService;


            entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {

                rvDataProviderService.createDataStructure(entityViewerDataService, entityViewerEventService);

            });

            entityViewerEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

                rvDataProviderService.sortObjects(entityViewerDataService, entityViewerEventService);

            });

            entityViewerEventService.addEventListener(evEvents.GROUP_TYPE_SORT_CHANGE, function () {

                rvDataProviderService.sortGroupType(entityViewerDataService, entityViewerEventService);

            });

            entityViewerEventService.addEventListener(evEvents.REQUEST_REPORT, function () {

                rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

            });


            vm.getView = function () {

                uiService.getActiveListLayout(vm.entityType).then(function (res) {

                    var listLayout = {};

                    if (res.results.length) {

                        listLayout = Object.assign({}, res.results[0]);

                    } else {

                        console.log('default triggered');

                        var defaultList = uiService.getDefaultListLayout();

                        listLayout = {};
                        listLayout.data = Object.assign({}, defaultList[0].data);

                    }

                    entityViewerDataService.setListLayout(listLayout);

                    var reportOptions = entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = entityViewerDataService.getReportLayoutOptions();
                    var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);
                    var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, listLayout.data.reportLayoutOptions);

                    entityViewerDataService.setReportOptions(newReportOptions);
                    entityViewerDataService.setReportLayoutOptions(newReportLayoutOptions);

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
                    entityViewerDataService.setRootEntityViewer(true);

                    // Check if there is need to solve report datepicker expression
                    if (newReportLayoutOptions && newReportLayoutOptions.datepickerOptions) {
                        console.log("complex datepicker rv", newReportLayoutOptions);
                        var reportFirstDatepickerExpression = newReportLayoutOptions.datepickerOptions.reportFirstDatepicker.expression;
                        var reportLastDatepickerExpression = newReportLayoutOptions.datepickerOptions.reportLastDatepicker.expression;

                        if (reportFirstDatepickerExpression || reportLastDatepickerExpression) {

                            var datepickerExpressionsToSolve = [];

                            if (reportFirstDatepickerExpression) {

                                var solveFirstExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportFirstDatepickerExpression}).then(function (data) {
                                        console.log("complex datepicker rv first expression result", data);
                                        newReportOptions.pl_first_date = data.result;
                                    });
                                };

                                datepickerExpressionsToSolve.push(solveFirstExpression());
                            }

                            if (reportLastDatepickerExpression) {

                                var solveLastExpression = function () {
                                    return expressionService.getResultOfExpression({"expression": reportLastDatepickerExpression}).then(function (data) {
                                        console.log("complex datepicker rv last expression result", data);
                                        newReportOptions.report_date = data.result;

                                    });
                                };

                                datepickerExpressionsToSolve.push(solveLastExpression());
                            }

                            Promise.all(datepickerExpressionsToSolve).then(function () {

                                vm.listViewIsReady = true;

                                rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                                $scope.$apply()

                            });


                        } else {

                            vm.listViewIsReady = true;

                            rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                            $scope.$apply()

                        }
                        // < Check if there is need to solve report datepicker expression >
                    } else {

                        vm.listViewIsReady = true;

                        rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                        $scope.$apply()

                    }

                    /*vm.listViewIsReady = true;

                    rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                    $scope.$apply()*/

                });

            };

            vm.init = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                entityViewerDataService.setEntityType($scope.$parent.vm.entityType);

                vm.getView();

            };

            vm.init();
        }

    }()
);