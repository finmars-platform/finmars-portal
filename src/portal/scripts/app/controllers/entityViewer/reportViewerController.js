/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var attributeTypeService = require('../../services/attributeTypeService');
        var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

        var entityViewerHelperService = require('../../services/entityViewerHelperService');
        var metaService = require('../../services/metaService');
        var entityViewerDataResolver = require('../../services/entityViewerDataResolver');
        var tablePartsService = require('../../services/groupTable/tablePartsService');

        var GroupTableService = require('../../services/groupTable/groupTableService');
        var reportSubtotalService = require('../../services/reportSubtotalService');
        var pricingPolicyService = require('../../services/pricingPolicyService');

        var reportHelper = require('../../helpers/reportHelper');
        var stringHelper = require('../../helpers/stringHelper');

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');


        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');
        var evDataHelper = require('../../helpers/ev-data.helper');
        var rvDataProviderService = require('../../services/rv-data-provider/rv-data-provider.service');


        module.exports = function ($scope, $mdDialog) {

            var vm = this;
            vm.options = {};

            vm.isReport = false;
            vm.tableIsReady = false;

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

                    if (res.results.length) {

                        vm.listView = res.results[0];

                        if (res.results[0].data.hasOwnProperty('table') && Object.keys(res.results[0].data.table).length) {

                            vm.options = Object.assign(vm.options, res.results[0].data.table, res.results[0].tableAdditions);
                            vm.options.entityType = vm.entityType;

                        } else {

                            vm.options = Object.assign(vm.options, res.results[0].data);

                        }


                    } else {

                        console.log('default triggered');

                        var defaultList = uiService.getDefaultListLayout();

                        vm.options = Object.assign(vm.options, defaultList[0].data);

                    }


                    var reportOptions = entityViewerDataService.getReportOptions();
                    var newReportOptions = Object.assign({}, reportOptions, vm.options.reportOptions);

                    entityViewerDataService.setReportOptions(newReportOptions);

                    entityViewerDataService.setColumns(vm.options.columns);
                    entityViewerDataService.setGroups(vm.options.grouping);
                    entityViewerDataService.setFilters(vm.options.filters);

                    vm.options.components = {
                        sidebar: true,
                        groupingArea: true,
                        columnAreaHeader: true,
                        splitPanel: true,
                        addEntityBtn: true,
                        fieldManagerBtn: true,
                        layoutManager: true,
                        autoReportRequest: false
                    };

                    entityViewerDataService.setComponents(vm.options.components);
                    entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                    entityViewerDataService.setRootEntityViewer(true);

                    if (vm.options.components.layoutManager === true) {
                        vm.saveLayoutAsManager();
                        vm.saveLayoutManager();
                    }

                    vm.tableIsReady = true;

                    console.log('vm', vm);

                    rvDataProviderService.requestReport(entityViewerDataService, entityViewerEventService);

                    $scope.$apply()

                });

            };

            vm.openDataViewPanel = function () {

                var additions = {
                    additionsState: true,
                    reportWizard: true,
                    editor: false,
                    permissionEditor: false
                };

                entityViewerDataService.setAdditions(additions);
                entityViewerEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

            };

            vm.openPermissionEditor = function () {

                var additions = {
                    additionsState: true,
                    reportWizard: false,
                    editor: false,
                    permissionEditor: true
                };

                entityViewerDataService.setAdditions(additions);
                entityViewerEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

            };

            vm.openEditorViewPanel = function () {

                var additions = {
                    additionsState: true,
                    reportWizard: false,
                    editor: true,
                    permissionEditor: false
                };

                entityViewerDataService.setAdditions(additions);
                entityViewerEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);


            };

            vm.hideAdditions = function () {

                var additions = {
                    additionsState: false,
                    reportWizard: false,
                    editor: false,
                    permissionEditor: false
                };

                entityViewerDataService.setAdditions(additions);
                entityViewerEventService.dispatchEvent(evEvents.ADDITIONS_CHANGE);

            };

            vm.saveLayoutAsManager = function () {
                $('.save-layout-as-btn').unbind('click');
                $('.save-layout-as-btn').bind('click', function (e) {

                    // saving columns widths
                    var tHead = $('.g-columns-component');
                    var th = $('.g-columns-component.g-thead').find('.g-cell');
                    var thWidths = [];
                    for (var i = 0; i < th.length; i = i + 1) {
                        var thWidth = $(th[i]).width();
                        thWidths.push(thWidth);
                    }

                    vm.options.columns = entityViewerDataService.getColumns();
                    vm.options.grouping = entityViewerDataService.getGroups();
                    vm.options.filters = entityViewerDataService.getFilters();

                    vm.options.reportOptions = JSON.parse(JSON.stringify(entityViewerDataService.getReportOptions()));

                    delete vm.options.reportOptions.items;
                    delete vm.options.reportOptions.item_complex_transactions;
                    delete vm.options.reportOptions.item_counterparties;
                    delete vm.options.reportOptions.item_responsibles;
                    delete vm.options.reportOptions.item_strategies3;
                    delete vm.options.reportOptions.item_strategies2;
                    delete vm.options.reportOptions.item_strategies1;
                    delete vm.options.reportOptions.item_portfolios;
                    delete vm.options.reportOptions.item_instruments;
                    delete vm.options.reportOptions.item_instrument_pricings;
                    delete vm.options.reportOptions.item_instrument_accruals;
                    delete vm.options.reportOptions.item_currency_fx_rates;
                    delete vm.options.reportOptions.item_currencies;
                    delete vm.options.reportOptions.item_accounts;

                    vm.options.columnsWidth = thWidths;

                    vm.listView = {data: {}};
                    vm.listView.data.table = vm.options;

                    $mdDialog.show({
                        controller: 'UiLayoutSaveAsDialogController as vm',
                        templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
                        parent: angular.element(document.body),
                        targetEvent: e,
                        locals: {
                            options: {}
                        },
                        clickOutsideToClose: false
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            if (vm.oldListView) {
                                vm.oldListView.is_default = false;

                                uiService.updateListLayout(vm.oldListView.id, vm.oldListView).then(function () {

                                }).then(function () {

                                    vm.listView.name = res.data.name;
                                    vm.listView.is_default = true;

                                    uiService.createListLayout(vm.entityType, vm.listView).then(function () {

                                        vm.getView();
                                    });

                                })

                            } else {

                                vm.listView.name = res.data.name;
                                vm.listView.is_default = true;

                                uiService.createListLayout(vm.entityType, vm.listView).then(function () {

                                    vm.getView();
                                });
                            }
                        }

                    });

                });
            };

            vm.saveLayoutManager = function () {
                $('.save-layout-btn').unbind('click');
                $('.save-layout-btn').bind('click', function (e) {

                    // saving columns widths
                    var tHead = $('.g-columns-component');
                    var th = $('.g-columns-component.g-thead').find('.g-cell');
                    var thWidths = [];
                    for (var i = 0; i < th.length; i = i + 1) {
                        var thWidth = $(th[i]).width();
                        thWidths.push(thWidth);
                    }

                    vm.options.columns = entityViewerDataService.getColumns();
                    vm.options.grouping = entityViewerDataService.getGroups();
                    vm.options.filters = entityViewerDataService.getFilters();

                    vm.options.reportOptions = JSON.parse(JSON.stringify(entityViewerDataService.getReportOptions()));

                    delete vm.options.reportOptions.items;
                    delete vm.options.reportOptions.item_complex_transactions;
                    delete vm.options.reportOptions.item_counterparties;
                    delete vm.options.reportOptions.item_responsibles;
                    delete vm.options.reportOptions.item_strategies3;
                    delete vm.options.reportOptions.item_strategies2;
                    delete vm.options.reportOptions.item_strategies1;
                    delete vm.options.reportOptions.item_portfolios;
                    delete vm.options.reportOptions.item_instruments;
                    delete vm.options.reportOptions.item_instrument_pricings;
                    delete vm.options.reportOptions.item_instrument_accruals;
                    delete vm.options.reportOptions.item_currency_fx_rates;
                    delete vm.options.reportOptions.item_currencies;
                    delete vm.options.reportOptions.item_accounts;

                    vm.options.columnsWidth = thWidths;

                    if (!vm.listView) {
                        vm.listView = {data: {}};
                    }
                    vm.listView.data = vm.options;

                    if (vm.listView.hasOwnProperty('id')) {
                        uiService.updateListLayout(vm.listView.id, vm.listView)
                    } else {
                        uiService.createListLayout(vm.entityType, vm.listView)
                    }

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        targetEvent: e,
                        clickOutsideToClose: true
                    }).then(function () {
                        vm.getView();
                    });


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