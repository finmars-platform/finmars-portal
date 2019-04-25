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

        var stringHelper = require('../../helpers/stringHelper');

        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');

        var expressionService = require('../../services/expression.service');

        module.exports = function ($scope, $mdDialog, $transitions) {

            var vm = this;

            vm.listViewIsReady = false;

            var activeLayoutConfigString = {};
            var activeLayoutHash = '';

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

                    entityViewerDataService.setLayoutCurrentConfiguration(res, uiService, true);

                    var reportOptions = entityViewerDataService.getReportOptions();
                    var reportLayoutOptions = entityViewerDataService.getReportLayoutOptions();

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

                                rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                                $scope.$apply();

                                activeLayoutConfigString = JSON.stringify(entityViewerDataService.getListLayout());

                            });


                        } else {

                            vm.listViewIsReady = true;

                            rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                            $scope.$apply();

                            activeLayoutConfigString = JSON.stringify(entityViewerDataService.getListLayout());
                            activeLayoutHash = stringHelper.toHash(activeLayoutConfigString);

                        }
                    // < Check if there is need to solve report datepicker expression >
                    } else {

                        vm.listViewIsReady = true;

                        rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                        $scope.$apply();

                        activeLayoutConfigString = JSON.stringify(entityViewerDataService.getListLayout());
                        activeLayoutHash = stringHelper.toHash(activeLayoutConfigString);

                    }

                });

            };

            vm.init = function () {

                vm.entityType = $scope.$parent.vm.entityType;
                entityViewerDataService.setEntityType($scope.$parent.vm.entityType);

                vm.getView();

            };

            vm.init();

            var checkLayoutForChanges = function (transition) {
                var stateName = transition.to().name;

                if (stateName !== transition.from().name) {

                    var layoutCurrentConfigString = JSON.parse(JSON.stringify(entityViewerDataService.getLayoutCurrentConfiguration(true)));
                    delete layoutCurrentConfigString.data.reportOptions.task_id;
                    layoutCurrentConfigString = JSON.stringify(layoutCurrentConfigString);

                    activeLayoutConfigString = JSON.parse(activeLayoutConfigString);
                    delete activeLayoutConfigString.data.reportOptions.task_id;
                    activeLayoutConfigString = JSON.stringify(activeLayoutConfigString);

                    activeLayoutHash = stringHelper.toHash(activeLayoutConfigString);
                    var layoutCurrentConfigHash = stringHelper.toHash(layoutCurrentConfigString);

                    if (activeLayoutHash !== layoutCurrentConfigHash) {

                        return new Promise (function (resolve, reject) {

                            $mdDialog.show({
                                controller: 'LayoutChangesLossWarningDialogController as vm',
                                templateUrl: 'views/dialogs/layout-changes-loss-warning-dialog.html',
                                parent: angular.element(document.body),
                                preserveScope: true,
                                autoWrap: true,
                                multiple: true
                            }).then(function (res, rej) {

                                if (res.status === 'save_layout') {

                                    var layoutCurrentConfig = JSON.parse(layoutCurrentConfigString);

                                    if (layoutCurrentConfig.hasOwnProperty('id')) {

                                        uiService.updateListLayout(layoutCurrentConfig.id, layoutCurrentConfig).then(function () {
                                            resolve(true);
                                        });

                                    } else {

                                        uiService.createListLayout(vm.entityType, layoutCurrentConfig).then(function () {
                                            resolve(true);
                                        });

                                    }

                                } else if ('do_not_save_layout') {

                                    resolve(true);

                                }

                            }).catch(function () {
                                reject();
                            });
                        });

                    }
                }

            };

            var doBeforeStateChange = $transitions.onBefore({}, checkLayoutForChanges);

            this.$onDestroy = function () {
                doBeforeStateChange();
            }
        }

    }()
);