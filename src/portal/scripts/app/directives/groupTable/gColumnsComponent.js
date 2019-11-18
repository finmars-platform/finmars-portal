/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');

    var metaService = require('../../services/metaService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                contentWrapElement: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {

                scope.columns = scope.evDataService.getColumns();
                scope.entityType = scope.evDataService.getEntityType();
                scope.components = scope.evDataService.getComponents();
                scope.groups = scope.evDataService.getGroups();
                scope.downloadedItemsCount = null;
                scope.contentType = scope.evDataService.getContentType();

                scope.viewContext = scope.evDataService.getViewContext();
                scope.isReport = metaService.isReport(scope.entityType);

                scope.isAllSelected = scope.evDataService.getSelectAllRowsState();

                var entityAttrs = [];
                var dynamicAttrs = [];

                var allAttrsList = [];

                var getAttributes = function () {
                    console.log("add column scope.entityType", scope.entityType);
                    switch (scope.entityType) {
                        case 'balance-report':
                            allAttrsList = scope.attributeDataService.getBalanceReportAttributes();
                            break;

                        case 'pl-report':
                            allAttrsList = scope.attributeDataService.getPlReportAttributes();
                            break;

                        case 'transaction-report':
                            allAttrsList = scope.attributeDataService.getTransactionReportAttributes();
                            break;

                        default:
                            entityAttrs = [];
                            dynamicAttrs = [];
                            allAttrsList = [];

                            entityAttrs = scope.attributeDataService.getEntityAttributesByEntityType(scope.entityType);

                            entityAttrs.forEach(function (item) {
                                if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
                                    item.name = 'Group';
                                }
                                item.entity = scope.entityType;
                            });

                            var instrumentUserFields = scope.attributeDataService.getInstrumentUserFields();
                            var transactionUserFields = scope.attributeDataService.getTransactionUserFields();

                            instrumentUserFields.forEach(function (field) {

                                entityAttrs.forEach(function (entityAttr) {

                                    if (entityAttr.key === field.key) {
                                        entityAttr.name = field.name;
                                    }

                                })

                            });
                            transactionUserFields.forEach(function (field) {

                                entityAttrs.forEach(function (entityAttr) {

                                    if (entityAttr.key === field.key) {
                                        entityAttr.name = field.name;
                                    }

                                })

                            });

                            dynamicAttrs = scope.attributeDataService.getDynamicAttributesByEntityType(scope.entityType);


                            dynamicAttrs = dynamicAttrs.map(function (attribute) {

                                var result = {};

                                result.attribute_type = Object.assign({}, attribute);
                                result.value_type = attribute.value_type;
                                result.content_type = scope.contentType;
                                result.key = 'attributes.' + attribute.user_code;
                                result.name = attribute.name;

                                return result

                            });

                            allAttrsList = allAttrsList.concat(entityAttrs);
                            allAttrsList = allAttrsList.concat(dynamicAttrs);
                    }

                };

                scope.checkReportRemoveButton = function (column, index) {
                    var groups = scope.evDataService.getGroups();

                    if (scope.isReport && index < groups.length) {

                        if (column.key === groups[index].key) {
                            return false;
                        }

                        return true;

                    }

                    return true;

                };

                scope.checkReportSortButton = function (column, index) {

                    if (scope.isReport && index < scope.groups.length) {

                        if (column.key === scope.groups[index].key) {
                            return false;
                        }

                        return true;

                    }


                    return true;

                };

                scope.selectAllRows = function () {

                    console.time('Selecting all rows');

                    var dataList = scope.evDataService.getDataAsList();

                    scope.isAllSelected = scope.evDataService.getSelectAllRowsState();

                    scope.isAllSelected = !scope.isAllSelected;

                    dataList.forEach(function (item) {

                        item.___is_activated = scope.isAllSelected;
                        item.___is_area_subtotal_activated = scope.isAllSelected;
                        item.___is_line_subtotal_activated = scope.isAllSelected;

                        if (item.results && item.results.length) {

                            item.results.forEach(function (childItem) {

                                childItem.___is_activated = scope.isAllSelected;

                            });

                        }

                    });

                    scope.evDataService.setSelectAllRowsState(scope.isAllSelected);
                    scope.evDataService.setAllData(dataList);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                    console.timeEnd('Selecting all rows');

                };

                scope.isColumnFloat = function (column) {
                    return column.value_type == 20;
                };

                scope.sortHandler = function (column, sort) {

                    var i;
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        if (!scope.columns[i].options) {
                            scope.columns[i].options = {};
                        }
                        scope.columns[i].options.sort = null;
                    }

                    column.options.sort = sort;

                    console.log('sortHandler.column', column);

                    var columns = scope.evDataService.getColumns();

                    columns.forEach(function (item) {

                        if (column.key === item.key) {
                            item = column;
                        }

                    });

                    scope.evDataService.setActiveColumnSort(column);

                    scope.evDataService.setColumns(columns);

                    scope.evEventService.dispatchEvent(evEvents.COLUMN_SORT_CHANGE);

                };

                scope.selectSubtotalType = function (column, type) {

                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.subtotal_formula_id == type) {
                        column.report_settings.subtotal_formula_id = null;
                    } else {
                        column.report_settings.subtotal_formula_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkSubtotalFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.subtotal_formula_id === type) {
                            return true;
                        }

                    }

                    return false;

                };

                scope.renameColumn = function (column, $mdMenu, $event) {

                    $mdMenu.close();

                    console.log('renameColumn', column);

                    $mdDialog.show({
                        controller: 'RenameFieldDialogController as vm',
                        templateUrl: 'views/dialogs/rename-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: column
                        }
                    })

                };

                scope.selectRoundFormat = function (column, type) {
                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.round_format_id == type) {
                        column.report_settings.round_format_id = null;
                    } else {
                        column.report_settings.round_format_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkRoundFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {

                        if (column.report_settings.round_format_id == type) {
                            return true;
                        }

                    }

                    return false;
                };

                scope.selectThousandsSeparatorFormat = function (column, type) {
                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.thousands_separator_format_id === type) {
                        column.report_settings.thousands_separator_format_id = null;
                    } else {
                        column.report_settings.thousands_separator_format_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkThousandsSeparatorFormat = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.thousands_separator_format_id === type) {
                            return true;
                        }

                    }
                    return false
                };

                scope.selectNegativeColor = function (column, type) {
                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.negative_color_format_id === type) {
                        column.report_settings.negative_color_format_id = null;
                    } else {
                        column.report_settings.negative_color_format_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkNegativeColor = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.negative_color_format_id === type) {
                            return true;
                        }

                    }
                    return false
                };

                scope.selectNegativeFormat = function (column, type) {
                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.negative_format_id == type) {
                        column.report_settings.netgative_format_id = null;
                    } else {
                        column.report_settings.negative_format_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkNegativeFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.negative_format_id == type) {
                            return true;
                        }

                    }
                    return false;
                };

                scope.selectZeroFormat = function (column, type) {
                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    if (column.report_settings.zero_format_id == type) {
                        column.report_settings.zero_format_id = null;
                    } else {
                        column.report_settings.zero_format_id = type;
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);
                };

                scope.checkZeroFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {

                        if (column.report_settings.zero_format_id == type) {
                            return true;
                        }

                    }

                    return false;

                };

                var createGroupFromColumn = function (column) {

                    var groupToAdd = {};

                    if (column.hasOwnProperty('key')) {
                        groupToAdd.key = column.key;
                    }

                    if (column.hasOwnProperty('entity')) {
                        groupToAdd.entity = column.entity;
                    }

                    if (column.hasOwnProperty('id')) {
                        groupToAdd.id = column.id;
                    }

                    groupToAdd.name = column.name;
                    groupToAdd.value_type = column.value_type;

                    return groupToAdd;

                };

                scope.isSortable = function (column) {

                    if (column.hasOwnProperty('key')) {

                        if (['accounts', 'counterparties', 'responsibles', 'transaction_types', 'portfolios'].indexOf(column.key) !== -1) {
                            return false;
                        }

                    }

                    return true;

                };

                scope.openColumnNumbersRenderingSettings = function (column, $event) {

                    $mdDialog.show({
                        controller: 'gColumnNumbersRenderingSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-column-numbers-rendering-settings-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                column: column
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            column.report_settings = res.data.report_settings;
                            console.log("number format res", res, column.report_settings);
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                        }

                    });
                };

                scope.activateColumnNumberRenderingPreset = function (column, rendPreset) {

                    if (!column.report_settings) {
                        column.report_settings = {};
                    }

                    switch (rendPreset) {

                        case 'price':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 0;
                            column.report_settings.negative_format_id = 0;
                            column.report_settings.round_format_id = 1;
                            break;
                        case 'market_value':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 1;
                            column.report_settings.negative_format_id = 1;
                            column.report_settings.thousands_separator_format_id = 2;
                            column.report_settings.round_format_id = 1;
                            break;
                        case 'amount':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 1;
                            column.report_settings.negative_format_id = 0;
                            column.report_settings.thousands_separator_format_id = 2;
                            column.report_settings.round_format_id = 3;
                            column.report_settings.percentage_format_id = 0;
                            break;
                        case 'exposure':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 1;
                            column.report_settings.negative_format_id = 1;
                            column.report_settings.round_format_id = 0;
                            column.report_settings.percentage_format_id = 2;
                            break;
                        case 'return':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 1;
                            column.report_settings.negative_format_id = 0;
                            column.report_settings.percentage_format_id = 3;
                            break;

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                };

                scope.checkForExistingGroupingColumn = function (columnKey) {

                    var groups = scope.evDataService.getGroups();

                    for (var i = 0; i < groups.length; i++) {
                        if (groups[i].key === columnKey) {
                            return false;
                        }
                    }

                    return true;
                    /*if (groups.length > 0 && index <= groups.length - 1) {
                        return false;
                    } else {
                        return true;
                    }*/

                };

                scope.addColumnEntityToGrouping = function (column) {

                    var groups = scope.evDataService.getGroups();
                    var groupToAdd = createGroupFromColumn(column);

                    groups.push(groupToAdd);
                    scope.evDataService.setGroups(groups);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.removeGroup = function (columnTableId) {
                    var groups = scope.evDataService.getGroups();

                    /** remove group */
                    var i;
                    for (i = 0; i < groups.length; i++) {
                       if (groups[i].___group_type_id === columnTableId) {
                           groups.splice(i, 1);
                           break;
                       }
                    }

                    scope.evDataService.setGroups(groups);
                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

                    /** remove column */
                    var c;
                    for (c = 0; c < scope.columns.length; c++) {

                        if (scope.columns[c].___column_id === columnTableId) {
                            scope.columns.splice(c, 1);
                            break;
                        }

                    }

                    scope.evDataService.setColumns(scope.columns);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.removeColumn = function (column) {

                    scope.columns = scope.columns.filter(function (item) {

                        return column.___column_id !== item.___column_id;

                    });

                    scope.evDataService.setColumns(scope.columns);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.reportHideSubtotal = function (column) {

                    if (!column.hasOwnProperty('report_settings')) {
                        column.report_settings = {};
                    }

                    column.report_settings.hide_subtotal = !column.report_settings.hide_subtotal;

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                    scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                };

                scope.triggerResizeTableHeadColumns = function () {
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE);
                };

                var getDownloadedTableItemsCount = function () {
                    var unfilteredFlatList = scope.evDataService.getUnfilteredFlatList();

                    unfilteredFlatList = unfilteredFlatList.filter(function (item) {

                        return item.___type !== 'control';

                    });

                    scope.downloadedItemsCount = unfilteredFlatList.length;

                };

                scope.hasFoldingBtn = function ($index) {
                    var groups = scope.evDataService.getGroups();

                    if (scope.isReport && $index < groups.length) {
                        return true;
                    }

                    return false;
                };

                scope.foldLevel = function (key, $index) {

                    scope.groups = scope.evDataService.getGroups();

                    var item = scope.groups[$index];
                    console.log("folding foldLevel data", key, scope.groups, item);
                    item.report_settings.is_level_folded = true;

                    for (; $index < scope.groups.length; $index = $index + 1) {

                        scope.groups[$index].report_settings.is_level_folded = true;

                        var groupsContent = evDataHelper.getGroupsByLevel($index + 1, scope.evDataService);

                        groupsContent.forEach(function (groupItem) {
                            groupItem.___is_open = false;

                            var childrens = evDataHelper.getAllChildrenGroups(groupItem.___id, scope.evDataService);
                            childrens.forEach(function (children) {

                                if (children.___type === 'group') {

                                    item = scope.evDataService.getData(children.___id);

                                    if (item) {
                                        item.___is_open = false;
                                        scope.evDataService.setData(item);
                                    } else {
                                        children.___is_open = false;
                                        scope.evDataService.setData(children);
                                    }


                                }

                            })

                        });

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.unfoldLevel = function (key, $index) {

                    scope.groups = scope.evDataService.getGroups();

                    var item = scope.groups[$index];

                    item.report_settings.is_level_folded = false;

                    scope.groups = scope.evDataService.getGroups();

                    for (; $index >= 0; $index = $index - 1) {

                        var groupsContent = evDataHelper.getGroupsByLevel($index + 1, scope.evDataService);
                        scope.groups[$index].report_settings.is_level_folded = false;

                        groupsContent.forEach(function (groupItem) {
                            groupItem.___is_open = true;
                            scope.evDataService.setData(groupItem);
                        });

                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.groupLevelIsFolded = function ($index) {
                    var groups = scope.evDataService.getGroups();

                    return groups[$index].report_settings.is_level_folded;
                };

                scope.addColumn = function ($event) {

                    getAttributes();

                    var availableAttrs;

                    availableAttrs = allAttrsList.filter(function (attr) {
                        for (var i = 0; i < scope.columns.length; i++) {
                            if (scope.columns[i].key === attr.key) {
                                return false;
                            }
                        }

                        return true;
                    });

                    $mdDialog.show({
                        controller: "TableAttributeSelectorDialogController as vm",
                        templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                availableAttrs: availableAttrs,
                                title: 'Choose column to add'
                            }
                        }
                    }).then(function (res) {

                        if (res && res.status === "agree") {

                            res.data.columns = true;
                            scope.columns.push(res.data);
                            scope.evDataService.setColumns(scope.columns);
                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        }

                    });

                };

                var init = function () {

                    evDataHelper.updateColumnsIds(scope.evDataService);
                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                    scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        evDataHelper.updateColumnsIds(scope.evDataService);
                        evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                        scope.columns = scope.evDataService.getColumns();
                        console.log("add column scope.columns", scope.columns);
                    });

                    scope.evEventService.addEventListener(evEvents.GROUPS_LEVEL_UNFOLD, function () {

                        scope.groups = scope.evDataService.getGroups();

                    });

                    if (!scope.isReport) {
                        scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                            getDownloadedTableItemsCount();
                        });
                    }

                };

                init();
            }
        }
    }


}());