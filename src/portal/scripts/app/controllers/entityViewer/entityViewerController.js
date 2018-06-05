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

        var reportHelper = require('../../helpers/reportHelper');
        var transactionReportHelper = require('../../helpers/transactionReportHelper');

        var uiService = require('../../services/uiService');
        var evEvents = require('../../services/entityViewerEvents');
        var EntityViewerDataService = require('../../services/entityViewerDataService');
        var EntityViewerEventService = require('../../services/entityViewerEventService');

        module.exports = function ($scope, $mdDialog) {

            var vm = this;
            vm.options = {};

            var entityViewerDataService = new EntityViewerDataService();
            var entityViewerEventService = new EntityViewerEventService();

            vm.entityViewerDataService = entityViewerDataService;
            vm.entityViewerEventService = entityViewerEventService;

            entityViewerEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                vm.updateTable({silent: true});
            });

            entityViewerEventService.addEventListener(evEvents.UPDATE_TABLE, function () {
                vm.updateTable();
            });

            vm.returnFullAttributes = function (items, attrs, baseAttrs, entityAttrs) {

                var fullItems = [];
                if (!items) {
                    return [];
                }
                var i, a, b, e, item, attr, baseAttr, attrOptions, entityAttr, report_settings, reportAttrs;

                for (i = 0; i < items.length; i = i + 1) {
                    item = items[i];

                    if (item.hasOwnProperty('id')) {

                        if (vm.isReport == true) {

                            //console.log('reportAttrs data is', vm.reportAttrs);

                            var reportAttrsKeys = Object.keys(vm.reportAttrs);

                            reportAttrsKeys.forEach(function (reportAttrKeyEntity) {

                                vm.reportAttrs[reportAttrKeyEntity].map(function (repAttr) {
                                    if (item.r_entityType === repAttr.r_entityType && item.id === repAttr.id) {
                                        if (item.options) {
                                            attrOptions = JSON.parse(JSON.stringify(item.options));
                                        }
                                        if (item.report_settings) {
                                            report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                        }
                                        item = JSON.parse(JSON.stringify(repAttr));
                                        item.options = attrOptions;
                                        if (item.report_settings) {
                                            item.report_settings = JSON.parse(JSON.stringify(report_settings));
                                        }
                                        fullItems.push(item);
                                    }
                                });
                            })
                        }
                        else {

                            var attrsKeys = Object.keys(attrs);

                            attrsKeys.forEach(function (attrKey) {

                                for (a = 0; a < attrs[attrKey].length; a = a + 1) {
                                    attr = attrs[attrKey][a];

                                    if (item.id === attr.id) {
                                        //console.log("fullattributes this isn't report");
                                        if (item.options) {
                                            attrOptions = JSON.parse(JSON.stringify(item.options));
                                        }
                                        if (item.report_settings) {
                                            report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                        }

                                        item = JSON.parse(JSON.stringify(attr));
                                        item.options = attrOptions;


                                        if (item.report_settings) {
                                            item.report_settings = JSON.parse(JSON.stringify(report_settings));
                                        }
                                        fullItems.push(item);
                                    }
                                }
                            })
                        }
                    } else {

                        // var baseAttrsKeys = Object.keys(baseAttrs);
                        //
                        // baseAttrsKeys.forEach(function (baseAttrKey) {
                        //
                        //     for (b = 0; b < baseAttrs[baseAttrKey].length; b = b + 1) {
                        //         baseAttr = baseAttrs[baseAttrKey][b];
                        //         if (item.key === baseAttr.key) {
                        //             if (item.options) {
                        //                 attrOptions = JSON.parse(JSON.stringify(item.options));
                        //             }
                        //             if (item.report_settings) {
                        //                 report_settings = JSON.parse(JSON.stringify(item.report_settings));
                        //             }
                        //             item = JSON.parse(JSON.stringify(baseAttr));
                        //             item.options = attrOptions;
                        //             if (item.report_settings) {
                        //                 item.report_settings = JSON.parse(JSON.stringify(report_settings));
                        //             }
                        //             fullItems.push(item);
                        //         }
                        //     }
                        // });

                        var entityAttrsKeys = Object.keys(entityAttrs);

                        entityAttrsKeys.forEach(function (entityAttrKey) {

                            for (e = 0; e < entityAttrs[entityAttrKey].length; e = e + 1) {
                                entityAttr = entityAttrs[entityAttrKey][e];
                                if (item.key === entityAttr.key) {

                                    var result_item = Object.assign({}, entityAttr);

                                    if (item.options) {
                                        result_item.options = JSON.parse(JSON.stringify(item.options));
                                    }
                                    if (item.report_settings) {
                                        result_item.report_settings = JSON.parse(JSON.stringify(item.report_settings));
                                    }

                                    fullItems.push(result_item);

                                }
                            }
                        })
                    }
                }

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

            vm.getView = function () {

                var layoutsIsNotExist = false;

                var handler = function (res, isDefaultFallback) {

                    if (res.results.length) {

                        vm.listView = res.results[0];

                        if (res.results[0].data.hasOwnProperty('table') && Object.keys(res.results[0].data.table).length) {

                            vm.options = Object.assign(vm.options, res.results[0].data.table, res.results[0].tableAdditions);
                            vm.options.entityType = vm.entityType;

                        } else {

                            vm.options = Object.assign(vm.options, res.results[0].data);

                        }

                    } else {

                        if (!isDefaultFallback) {
                            uiService.getListLayout(vm.entityType).then(function (data) {
                                handler(data, true);
                            });
                        } else {

                            console.log('default triggered');

                            var defaultList = uiService.getDefaultListLayout();

                            vm.options = Object.assign(vm.options, defaultList[0].data);

                        }

                    }

                    entityViewerDataService.setColumns(vm.options.columns);
                    entityViewerDataService.setGroups(vm.options.grouping);
                    entityViewerDataService.setFilters(vm.options.filters);

                    $scope.$apply();
                };

                console.log('uiLayoutId', vm.uiLayoutId);

                if (vm.uiLayoutId !== null && vm.uiLayoutId !== undefined) {
                    return uiService.getListLayoutByKey(vm.uiLayoutId).then(function (data) {
                        handler({results: [data]});
                    });
                } else {
                    return uiService.getActiveListLayout(vm.entityType).then(handler);
                }


            };

            vm.transformViewAttributes = function () { //deprecated

                vm.options.columns = vm.returnFullAttributes(vm.options.columns, vm.options.attrs, vm.options.baseAttrs, vm.options.entityAttrs);
                vm.options.grouping = vm.returnFullAttributes(vm.options.grouping, vm.options.attrs, vm.options.baseAttrs, vm.options.entityAttrs);
                vm.options.filters = vm.returnFullAttributes(vm.options.filters, vm.options.attrs, vm.options.baseAttrs, vm.options.entityAttrs);

                entityViewerDataService.setColumns(vm.options.columns);
                entityViewerDataService.setGroups(vm.options.grouping);
                entityViewerDataService.setFilters(vm.options.filters);

                if (vm.options.sorting) {
                    if (vm.options.sorting.group) {
                        vm.options.sorting.group = vm.findFullAttributeForItem(vm.options.sorting.group, vm.options.attrs);
                    }
                    if (vm.options.sorting.column) {
                        vm.options.sorting.column = vm.findFullAttributeForItem(vm.options.sorting.column, vm.options.attrs);
                    }
                }

            };

            vm.getAttributes = function () {

                if (vm.isReport === true) {

                    return new Promise(function (resolve, reject) {

                        var promises = [];
                        promises.push(attributeTypeService.getList(vm.entityType));
                        promises.push(attributeTypeService.getList('instrument'));
                        promises.push(attributeTypeService.getList('account'));
                        promises.push(attributeTypeService.getList('portfolio'));

                        Promise.all(promises).then(function (data) {

                            //console.log('dyn attrs for report', data);

                            vm.options.attrs[vm.entityType] = data[0].results;
                            vm.options.attrs['instrument'] = data[1].results;
                            vm.options.attrs['account'] = data[2].results;
                            vm.options.attrs['portfolio'] = data[3].results;

                            vm.options.baseAttrs[vm.entityType] = [];
                            vm.options.baseAttrs['instrument'] = metaService.getBaseAttrs();
                            vm.options.baseAttrs['account'] = metaService.getBaseAttrs();
                            vm.options.baseAttrs['portfolio'] = metaService.getBaseAttrs();

                            vm.options.entityAttrs[vm.entityType] = metaService.getEntityAttrs(vm.entityType).map(function (item) {
                                item.name = vm.entityType.split('-')[0].capitalizeFirstLetter() + '.' + item.name;
                                return item;
                            });

                            vm.options.entityAttrs['instrument'] = metaService.getEntityAttrs('instrument').map(function (item) {
                                item.name = 'Instrument.' + item.name;
                                item.key = 'instrument_object_' + item.key;
                                return item;
                            });

                            vm.options.entityAttrs['account'] = metaService.getEntityAttrs('account').map(function (item) {
                                item.key = 'account_object_' + item.key;
                                return item;
                            });

                            vm.options.entityAttrs['portfolio'] = metaService.getEntityAttrs('portfolio').map(function (item) {
                                item.key = 'portfolio_object_' + item.key;
                                return item;
                            });

                            resolve(undefined);

                        })

                    })

                } else {
                    return attributeTypeService.getList(vm.entityType).then(function (data) {

                        console.log('vm', vm);

                        vm.options.attrs[vm.entityType] = data.results;
                        if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(vm.entityType) == -1) {
                            vm.options.baseAttrs[vm.entityType] = metaService.getBaseAttrs();
                        }
                        vm.options.entityAttrs[vm.entityType] = metaService.getEntityAttrs(vm.entityType) || [];
                        $scope.$apply();
                    })
                }
            };

            vm.itemFilterHasOwnProperty = function (item, filter) {
                //
                //console.log('item', item);
                //console.log('filter', filter);

                if (filter.hasOwnProperty('columnType')) {
                    if (item.hasOwnProperty(filter.name)) {
                        return true;
                    }
                }

                if (filter.hasOwnProperty('key')) {
                    if (item.hasOwnProperty(filter.key)) {
                        return true;
                    }
                }

                if (filter.hasOwnProperty('id')) {

                    if (filter.hasOwnProperty('r_entityType')) {

                        if (item.hasOwnProperty(filter.r_entityType + '_attribute_' + filter.source_name)) {
                            return true;
                        }
                    } else {
                        if (item.hasOwnProperty(filter.attribute_entity + '_attribute_' + filter.source_name)) {
                            return true;
                        }
                    }
                }

                return false;

            }; // TODO refactor, move to service

            vm.getProjection = function () {
                return vm.groupTableService.projection();
            };

            vm.originalData = [];

            var reportHandler = function (data) {

                var reportOptions = entityViewerDataService.getReportOptions();

                reportOptions = Object.assign({}, reportOptions, data);

                entityViewerDataService.setReportOptions(reportOptions);

                if (!data.hasOwnProperty('non_field_errors')) {

                    if (data.task_status !== 'SUCCESS') {

                        vm.reportProcessing = true;

                        $scope.$apply();

                        setTimeout(function () {
                            vm.updateTable();
                        }, 1000)

                    } else {

                        vm.originalData = JSON.parse(JSON.stringify(data)); // store server response data untouched

                        reportOptions = Object.assign({}, reportOptions, {task_id: null});

                        entityViewerDataService.setReportOptions(reportOptions);

                        entityViewerHelperService.transformItems(data.items, vm.options.attrs).then(function (transformedData) {

                            var entity = transformedData;

                            console.log('transformedData', transformedData);

                            vm.options.reportIsReady = true;

                            if (vm.entityType === 'balance-report') {
                                entity = reportSubtotalService.groupByAndCalc(entity, reportOptions);
                            }


                            var filteredData = entity;

                            //if (vm.entityType == 'transaction-report' || vm.entityType == 'cash-flow-projection-report') {
                            filteredData = transactionReportHelper.injectIntoItems(filteredData, data);
                            //}

                            if (filteredData.length) {
                                filteredData = reportHelper.releaseEntityObjects(filteredData);
                            }
                            //console.log('filteredData', filteredData);

                            filteredData = vm.groupTableService.extractDynamicAttributes(filteredData);

                            var isFiltersExist = false;
                            var isFiltersEnabled = false;

                            if (vm.options.filters.length > 0) {
                                isFiltersExist = true;

                                vm.options.filters.forEach(function (item) {
                                    if (item.options !== undefined && item.options.enabled == true) {

                                        if (item.value_type == 'field' && item.options.query !== undefined && item.options.query.length > 0) {
                                            isFiltersEnabled = true;
                                        }
                                        if (item.value_type == 'float' && item.options.query !== undefined && (item.options.query + '').length > 0) {
                                            isFiltersEnabled = true;
                                        }

                                        if (item.hasOwnProperty('columnType') || item.value_type == 10 && item.options.query !== undefined && (item.options.query + '').length > 0) {
                                            isFiltersEnabled = true;
                                        }
                                    }
                                });
                            }

                            //console.log('filteredData123', filteredData);

                            if (isFiltersExist == true && isFiltersEnabled == true) {

                                var itemsRepository = JSON.parse(JSON.stringify(filteredData));

                                vm.options.filters.forEach(function (filterItem) {

                                    if (filterItem.hasOwnProperty('columnType')) {
                                        filterItem.value_type = 10
                                    }

                                    //console.log('filterItem', filterItem);

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


                                                if (filterItem.value_type == 10) {

                                                    var _name;

                                                    if (filterItem.hasOwnProperty('r_entityType')) {
                                                        _name = filterItem.r_entityType + '_attribute_' + filterItem.source_name;
                                                    } else {
                                                        if (filterItem.hasOwnProperty('columnType')) {
                                                            _name = filterItem.name;
                                                        } else {
                                                            _name = filterItem.key;
                                                            //_name = filterItem.attribute_entity + '_attribute_' + filterItem.source_name;
                                                        }
                                                    }


                                                    if (filterItem.options.query !== undefined) {

                                                        var strName = item[_name] + '';
                                                        var strQuery = filterItem.options.query + '';

                                                        if (strName.toLocaleLowerCase().indexOf(strQuery.toLocaleLowerCase()) !== -1) {


                                                            localFilteredData.push(item);
                                                        }
                                                    } else {
                                                        localFilteredData.push(item);
                                                    }
                                                }

                                            }

                                        });


                                        itemsRepository = localFilteredData;
                                    }
                                });

                                filteredData = itemsRepository;
                            }


                            var entitiesList = [vm.entityType, 'instrument', 'account',
                                'portfolio', 'instrument-type', 'account-type',
                                'strategy-1', 'strategy-1-subgroup', 'strategy-1-subgroup',
                                'strategy-2', 'strategy-2-subgroup', 'strategy-2-subgroup',
                                'strategy-3', 'strategy-3-subgroup', 'strategy-3-subgroup'];

                            if (vm.entityType == 'cash-flow-projection-report') {
                                entitiesList.push('transaction-report');
                            }

                            vm.groupTableService.setItems(filteredData);

                            vm.groupTableService.columns.setColumns(vm.options.columns);

                            vm.groupTableService.grouping.setGroupsWithColumns(vm.options.grouping, vm.options.columns, entitiesList);

                            vm.groupTableService.folding.setFolds(vm.options.folding);

                            // vm.groupTableService.sorting.group.sort(vm.options.sorting.group);

                            console.log('report projection', vm.groupTableService.projection());

                            vm.tableIsReady = true;
                            vm.reportProcessing = false;

                            entityViewerDataService.setStatusData('loaded');

                            $scope.$apply();
                        });
                    }
                } else {
                    $mdDialog.show({
                        controller: 'ValidationDialogController as vm',
                        templateUrl: 'views/dialogs/validation-dialog-view.html',
                        //targetEvent: $event,
                        locals: {
                            validationData: data
                        },
                        preserveScope: true,
                        autoWrap: true,
                        skipHide: true
                    })
                }
            };

            var handler = function (data) {

                console.log('DATA', data);

                vm.originalData = JSON.parse(JSON.stringify(data)); // store server response data untouched

                vm.options.pagination.items_total = data.count;
                vm.nextExist = !!data.next;
                vm.previousExist = !!data.previous;

                data.results = data.results.map(function (item) {

                    if (item.object_permissions) {
                        item.object_permissions_group = [];
                        item.object_permissions_user = [];


                        item.object_permissions.forEach(function (permission) {
                            if (permission.group == null) {
                                item.object_permissions_user.push(permission);
                            }
                            if (permission.member == null) {
                                item.object_permissions_group.push(permission);
                            }
                        });
                    }

                    return item;
                });

                entityViewerHelperService.transformItems(data.results, vm.options.attrs).then(function (data) {

                    var entity = data;
                    entity = entity.map(function (item) {
                        item.date_formatted = moment(new Date(item.created)).format('DD/MM/YYYY');

                        if (vm.entityType == 'audit-transaction' || vm.entityType == 'audit-instrument') {
                            item.username = item.member.username;
                        }
                        return item;
                    });

                    vm.groupTableService.setItems(entity);

                    vm.groupTableService.columns.setColumns(vm.options.columns);

                    vm.groupTableService.grouping.setGroups(vm.options.grouping, [vm.entityType]);

                    vm.groupTableService.folding.setFolds(vm.options.folding);

                    // vm.groupTableService.sorting.group.sort(vm.options.sorting.group);
                    // vm.groupTableService.sorting.column.sort(vm.options.sorting.column);
                    vm.tableIsReady = true;

                    entityViewerDataService.setStatusData('loaded');

                    $scope.$apply();
                });
            };

            vm.updateTable = function (params) {

                if (vm.options.components.layoutManager === true) {
                    vm.saveLayoutAsManager();
                    vm.saveLayoutManager();
                }

                vm.options.columns = entityViewerDataService.getColumns();
                vm.options.grouping = entityViewerDataService.getGroups();
                vm.options.filters = entityViewerDataService.getFilters();
                vm.options.pagination = entityViewerDataService.getPagination();

                var optionsHandler = function (entityType, isReport) {

                    isReport = isReport || false;

                    if (isReport === true) {

                        var reportOptions = entityViewerDataService.getReportOptions();

                        reportOptions = Object.assign({}, reportOptions, {custom_fields: []});

                        // vm.reportOptions.custom_fields = [];

                        vm.options.columns.forEach(function (column) {

                            if (column.hasOwnProperty('columnType') && column.columnType === 'custom-field') {
                                reportOptions.custom_fields.push(column.id);
                            }
                        });

                        entityViewerDataService.setReportOptions(reportOptions);

                        vm.options.reportIsReady = false;

                        return options
                    }

                    if (vm.entityType === 'audit-transaction') {

                        var sort = {};

                        if (vm.options.sorting && vm.options.sorting.column) {
                            sort = {
                                key: vm.options.sorting.column.key,
                                direction: vm.options.sorting.column.sort
                            }
                        }

                        options = {
                            sort: sort,
                            filters: {'content_type': 'transactions.transaction'},
                            page: vm.options.pagination.current_page,
                            pageSize: vm.options.pagination.items_per_page
                        };

                        vm.options.reportIsReady = true;

                        vm.options.filters.forEach(function (item) {
                            if (item.options && item.options.enabled === true) {
                                options.filters[item.key] = item.options.query;
                            }
                        });

                        return options
                    }

                    if (vm.entityType === 'audit-instrument') {

                        var sort = {};

                        if (vm.options.sorting && vm.options.sorting.column) {
                            sort = {
                                key: vm.options.sorting.column.key,
                                direction: vm.options.sorting.column.sort
                            }
                        }

                        options = {
                            sort: sort,
                            filters: {'content_type': 'instruments.instrument'},
                            page: vm.options.pagination.current_page,
                            pageSize: vm.options.pagination.items_per_page
                        };

                        vm.options.reportIsReady = true;

                        vm.options.filters.forEach(function (item) {
                            if (item.options && item.options.enabled === true) {
                                options.filters[item.key] = item.options.query;
                            }
                        });

                        return options;

                    }

                    var sort = {};

                    if (vm.options.sorting && vm.options.sorting.column) {
                        sort = {
                            key: vm.options.sorting.column.key,
                            direction: vm.options.sorting.column.sort
                        }
                    }


                    options = {
                        sort: sort,
                        filters: {},
                        page: vm.options.pagination.current_page,
                        pageSize: vm.options.pagination.items_per_page
                    };

                    vm.options.reportIsReady = true;

                    vm.options.filters.forEach(function (item) {
                        if (item.options && item.options.enabled === true) {
                            options.filters[item.key] = item.options.query;
                        }
                    });

                    return options;

                };

                var defaultParams = {
                    redraw: true,
                    silent: false,
                    options: {}
                };

                var _params = Object.assign(defaultParams, params);

                var options = optionsHandler(vm.entityType, vm.isReport);

                console.log('vm', vm);

                if (vm.isReport === true && _params.silent === true) {

                    if (vm.originalData.length || vm.originalData.hasOwnProperty('results')) {
                        reportHandler(vm.originalData)
                    }

                }

                if (vm.isReport === true && _params.silent === false) {

                    entityViewerDataService.setStatusData('loading');

                    entityViewerDataResolver.getList(vm.entityType, entityViewerDataService.getReportOptions()).then(function (data) {
                        reportHandler(data);
                    })
                }


                if (vm.isReport === false && _params.silent === true) {

                    if (vm.originalData.length || vm.originalData.hasOwnProperty('results')) {
                        handler(vm.originalData);
                    }
                }

                if (vm.isReport === false && _params.silent === false) {

                    entityViewerDataService.setStatusData('loading');

                    entityViewerDataResolver.getList(vm.entityType, options).then(function (data) {
                        handler(data);
                    })

                }

            };

            vm.options.externalCallback = vm.updateTable;

            vm.addEntity = function (ev) {

                $mdDialog.show({
                    controller: 'EntityViewerAddDialogController as vm',
                    templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                    parent: angular.element(document.body),
                    targetEvent: ev,
                    //clickOutsideToClose: true,
                    locals: {
                        entityType: entityViewerDataService.getEntityType()
                    }
                }).then(function () {
                    vm.updateTable();
                })
            };

            vm.openCustomAdditionsView = function ($event, customButton) {
                // vm.options.additionsStatus.reportWizard = false;
                // vm.options.additionsStatus.table = false;
                // vm.options.additionsState = true;
                // vm.options.additionsStatus.extraFeatures.forEach(function (item) {
                //     item.isOpened = false;
                //     if (item.id === customButton.id) {
                //         item.isOpened = true;
                //     }
                // });

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

            vm.getReport = function () {

                pricingPolicyService.getList().then(function (data) {

                    var reportOptions = entityViewerDataService.getReportOptions();

                    reportOptions = Object.assign({}, reportOptions, {
                        cost_method: 1,
                        pricing_policy: data.results ? data.results[0].id : null
                    });

                    entityViewerDataService.setReportOptions(reportOptions);

                    // vm.reportOptions = {
                    //     cost_method: 1,
                    //     pricing_policy: data.results ? data.results[0].id : null
                    // };
                    //
                    // vm.readyStatus.reportOptions = true;

                    vm.getView().then(function () {
                        vm.getAttributes().then(function () {
                            vm.transformViewAttributes();
                            //debugger;
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

            vm.checkAddEntityBtn = function () {
                return vm.options.components && vm.options.components.addEntityBtn;
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

                    vm.options.columnsWidth = thWidths;

                    vm.listView.data = vm.options;

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
            };

            (function ResolveEntityViewer() {


                if ($scope.$parent.options && $scope.$parent.evDataService.getAdditions().additionsState === true) {

                    (function SetPropsForEntityViewer() {

                        vm.options.oldListView = null;

                        if ($scope.$parent.options.additions.reportWizard === true) {
                            vm.onBeforeLoadAction = 'views/entity-viewer/report-wizard-view.html';
                        }
                        vm.onBeforeLoadActionFinish = false;

                        vm.options.pagination = {
                            current_page: 1,
                            items_per_page: 20,
                            items_total: 0
                        };

                        entityViewerDataService.setPagination(vm.options.pagination);

                        // vm.options.paginationPageCurrent = 1;
                        // vm.options.paginationItemPerPage = 20;
                        // vm.options.paginationItemsTotal = 0;


                        vm.options.attrs = {};
                        vm.options.baseAttrs = {};
                        vm.options.layoutAttrs = [];
                        vm.options.entityAttrs = {};

                        vm.groupTableService = GroupTableService.getInstance(true, 'child');

                        vm.options.columns = [];
                        vm.options.columnsWidth = [];
                        vm.options.grouping = [];
                        vm.options.filters = [];
                        vm.options.sorting = [];

                        vm.options.permission_selected_id = null;
                        vm.options.permission_selected_entity = null;

                        vm.options.entityAdditions = [];
                        vm.options.additionsType = '';
                        vm.options.additionsEntityType = '';
                        vm.options.components = {
                            sidebar: true,
                            groupingArea: true,
                            columnAreaHeader: true,
                            splitPanel: false,
                            addEntityBtn: false,
                            fieldManagerBtn: true,
                            layoutManager: false,
                            autoReportRequest: false
                        };
                        entityViewerDataService.setComponents(vm.options.components);

                        vm.options.entityAdditionsColumns = [];
                        vm.options.entityAdditionsFilters = [];
                        vm.options.entityAdditionsSorting = [];

                        // OTHER STUFF START

                        vm.options.tabs = [];
                        vm.options.table = {};
                        vm.options.tableAdditions = {};

                        vm.tableIsReady = false;

                        entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');

                        vm.options.additions = {
                            editor: false,
                            table: false,
                            permissionEditor: false,
                            extraFeatures: [],
                            additionsState: false
                        };

                        vm.options.additions.extraFeatures = vm.customButtons;

                        vm.options.reportIsReady = false;

                        vm.options.reportAttrs = {};	//	array of reports's dynamic attributes

                        dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {
                            vm.reportAttrs = data;
                        });

                        $scope.$on("$destroy", function (event) {

                            logService.controller('EntityViewerController', 'destroyed');

                        });

                    }());

                } else { // root EntityViewer

                    (function SetPropsForRootEntityViewer() {

                        vm.options.oldListView = null;

                        vm.options.onBeforeLoadAction = false; // no before action for root, for now
                        vm.options.onBeforeLoadActionFinish = true; // will be updated from onBeforeLoadAction controller, when it finish

                        vm.options.pagination = {
                            current_page: 1,
                            items_per_page: 20,
                            items_total: 0
                        };

                        entityViewerDataService.setPagination(vm.options.pagination);

                        // vm.options.paginationPageCurrent = 1;
                        // vm.options.paginationItemPerPage = 20;
                        // vm.options.paginationItemsTotal = 0;

                        // ATTRIBUTE STUFF START

                        // vm.options.isRootEntityViewer = true;
                        entityViewerDataService.setRootEntityViewer(true);

                        vm.options.attrs = {};
                        vm.options.baseAttrs = {};
                        vm.options.layoutAttrs = [];
                        vm.options.entityAttrs = {};

                        // ENTITY STUFF START
                        vm.entityType = $scope.$parent.vm.entityType;
                        vm.options.entityType = $scope.$parent.vm.entityType;
                        entityViewerDataService.setEntityType($scope.$parent.vm.entityType);
                        vm.uiLayoutId = $scope.$parent.vm.uiLayoutId;
                        vm.options.components = $scope.$parent.vm.components || {
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

                        console.log('vm.options.components', vm.options.components);

                        vm.isReport = $scope.$parent.vm.isReport || false;

                        vm.options.customButtons = $scope.$parent.vm.entityViewer.extraFeatures;
                        vm.groupTableService = GroupTableService.getInstance(true, 'root');

                        vm.options.columns = [];
                        vm.options.columnsWidth = [];
                        vm.options.grouping = [];
                        vm.options.filters = [];
                        vm.options.sorting = [];

                        vm.options.permission_selected_id = null;
                        vm.options.permission_selected_entity = null;

                        // ENTITY ADDITIONS STUFF START

                        vm.options.entityAdditions = [];
                        vm.options.additionsType = '';
                        vm.options.additionsEntityType = '';

                        // OTHER STUFF START

                        vm.options.tabs = [];
                        vm.options.table = {};
                        vm.options.tableAdditions = {};

                        vm.tableIsReady = false;

                        entityViewerDataService.setEditorTemplateUrl('views/additions-editor-view.html');
                        console.log(entityViewerDataService.getEditorTemplateUrl());

                        vm.options.additions = {
                            editor: false,
                            table: false,
                            permissionEditor: false,
                            extraFeatures: [],
                            additionsState: false
                        };

                        vm.options.additions.extraFeatures = vm.customButtons;

                        vm.options.reportIsReady = false;

                        vm.options.reportAttrs = {};	//	array of reports's dynamic attributes

                        dynamicAttributesForReportsService.getDynamicAttributes().then(function (data) {
                            vm.options.reportAttrs = data;
                        });

                        if (vm.isReport === true) {

                            pricingPolicyService.getList().then(function (data) {

                                var reportDate = moment(new Date(Date.now() - 86400000)).format('YYYY-MM-DD');
                                var pricingPolicy = data.results.length ? data.results[0].id : null;

                                var reportOptions = entityViewerDataService.getReportOptions();

                                reportOptions = Object.assign({}, reportOptions, {
                                    cost_method: 1,
                                    pricing_policy: pricingPolicy,
                                    report_date: reportDate
                                });

                                entityViewerDataService.setReportOptions(reportOptions);

                                // vm.reportOptions = {
                                //     cost_method: 1,
                                //     pricing_policy: data.results.length ? data.results[0].id : null,
                                //     report_date: moment(new Date(Date.now() - 86400000)).format('YYYY-MM-DD') // yesterday
                                // };

                                if (vm.entityType === 'performance-report') {

                                    var beginDate = moment(new Date(Date.now() - 86400000)).format('YYYY-MM-DD');
                                    var endDate = moment(new Date(Date.now())).format('YYYY-MM-DD');
                                    var periods = 'date_group(transaction.accounting_date, [[None,None,timedelta(months=1),["[","%Y-%m-%d","/","","%Y-%m-%d","]"]]], "Err")';

                                    reportOptions = entityViewerDataService.getReportOptions();

                                    reportOptions = Object.assign({}, reportOptions, {
                                        begin_date: beginDate,
                                        end: endDate,
                                        periods: periods
                                    });

                                    entityViewerDataService.setReportOptions(reportOptions);

                                    // vm.reportOptions.begin_date = moment(new Date(Date.now() - 86400000)).format('YYYY-MM-DD');
                                    // vm.reportOptions.end = moment(new Date(Date.now())).format('YYYY-MM-DD');
                                    // vm.reportOptions.periods = 'date_group(transaction.accounting_date, [[None,None,timedelta(months=1),["[","%Y-%m-%d","/","","%Y-%m-%d","]"]]], "Err")';
                                }

                                vm.getView().then(function () {
                                    vm.getAttributes().then(function () {

                                        vm.tableIsReady = true;

                                        if (vm.options.components.autoReportRequest === true) {
                                            vm.updateTable();
                                        }

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

                        if (vm.options.components.layoutManager === true) {
                            vm.saveLayoutAsManager();
                            vm.saveLayoutManager();
                        }

                        $scope.$on("$destroy", function (event) {

                            if (vm.options.components.layoutManager === true) {
                                $('.save-layout-btn').unbind('click');
                                $('.save-layout-as-btn').unbind('click');
                            }

                        });

                    }());
                }

            }());

        }

    }()
);