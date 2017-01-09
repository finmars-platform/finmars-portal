/**
 /**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

        'use strict';

        var logService = require('../../../../../core/services/logService');

        var attributeTypeService = require('../../services/attributeTypeService');
        var dynamicAttributesForReportsService = require('../../services/groupTable/dynamicAttributesForReportsService');

        var entityViewerHelperService = require('../../services/entityViewerHelperService');
        var metaService = require('../../services/metaService');
        var entityViewerDataResolver = require('../../services/entityViewerDataResolver');
        var tablePartsService = require('../../services/groupTable/tablePartsService');

        var GroupTableService = require('../../services/groupTable/groupTableService');
        var reportSubtotalService = require('../../services/reportSubtotalService');
        var pricingPolicyService = require('../../services/pricingPolicyService');

        var uiService = require('../../services/uiService');

        module.exports = function ($scope, $mdDialog) {

            logService.controller('EntityViewerController', 'initialized');


            var vm = this;
            vm.options = {};
            vm.reportOptions = {};

            vm.updateConfig = function () {

                setTimeout(function () {

                    vm.options = {

                        columns: vm.columns,
                        columnsWidth: vm.columnsWidth,

                        grouping: vm.grouping,
                        filters: vm.filters,
                        sorting: vm.sorting,
                        folding: vm.folding,

                        entityType: vm.entityType,
                        isRootEntityViewer: vm.isRootEntityViewer,
                        isReport: vm.isReport,

                        tableIsReady: vm.tableIsReady,
                        reportIsReady: vm.reportIsReady,

                        externalCallback: vm.updateTable,
                        additionsStatus: vm.additionsStatus,
                        additionsState: vm.additionsState,

                        editorTemplate: vm.editorTemplate,
                        editorEntityId: vm.editorEntityId


                    };

                    $scope.$apply();

                    console.log('vm.options', vm.options);

                }, 0)

            };

            vm.updateVm = function (options) {

                setTimeout(function () {

                    var keys = Object.keys(options);

                    keys.forEach(function (key) {

                        vm[key] = options[key];
                    });

                    $scope.$apply();

                }, 0);
            };


            console.log('------------------------ EV scope -----------------------------', $scope);

            vm.returnFullAttributes = function (items, attrs, baseAttrs, entityAttrs, entityType) {
                var fullItems = [];
                if (!items) {
                    return [];
                }
                //console.log('vm.returnFullAttributes attributes:', attrs, items);
                var i, a, b, e, item, attr, baseAttr, attrOptions, entityAttr, report_settings, reportAttrs;
                var reportDynamicAttrsReady = false;
                for (i = 0; i < items.length; i = i + 1) {
                    item = items[i];
                    if (item.hasOwnProperty('id')) {

                        if (vm.isReport == true) {
                            console.log('reportAttrs data is', vm.reportAttrs);
                            vm.reportAttrs.map(function (repAttr) {
                                if (item.r_entityType === repAttr.r_entityType && item.id === repAttr.id) {
                                    if (item.options) {
                                        attrOptions = JSON.parse(JSON.stringify(item.options));
                                    }
                                    if (item.report_settings) {
                                        report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                    }
                                    item = repAttr;
                                    item.options = attrOptions;
                                    item.report_settings = report_settings;
                                    fullItems.push(item);
                                }
                            });
                        }
                        else {
                            for (a = 0; a < attrs.length; a = a + 1) {
                                attr = attrs[a];

                                if (item.id === attr.id) {
                                    console.log("fullattributes this isn't report");
                                    if (item.options) {
                                        attrOptions = JSON.parse(JSON.stringify(item.options));
                                    }
                                    if (item.report_settings) {
                                        report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                    }
                                    item = attr;
                                    item.options = attrOptions;
                                    item.report_settings = report_settings;
                                    fullItems.push(item);
                                }
                            }
                        }
                    } else {
                        //console.log('returnattribute without id', item);
                        for (b = 0; b < baseAttrs.length; b = b + 1) {
                            baseAttr = baseAttrs[b];
                            if (item.key === baseAttr.key) {
                                if (item.options) {
                                    attrOptions = JSON.parse(JSON.stringify(item.options));
                                }
                                if (item.report_settings) {
                                    report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                }
                                item = baseAttr;
                                item.options = attrOptions;
                                item.report_settings = report_settings;
                                fullItems.push(item);
                            }
                        }

                        for (e = 0; e < entityAttrs.length; e = e + 1) {
                            entityAttr = entityAttrs[e];
                            if (item.key === entityAttr.key) {
                                if (item.options) {
                                    attrOptions = JSON.parse(JSON.stringify(item.options));
                                }
                                if (item.report_settings) {
                                    report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                }
                                item = entityAttr;
                                item.options = attrOptions;
                                item.report_settings = report_settings;
                                fullItems.push(item);
                            }
                        }
                    }
                }
                //console.log('vm.returnfullattributes fullItems', fullItems);
                return fullItems;

            };

            vm.findFullAttributeForItem = function (item, attrs) {
                if (item.hasOwnProperty('id')) {
                    var i;
                    for (i = 0; i < attrs.length; i = i + 1) {
                        var sort = item.sort;
                        if (item.id === attrs[i].id) {
                            item = attrs[i];
                            item.sort = sort;
                        }
                    }
                }
                return item;
            }; // TODO refactor, move to service

            vm.checkReadyStatus = function () {
                if (vm.tableIsReady == true && vm.readyStatus.uiView == true) {
                    return true;
                }
                return false;
            };


            vm.getView = function () {

                var handler = function (res) {

                    if (res.results.length) {
                        vm.listView = res.results[0];

                        vm.oldListView = JSON.parse(JSON.stringify(vm.listView));

                        vm.table = res.results[0].data.table;
                        vm.columns = res.results[0].data.table.columns;
                        vm.columnsWidth = res.results[0].data.table.columnsWidth;
                        vm.grouping = res.results[0].data.table.grouping;
                        vm.folding = res.results[0].data.table.folding;
                        vm.filters = res.results[0].data.table.filters;
                        vm.sorting = res.results[0].data.table.sorting;

                        logService.collection('vm.columns', vm.columns);

                        vm.additionsType = res.results[0].data.tableAdditions.additionsType;

                        vm.additionsStatus = res.results[0].data.tableAdditions.additionsStatus || {
                                editor: false,
                                table: false,
                                permissionEditor: false,
                                extraFeatures: []
                            };

                        vm.additionsState = res.results[0].data.tableAdditions.additionsState;

                        vm.tableAdditions = res.results[0].data.tableAdditions;
                        vm.entityAdditionsColumns = res.results[0].data.tableAdditions.table.columns;
                        vm.entityAdditionsFilters = res.results[0].data.tableAdditions.table.filters;
                        vm.entityAdditionsSorting = res.results[0].data.tableAdditions.table.sorting;

                        vm.updateConfig();

                        //vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;
                    } else {

                        var defaultList = uiService.getDefaultListLayout();

                        vm.listView = defaultList[0];

                        vm.table = defaultList[0].data.table;
                        vm.columns = defaultList[0].data.table.columns;
                        vm.columnsWidth = defaultList[0].data.table.columnsWidth;
                        vm.grouping = defaultList[0].data.table.grouping;
                        vm.folding = defaultList[0].data.table.folding;
                        vm.filters = defaultList[0].data.table.filters;
                        vm.sorting = defaultList[0].data.table.sorting;

                        logService.collection('vm.columns', vm.columns);

                        vm.additionsType = defaultList[0].data.tableAdditions.additionsType;

                        vm.additionsEntityType = defaultList[0].data.tableAdditions.entityType;

                        vm.tableAdditions = defaultList[0].data.tableAdditions;
                        vm.entityAdditionsColumns = defaultList[0].data.tableAdditions.table.columns;
                        vm.entityAdditionsFilters = defaultList[0].data.tableAdditions.table.filters;
                        vm.entityAdditionsSorting = defaultList[0].data.tableAdditions.table.sorting;

                        vm.updateConfig();

                        //vm.additionsStatus[defaultList[0].data.tableAdditions.additionsType] = true;
                    }


                    vm.readyStatus.uiView = true;

                    //console.log('vm tabs!', vm.tabs);
                    $scope.$apply();
                };

                console.log('vm.uiLayoutId', vm.uiLayoutId);
                if (vm.uiLayoutId !== null && vm.uiLayoutId !== undefined) {
                    return uiService.getListLayoutByKey(vm.uiLayoutId).then(function (data) {
                        handler({results: [data]});
                    });
                } else {
                    return uiService.getActiveListLayout(vm.entityType).then(handler);
                }


            }; // TODO refactor

            vm.checkIfPermissionEditorAllowed = function () {
                return true;
            }

            vm.transformViewAttributes = function () { //deprecated

                vm.columns = vm.returnFullAttributes(vm.columns, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
                vm.grouping = vm.returnFullAttributes(vm.grouping, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
                vm.filters = vm.returnFullAttributes(vm.filters, vm.attrs, vm.baseAttrs, vm.entityAttrs, vm.entityType);
                vm.sorting.group = vm.findFullAttributeForItem(vm.sorting.group, vm.attrs);
                vm.sorting.column = vm.findFullAttributeForItem(vm.sorting.column, vm.attrs);

                logService.collection('vm.grouping', vm.grouping);
                logService.collection('vm.columns', vm.columns);

                vm.updateConfig();
            };

            vm.getAttributes = function () {
                return attributeTypeService.getList(vm.entityType).then(function (data) {
                    vm.attrs = data.results;
                    if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(vm.entityType) == -1) {
                        vm.baseAttrs = metaService.getBaseAttrs();
                    }
                    vm.entityAttrs = metaService.getEntityAttrs(vm.entityType) || [];
                    $scope.$apply();
                })
            };

            vm.itemFilterHasOwnProperty = function (item, filter) {

                //console.log('item', item);
                //console.log('filter', filter);

                if (filter.hasOwnProperty('key')) {
                    if (item.hasOwnProperty(filter.key)) {
                        return true;
                    }
                }

                if (filter.hasOwnProperty('id')) {
                    if (item.hasOwnProperty(filter.r_entityType + '_attribute_' + filter.source_name)) {
                        return true;
                    }
                }

                return false;

            }; // TODO refactor, move to service


            vm.getProjection = function () {


                //console.log('vm.entity---------' + vm.options.isRootEntityViewer + '------------------------', JSON.parse(JSON.stringify(vm.entity)));
                //console.log('vm.entity---------' + vm.options.isRootEntityViewer + '------------------------', JSON.parse(JSON.stringify(vm.groupTableService.projection())));
                //console.log('-----------------------------------------------------------------------------');


                var x;
                return vm.groupTableService.projection();
            };

            vm.originalData = [];

            vm.updateTable = function (params) {

                var reportHandler = function (data) {

                    vm.reportOptions = data;
                    vm.reportOptions.currency = data.report_currency;

                    if (data.task_status !== 'SUCCESS') {

                        setTimeout(function () {
                            vm.updateTable();
                        }, 1000)
                    } else {

                        vm.originalData = JSON.parse(JSON.stringify(data)); // store server response data untouched

                        console.log('vm.originalData1231312312', vm.originalData);

                        vm.reportOptions.task_id = null;

                        var filteredData = data.items;

                        filteredData = vm.groupTableService.extractDynamicAttributes(filteredData);

                        var isFiltersExist = false;
                        var isFiltersEnabled = false;

                        if (vm.filters.length > 0) {
                            isFiltersExist = true;

                            vm.filters.forEach(function (item) {
                                if (item.options !== undefined && item.options.enabled == true) {

                                    if (item.value_type == 'field' && item.options.query !== undefined && item.options.query.length > 0) {
                                        isFiltersEnabled = true;
                                    }
                                    if (item.value_type == 'float' && item.options.query !== undefined && (item.options.query + '').length > 0) {
                                        isFiltersEnabled = true;
                                    }

                                    if (item.value_type == 10 && item.options.query !== undefined && (item.options.query + '').length > 0) {
                                        isFiltersEnabled = true;
                                    }
                                }
                            });
                        }

                        if (isFiltersExist == true && isFiltersEnabled == true) {

                            filteredData = [];

                            var itemsRepository = data.items;

                            vm.filters.forEach(function (filterItem, $index) {

                                var localFilteredData = [];

                                if (filterItem.options !== undefined && filterItem.options.enabled == true) {

                                    itemsRepository.forEach(function (item) {

                                        if (vm.itemFilterHasOwnProperty(item, filterItem)) {

                                            if (filterItem.value_type == 'field') {

                                                if (filterItem.options.query !== undefined && filterItem.options.query.length) {
                                                    var matched = false;

                                                    filterItem.options.query.forEach(function (queryItem) {
                                                        if (item[filterItem.key] == queryItem) {
                                                            matched = true;
                                                        }
                                                    });

                                                    if (matched) {
                                                        localFilteredData.push(item);
                                                    }
                                                } else {
                                                    localFilteredData.push(item);
                                                }

                                            }

                                            if (filterItem.value_type == 'float') {
                                                if (filterItem.options.query !== undefined) {
                                                    if (item[filterItem.key] == parseFloat(filterItem.options.query)) {
                                                        localFilteredData.push(item);
                                                    }
                                                } else {
                                                    localFilteredData.push(item);
                                                }
                                            }

                                            //console.log('filterItem', filterItem);

                                            if (filterItem.value_type == 10) {

                                                //console.log('item', item);

                                                var _name = filterItem.r_entityType + '_attribute_' + filterItem.source_name;

                                                if (filterItem.options.query !== undefined) {
                                                    if (item[_name].indexOf(filterItem.options.query) !== -1) {
                                                        localFilteredData.push(item);
                                                    }
                                                } else {
                                                    localFilteredData.push(item);
                                                }
                                            }

                                            //if(item[filterItem.key] == filterItem.otions.query[0])
                                        }

                                    });

                                    //console.log('localFilteredData', localFilteredData);
                                    //console.log('itemsRepository', itemsRepository);

                                    itemsRepository = localFilteredData;
                                }
                            });

                            filteredData = itemsRepository;
                        }

                        entityViewerHelperService.transformItems(filteredData, vm.attrs).then(function (data) {

                            var entity = data;

                            //console.log('vm.entityItems', vm.entity);

                            vm.reportIsReady = true;

                            if (vm.entityType == 'balance-report') {
                                entity = reportSubtotalService.groupByAndCalc(entity, vm.reportOptions);
                            }

                            vm.groupTableService.setItems(entity);

                            vm.groupTableService.columns.setColumns(vm.columns);
                            //vm.groupTableService.filtering.setFilters(vm.filters);
                            vm.groupTableService.grouping.setGroupsWithColumns(vm.grouping, vm.columns, vm.entityType);
                            //console.log("EXTERNAL CALLBACK ", vm.folding);
                            vm.groupTableService.folding.setFolds(vm.folding);
                            //console.log('UPDATE TABLE scope.sorting.group', vm.sorting.group);
                            vm.sorting.group = vm.findFullAttributeForItem(vm.sorting.group, vm.attrs);
                            //vm.sorting.column = vm.findFullAttributeForItem(vm.sorting.column, vm.attrs);
                            vm.groupTableService.sorting.group.sort(vm.sorting.group);
                            //vm.groupTableService.sorting.column.sort(vm.sorting.column);
                            vm.tableIsReady = true;

                            vm.updateConfig();

                            $scope.$apply();
                        });
                    }
                };
                var handler = function (data) {

                    vm.originalData = JSON.parse(JSON.stringify(data)); // store server response data untouched

                    vm.paginationItemsTotal = data.count;
                    vm.nextExist = !!data.next;
                    vm.previousExist = !!data.previous;

                    entityViewerHelperService.transformItems(data.results, vm.attrs).then(function (data) {

                        var entity = data;
                        entity = entity.map(function (item) {
                            item.date_formatted = moment(new Date(item.created)).format('DD/MM/YYYY');

                            if (vm.entityType == 'audit-transaction' || vm.entityType == 'audit-instrument') {
                                item.username = item.member.username;
                            }
                            return item;
                        });

                        //console.log('audit transaction data is', vm.entity);
                        vm.groupTableService.setItems(entity);

                        vm.groupTableService.columns.setColumns(vm.columns);
                        //vm.groupTableService.filtering.setFilters(vm.filters);
                        vm.groupTableService.grouping.setGroups(vm.grouping, vm.entityType);
                        //console.log("EXTERNAL CALLBACK ", vm.folding);
                        vm.groupTableService.folding.setFolds(vm.folding);
                        //console.log('UPDATE TABLE scope.sorting.group', vm.sorting.group);
                        vm.sorting.group = vm.findFullAttributeForItem(vm.sorting.group, vm.attrs);
                        //vm.sorting.column = vm.findFullAttributeForItem(vm.sorting.column, vm.attrs);
                        vm.groupTableService.sorting.group.sort(vm.sorting.group);
                        //vm.groupTableService.sorting.column.sort(vm.sorting.column);
                        vm.tableIsReady = true;

                        vm.updateConfig();

                        $scope.$apply();
                    });
                };

                var optionsHandler = function (entityType, isReport) {

                    isReport = isReport || false;

                    if (isReport == true) {

                        vm.reportOptions.custom_fields = [];

                        vm.columns.forEach(function (column) {

                            if (column.hasOwnProperty('columnType') && column.columnType == 'custom-field') {
                                vm.reportOptions.custom_fields.push(column.id);
                            }
                        });

                        vm.reportIsReady = false;

                        return options
                    }

                    if (vm.entityType === 'audit-transaction') {

                        options = {
                            sort: {
                                key: vm.sorting.column.key,
                                direction: vm.sorting.column.sort
                            },
                            filters: {'content_type': 'transactions.transaction'},
                            page: vm.paginationPageCurrent,
                            pageSize: vm.paginationItemPerPage
                        };

                        vm.reportIsReady = true;

                        vm.filters.forEach(function (item) {
                            if (item.options && item.options.enabled === true) {
                                options.filters[item.key] = item.options.query;
                            }
                        });

                        return options
                    }

                    if (vm.entityType === 'audit-instrument') {

                        options = {
                            sort: {
                                key: vm.sorting.column.key,
                                direction: vm.sorting.column.sort
                            },
                            filters: {'content_type': 'instruments.instrument'},
                            page: vm.paginationPageCurrent,
                            pageSize: vm.paginationItemPerPage
                        };

                        vm.reportIsReady = true;

                        //console.log('vm.filters', vm.filters);

                        vm.filters.forEach(function (item) {
                            if (item.options && item.options.enabled === true) {
                                options.filters[item.key] = item.options.query;
                            }
                        });

                        return options;

                    }

                    options = {
                        sort: {
                            key: vm.sorting.column.key,
                            direction: vm.sorting.column.sort
                        },
                        filters: {},
                        page: vm.paginationPageCurrent,
                        pageSize: vm.paginationItemPerPage
                    };

                    vm.reportIsReady = true;

                    vm.filters.forEach(function (item) {
                        if (item.options && item.options.enabled === true) {
                            options.filters[item.key] = item.options.query;
                        }
                    });

                    return options;

                };

                var options = optionsHandler(vm.entityType, vm.isReport);

                console.trace();
                //console.log('params', params);
                var defaultParams = {
                    redraw: true,
                    silent: false,
                    options: {}
                };

                var _params = Object.assign(defaultParams, params);

                console.log('_params', _params);

                vm.updateVm(_params.options);

                if (_params.redraw == true) {

                    if (vm.isReport == true) {

                        if (_params.silent == true) {
                            reportHandler(vm.originalData)
                        } else {
                            entityViewerDataResolver.getList(vm.entityType, vm.reportOptions).then(function (data) {
                                reportHandler(data);
                            })
                        }

                    } else {
                        if (_params.silent == true) {
                            handler(vm.originalData);
                        } else {
                            entityViewerDataResolver.getList(vm.entityType, options).then(function (data) {
                                handler(data);
                            })
                        }
                    }
                } else {
                    vm.updateConfig();
                }

            };

            vm.addEntity = function (ev) {
                //console.log('Add entity dialog have been activated');
                $mdDialog.show({
                    controller: 'EntityViewerAddDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    //clickOutsideToClose: true,
                    locals: {
                        parentScope: $scope
                    }
                }).then(function () {
                    vm.updateTable({test: 'ololo'});
                })
            };

            vm.openCustomAdditionsView = function ($event, customButton) {
                vm.additionsStatus.reportWizard = false;
                vm.additionsStatus.table = false;
                vm.additionsState = true;
                vm.additionsStatus.extraFeatures.forEach(function (item) {
                    item.isOpened = false;
                    if (item.id === customButton.id) {
                        item.isOpened = true;
                    }
                });
                console.log('vm.additionsStatus.extraFeatures', vm.additionsStatus.extraFeatures);

                vm.updateConfig();

            };

            vm.openDataViewPanel = function () {

                vm.additionsStatus.editor = false;
                vm.additionsStatus.permissionEditor = false;
                vm.additionsState = true;
                vm.additionsStatus.extraFeatures.forEach(function (item) {
                    item.isOpened = false;
                });
                vm.additionsStatus.reportWizard = true;

                vm.updateConfig();

            };

            vm.openPermissionEditor = function () {
                vm.additionsStatus.editor = false;
                vm.additionsStatus.reportWizard = false;
                vm.additionsState = true;

                vm.additionsStatus.extraFeatures.forEach(function (item) {
                    item.isOpened = false;
                });

                vm.additionsStatus.permissionEditor = true;

                vm.updateConfig();

            };

            vm.openEditorViewPanel = function () {

                vm.additionsStatus.editor = true;
                vm.additionsState = true;
                vm.additionsStatus.extraFeatures.forEach(function (item) {
                    item.isOpened = false;
                });
                vm.additionsStatus.reportWizard = false;
                vm.additionsStatus.permissionEditor = false;

                vm.updateConfig();
            };

            vm.checkAdditionStatus = function () {
                if (!vm.additionsStatus.reportWizard && !vm.additionsStatus.editor && !vm.additionsStatus.permissionEditor) {
                    //vm.editorEntityId = undefined;
                    return true;
                }
                return false;
            };

            vm.hideAdditions = function () {
                vm.additionsState = false;
                vm.additionsStatus.reportWizard = false;
                vm.additionsStatus.editor = false;
                vm.additionsStatus.permissionEditor = false;

                //vm.editorEntityId = undefined;

                vm.updateConfig();
            };

            vm.getReport = function () {

                console.log('getReport, vm', vm);

                pricingPolicyService.getList().then(function (data) {

                    vm.reportOptions = {
                        cost_method: 1,
                        pricing_policy: data.results[0].id
                    };

                    vm.readyStatus.reportOptions = true;

                    vm.getView().then(function () {
                        vm.getAttributes().then(function () {
                            vm.transformViewAttributes();
                            debugger;
                            vm.updateTable();
                        });
                    });

                })

            };

            vm.checkOnBeforeLoadAction = function () {

                if (vm.onBeforeLoadAction && vm.onBeforeLoadActionFinish == false) {
                    return true;
                }

                if (vm.onBeforeLoadAction && vm.onBeforeLoadActionFinish == true) {
                    return false;
                }

                return false;

            };

            // entityViewer initialization
            // resolving is instance of entityViewer root
            // settings all props depends of root/child

            (function ResolveEntityViewer() {

                if ($scope.$parent.options && $scope.$parent.options.additionsState == true) { // nested EntityViewer

                    (function SetPropsForEntityViewer() {

                        vm.oldListView = null;

                        // TODO make onBeforeActionResolver

                        if ($scope.$parent.options.additionsStatus.reportWizard == true) {
                            vm.onBeforeLoadAction = 'views/entity-viewer/report-wizard-view.html';
                        }
                        vm.onBeforeLoadActionFinish = false; // will be updated from onBeforeLoadAction controller, when it finish

                        vm.paginationPageCurrent = 1;
                        vm.paginationItemPerPage = 20;
                        vm.paginationItemsTotal = 0;

                        // ATTRIBUTE STUFF START

                        vm.isRootEntityViewer = false;

                        vm.attrs = [];
                        vm.baseAttrs = [];
                        vm.layoutAttrs = [];
                        vm.entityAttrs = [];

                        // ENTITY STUFF START

                        //vm.entityType = $scope.$parent.vm.entityType;
                        //vm.isReport = $scope.$parent.vm.isReport || false;

                        //console.log('vm.isReport', vm.isReport);

                        //vm.customButtons = $scope.$parent.vm.entityViewer.extraFeatures;
                        vm.groupTableService = GroupTableService.getInstance(true, 'child');

                        vm.columns = [];
                        vm.columnsWidth = [];
                        vm.grouping = [];
                        vm.filters = [];
                        vm.sorting = [];

                        // ENTITY ADDITIONS STUFF START

                        vm.entityAdditions = [];
                        vm.additionsType = '';
                        vm.additionsEntityType = '';

                        vm.entityAdditionsColumns = [];
                        vm.entityAdditionsFilters = [];
                        vm.entityAdditionsSorting = [];

                        // OTHER STUFF START

                        vm.tabs = [];
                        vm.table = {};
                        vm.tableAdditions = {};

                        vm.tableIsReady = false;
                        vm.readyStatus = {uiView: false};

                        vm.editorTemplate = 'views/additions-editor-view.html';

                        vm.additionsStatus = {
                            editor: false,
                            table: false,
                            permissionEditor: false,
                            extraFeatures: []
                        };
                        vm.additionsState = false;
                        vm.additionsStatus.extraFeatures = vm.customButtons;

                        vm.reportIsReady = false;

                        vm.reportAttrs = [];	//	array of reports's dynamic attributes

                        dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {
                            vm.reportAttrs = data;
                        });

                        //if (vm.isReport == true) {
                        //    pricingPolicyService.getList().then(function (data) {
                        //
                        //        vm.reportOptions = {
                        //            cost_method: 1,
                        //            pricing_policy: data.results[0].id
                        //        };
                        //
                        //        vm.getView().then(function () {
                        //            vm.getAttributes().then(function () {
                        //                vm.transformViewAttributes();
                        //                vm.updateTable();
                        //            });
                        //        });
                        //
                        //    })
                        //} else {
                        //    vm.getView().then(function () {
                        //        vm.getAttributes().then(function () {
                        //            vm.transformViewAttributes();
                        //            vm.updateTable();
                        //        });
                        //    });
                        //}

                        //vm.tableParts = tablePartsService.setTablePartsSettings(vm.entityType);

                        $scope.$on("$destroy", function (event) {

                            logService.controller('EntityViewerController', 'destroyed');

                        });

                    }());

                } else { // root EntityViewer
                    (function SetPropsForRootEntityViewer() {

                        vm.oldListView = null;

                        vm.onBeforeLoadAction = false; // no before action for root, for now
                        vm.onBeforeLoadActionFinish = true; // will be updated from onBeforeLoadAction controller, when it finish

                        $('.save-layout-as-btn').bind('click', function (e) {

                            // saving columns widths
                            var tHead = $('.g-columns-component');
                            var th = $('.g-columns-component.g-thead').find('.g-cell');
                            var thWidths = [];
                            for (var i = 0; i < th.length; i = i + 1) {
                                var thWidth = $(th[i]).width();
                                thWidths.push(thWidth);
                            }


                            vm.listView.data.table.columnsWidth = thWidths;

                            //console.log("View data is ", vm.listView.data);
                            vm.listView.data.table = vm.table;
                            vm.listView.data.table.columns = vm.columns;
                            // vm.listView.data.table.columns['cellWidth']
                            //console.log('---------vm.grouping-------', vm.grouping);
                            vm.listView.data.table.grouping = vm.grouping;
                            vm.listView.data.table.folding = vm.folding;
                            vm.listView.data.table.filters = vm.filters;
                            vm.listView.data.table.sorting = vm.sorting;

                            // vm.listView.data.table.cellWidth = 200;

                            vm.listView.data.additionsType = vm.additionsType;

                            vm.listView.data.tableAdditions.entityType = vm.additionsEntityType;

                            vm.listView.data.tableAdditions = vm.tableAdditions;
                            vm.listView.data.tableAdditions.table.columns = vm.entityAdditionsColumns;
                            vm.listView.data.tableAdditions.table.filters = vm.entityAdditionsFilters;
                            vm.listView.data.tableAdditions.table.sorting = vm.entityAdditionsSorting;
                            vm.listView.data.tableAdditions.additionsStatus = vm.additionsStatus;
                            vm.listView.data.tableAdditions.additionsState = vm.additionsState;

                            //vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;


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

                                if (res.status == 'agree') {

                                    if (vm.oldListView) {
                                        vm.oldListView.is_default = false;

                                        uiService.updateListLayout(vm.oldListView.id, vm.oldListView).then(function () {
                                            //console.log('saved');
                                        }).then(function () {

                                            vm.listView.name = res.data.name;
                                            vm.listView.is_default = true;

                                            uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                                                //console.log('saved');
                                                vm.getView();
                                            });

                                        })

                                    } else {

                                        vm.listView.name = res.data.name;
                                        vm.listView.is_default = true;

                                        uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                                            //console.log('saved');
                                            vm.getView();
                                        });
                                    }
                                }

                            });

                        });

                        $('.save-layout-btn').bind('click', function (e) {


                            // saving columns widths
                            var tHead = $('.g-columns-component');
                            var th = $('.g-columns-component.g-thead').find('.g-cell');
                            var thWidths = [];
                            for (var i = 0; i < th.length; i = i + 1) {
                                var thWidth = $(th[i]).width();
                                thWidths.push(thWidth);
                            }
                            vm.listView.data.table.columnsWidth = thWidths;
                            //console.log('entity viewer columnsWidth is', vm.listView.data.table.columnsWidth);

                            //console.log("View data is ", vm.listView.data);


                            vm.listView.data.table = vm.table;
                            vm.listView.data.table.columns = vm.columns;
                            // vm.listView.data.table.columns['cellWidth']
                            //console.log('---------vm.grouping-------', vm.grouping);
                            vm.listView.data.table.grouping = vm.grouping;
                            vm.listView.data.table.folding = vm.folding;
                            vm.listView.data.table.filters = vm.filters;
                            vm.listView.data.table.sorting = vm.sorting;

                            // vm.listView.data.table.cellWidth = 200;

                            vm.listView.data.additionsType = vm.additionsType;

                            vm.listView.data.tableAdditions.entityType = vm.additionsEntityType;

                            vm.listView.data.tableAdditions = vm.tableAdditions;
                            vm.listView.data.tableAdditions.table.columns = vm.entityAdditionsColumns;
                            vm.listView.data.tableAdditions.table.filters = vm.entityAdditionsFilters;
                            vm.listView.data.tableAdditions.table.sorting = vm.entityAdditionsSorting;
                            vm.listView.data.tableAdditions.additionsStatus = vm.additionsStatus;
                            vm.listView.data.tableAdditions.additionsState = vm.additionsState;

                            //vm.additionsStatus[res.results[0].data.tableAdditions.additionsType] = true;

                            //console.log('vm.listView', vm.listView);

                            if (vm.listView.hasOwnProperty('id')) {
                                uiService.updateListLayout(vm.listView.id, vm.listView).then(function () {
                                    //console.log('saved');
                                });
                            } else {
                                uiService.createListLayout(vm.entityType, vm.listView).then(function () {
                                    //console.log('saved');
                                });
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

                        vm.paginationPageCurrent = 1;
                        vm.paginationItemPerPage = 20;
                        vm.paginationItemsTotal = 0;

                        // ATTRIBUTE STUFF START

                        vm.isRootEntityViewer = true;

                        vm.attrs = [];
                        vm.baseAttrs = [];
                        vm.layoutAttrs = [];
                        vm.entityAttrs = [];

                        // ENTITY STUFF START
                        vm.entityType = $scope.$parent.vm.entityType;
                        vm.isReport = $scope.$parent.vm.isReport || false;

                        vm.customButtons = $scope.$parent.vm.entityViewer.extraFeatures;
                        vm.groupTableService = GroupTableService.getInstance(true, 'root');

                        vm.columns = [];
                        vm.columnsWidth = [];
                        vm.grouping = [];
                        vm.filters = [];
                        vm.sorting = [];

                        // ENTITY ADDITIONS STUFF START

                        vm.entityAdditions = [];
                        vm.additionsType = '';
                        vm.additionsEntityType = '';

                        // OTHER STUFF START

                        vm.tabs = [];
                        vm.table = {};
                        vm.tableAdditions = {};

                        vm.tableIsReady = false;
                        vm.readyStatus = {uiView: false};

                        vm.editorTemplate = 'views/additions-editor-view.html';

                        vm.additionsStatus = {
                            editor: false,
                            table: false,
                            permissionEditor: false,
                            extraFeatures: []
                        };

                        vm.additionsState = false;
                        vm.additionsStatus.extraFeatures = vm.customButtons;

                        vm.reportIsReady = false;

                        vm.reportAttrs = [];	//	array of reports's dynamic attributes

                        dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {
                            vm.reportAttrs = data;
                        });

                        if (vm.isReport == true) {
                            pricingPolicyService.getList().then(function (data) {

                                vm.reportOptions = {
                                    cost_method: 1,
                                    pricing_policy: data.results[0].id
                                };

                                vm.getView().then(function () {
                                    vm.getAttributes().then(function () {
                                        vm.transformViewAttributes();
                                        vm.updateTable();
                                    });
                                });

                            })
                        } else {
                            vm.getView().then(function () {
                                vm.getAttributes().then(function () {
                                    vm.transformViewAttributes();
                                    vm.updateTable();
                                });
                            });
                        }

                        vm.tableParts = tablePartsService.setTablePartsSettings(vm.entityType);

                        $scope.$on("$destroy", function (event) {

                            $('.save-layout-btn').unbind('click');
                            $('.save-layout-as-btn').unbind('click');

                            logService.controller('EntityViewerController', 'destroyed');

                        });

                    }());
                }

            }());

        }

    }()
);