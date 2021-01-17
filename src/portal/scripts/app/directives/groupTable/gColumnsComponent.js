/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var popupEvents = require('../../services/events/popupEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');

    var metaService = require('../../services/metaService');
    var evHelperService = require('../../services/entityViewerHelperService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                contentWrapElement: '='
            },
            templateUrl: 'views/directives/groupTable/g-columns-view.html',
            link: function (scope, elem, attrs) {

                scope.columns = scope.evDataService.getColumns();
                console.log('#69 total columns', scope.columns)

                scope.groups = scope.evDataService.getGroups();
                evDataHelper.importGroupsStylesFromColumns(scope.groups, scope.columns)
                console.log('#69 scope.groups', scope.groups)

                const setFiltersLayoutNames = () => {

                    const filters = scope.evDataService.getFilters();

                    const totalColumns = [...scope.groups, ...scope.notGroupingColumns];

                    filters.forEach(filter => {

                        const column = totalColumns.find(col => col.key === filter.key);

                        if (column && column.layout_name) {

                            filter.layout_name = column.layout_name;

                        }

                    });

                    scope.evDataService.setFilters(filters);

                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                };

                // Victor 2020.12.11 scope.notGroupingColumns should update on any scope.columns or scope.groups change (if not dispatched evEvents.COLUMNS_CHANGE)
                scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);
                console.log('#69 scope.notGroupingColumns', scope.notGroupingColumns)
                setFiltersLayoutNames();

                scope.entityType = scope.evDataService.getEntityType();

                scope.components = scope.evDataService.getComponents();
                scope.downloadedItemsCount = null;
                scope.contentType = scope.evDataService.getContentType();
                scope.columnAreaCollapsed = false;

                scope.viewContext = scope.evDataService.getViewContext();
                scope.isReport = metaService.isReport(scope.entityType);

                scope.isAllSelected = scope.evDataService.getSelectAllRowsState();
                scope.isAllStarsSelected = false;
                scope.hideRowFilters = false;

                var entityAttrs = [];
                var dynamicAttrs = [];
                var keysOfColsToHide = [];

                // Victor 2020.12.14 #69 New report viewer design
                scope.rowFilterColor = 'none';

                scope.getPopupData = function (column, $index) {

                    let data = {
                        $index: $index,
                        column: column,
                        viewContext: scope.viewContext,
                        renameColumn: scope.renameColumn, // + 1
                        isReport: scope.isReport,
                        columnHasCorrespondingGroup: scope.columnHasCorrespondingGroup,
                        addColumnEntityToGrouping: scope.addColumnEntityToGrouping, // + 5
                        checkForFilteringBySameAttr: scope.checkForFilteringBySameAttr,
                        addFiltersWithColAttr: scope.addFiltersWithColAttr, // + 6
                        activateColumnNumberRenderingPreset: scope.activateColumnNumberRenderingPreset,
                        openColumnNumbersRenderingSettings: scope.openColumnNumbersRenderingSettings,
                        selectSubtotalType: scope.selectSubtotalType, // + 8
                        checkSubtotalFormula: scope.checkSubtotalFormula,
                        resizeColumn: scope.resizeColumn, // + 4
                        removeColumn: scope.removeColumn, // + 3

                        changeColumnTextAlign: scope.changeColumnTextAlign, // + 7
                        checkColTextAlign: scope.checkColTextAlign,
                        removeGroup: scope.removeGroup, // + 2
                        reportHideSubtotal: scope.reportHideSubtotal //
                    };

                    const groups = scope.evDataService.getGroups();

                    if (groups.length && $index < groups.length) {
                    	data.reportSetSubtotalType = scope.reportSetSubtotalType
					}

                    return data;

                };

                scope.getPopupMenuTemplate = function (column) {


                    if (scope.isReport && column.value_type == 20) {

                        return "'views/popups/entity-viewer/g-report-viewer-numeric-column-settings-popup-menu.html'"; // Victor 2020.12.14 #69 string in string must returned for template binding

                    }

                    return "'views/popups/entity-viewer/g-report-viewer-column-settings-popup-menu.html'";
                };

                scope.rowFiltersToggle = function () {

                	scope.hideRowFilters = !scope.hideRowFilters

					var rowSettingsElems = scope.contentWrapElement.querySelectorAll(".gRowSettings");

					rowSettingsElems.forEach(rowSElem => {

						if (scope.hideRowFilters) {
							rowSElem.classList.add('closed');

						} else {
							rowSElem.classList.remove('closed');
						}

					});

                };

                scope.changeRowFilterColor = function (color) {

                	scope.rowFilterColor = color;
                    scope.evDataService.setRowTypeFilters(scope.rowFilterColor);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                };

                let rowTypeFilters = localStorage.getItem("row_type_filters");

                if (rowTypeFilters) {

                    rowTypeFilters = JSON.parse(rowTypeFilters);
                    scope.rowFilterColor = rowTypeFilters.markedRowFilters;
                    scope.changeRowFilterColor(scope.rowFilterColor);

                }

                // <Victor 2020.12.14 #69 New report viewer design>

                var getAttributes = function () {

                    var allAttrsList = [];

                    if (scope.viewContext === 'reconciliation_viewer') {

                        allAttrsList = scope.attributeDataService.getReconciliationAttributes();

                    } else {

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

                    }

                    return allAttrsList;

                };

				scope.reportSetSubtotalType = function (group, type) {

					if (!group.hasOwnProperty('report_settings') || group.report_settings === undefined) {
						group.report_settings = {};
					}

					if (group.report_settings.subtotal_type === type) {
						group.report_settings.subtotal_type = false;
					} else {
						group.report_settings.subtotal_type = type;
					}

					scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
					scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

				};

                scope.columnHasCorrespondingGroup = function (columnKey) {

                    for (var i = 0; i < scope.groups.length; i++) {
                        if (scope.groups[i].key === columnKey) {
                            return true;
                        }
                    }

                    return false;

                };

                /*var getColumnSettingsMenu = function (column) {
                    var menuComp;

                    if (scope.isReport) {

                        if (column.value_type === 20) {
                            menuComp = [
                                {

                                }
                            ]
                        }

                    }
                };*/

                /*scope.openColumnSettingsMenu = function (e, column) {

                    e.preventDefault();
                    e.stopPropagation();

                    if (scope.isReport) {
                        var menuDiv = document.createElement('div');

                        menuDiv.style.top = e.pageY + 'px';
                        menuDiv.style.left = e.pageX + 'px';


                    } else {

                    }

                };*/

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

                    scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);

                    scope.evEventService.dispatchEvent(evEvents.COLUMN_SORT_CHANGE);

                };

                scope.groupsSortHandler = function (groupIndex, sort) {

                    // reset sorting for other groups
                    var i;
                    for (i = 0; i < scope.groups.length; i = i + 1) {
                        if (!scope.groups[i].options) {
                            scope.groups[i].options = {};
                        }
                    }

                    var group = scope.groups[groupIndex];
                    console.log("groups sorting group", group);
                    group.options.sort = sort;

                    var groups = scope.evDataService.getGroups();

                    groups.forEach(function (item) {

                        if (group.key === item.key || group.id === item.id) {
                            item = group
                        }

                    });

                    scope.evDataService.setGroups(groups);
                    scope.evDataService.setActiveGroupTypeSort(group);

                    scope.evEventService.dispatchEvent(evEvents.GROUP_TYPE_SORT_CHANGE);
                };

                scope.selectSubtotalType = function (column, type) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

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

                    if ($mdMenu) {

                        $mdMenu.close();

                    } else {

                        scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    }

                    console.log('renameColumn', column);

                    $mdDialog.show({
                        controller: 'RenameFieldDialogController as vm',
                        templateUrl: 'views/dialogs/rename-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: column
                        }
                    }).then(res => {

                        if (res.status === 'agree') {

                            const filters = scope.evDataService.getFilters();
                            const filter = filters.find(filter => filter.key === res.data.key);

                            if (filter) {

                                filter.layout_name = res.data.layout_name;

                                scope.evDataService.setFilters(filters);

                                scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                            }

                        }

                    })

                };

                scope.resizeColumn = function (column, $mdMenu, $event) {

                    if ($mdMenu) {

                        $mdMenu.close();

                    } else {

                        scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    }

                    $mdDialog.show({
                        controller: 'ResizeFieldDialogController as vm',
                        templateUrl: 'views/dialogs/resize-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: column
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {
                            scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                        }

                    })

                };

                scope.checkColTextAlign = function (column, type) {

                    if (column.hasOwnProperty('style') && column.style) {

                        if (column.style.text_align === type) {
                            return true;
                        }

                    }

                    return false;

                };

                scope.changeColumnTextAlign = function (column, type) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    if (!column.hasOwnProperty('style')) {
                        column.style = {}
                    }

                    if (column.style.text_align === type) {
                        delete column.style.text_align;
                    } else {
                        column.style.text_align = type
                    }

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
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

                scope.isSortable = function (column) {

                    if (column.hasOwnProperty('key')) {

                        if (['accounts', 'counterparties', 'responsibles', 'transaction_types', 'portfolios'].indexOf(column.key) !== -1) {
                            return false;
                        }

                    }

                    return true;

                };

                scope.showColSettingsInsideDashboard = function () {

                };

                scope.openColumnNumbersRenderingSettings = function (column, $event) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

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

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            scope.evEventService.dispatchEvent(evEvents.REPORT_TABLE_VIEW_CHANGED);

                        }

                    });
                };

                scope.activateColumnNumberRenderingPreset = function (column, rendPreset) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    if (!column.report_settings) {
                        column.report_settings = {};
                    }

                    switch (rendPreset) {

                        case 'price':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 0;
                            column.report_settings.negative_format_id = 0;
                            column.report_settings.round_format_id = 1;
                            column.report_settings.percentage_format_id = 0;
                            break;
                        case 'market_value':
                            column.report_settings.zero_format_id = 1;
                            column.report_settings.negative_color_format_id = 1;
                            column.report_settings.negative_format_id = 1;
                            column.report_settings.thousands_separator_format_id = 2;
                            column.report_settings.round_format_id = 1;
                            column.report_settings.percentage_format_id = 0;
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

                scope.addColumnEntityToGrouping = function (column) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var groups = scope.evDataService.getGroups();
                    var groupToAdd = evHelperService.getTableAttrInFormOf('group', column);

                    groups.push(groupToAdd);
                    scope.evDataService.setGroups(groups);

                    scope.evEventService.dispatchEvent(evEvents.GROUPS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.checkForFilteringBySameAttr = function (columnKey) {
                    var filters = scope.evDataService.getFilters();

                    for (var i = 0; i < filters.length; i++) {
                        if (filters[i].key === columnKey) {
                            return false;
                        }
                    }

                    return true;
                };

                scope.addFiltersWithColAttr = function (column) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var filters = scope.evDataService.getFilters();
                    var filterToAdd = evHelperService.getTableAttrInFormOf('filter', column);

                    filters.push(filterToAdd);

                    scope.evDataService.setFilters(filters);

                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                };

                scope.removeGroup = function (columnTableId) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

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
                    scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.removeColumn = function (column) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

                    var colToDeleteAttr = '';
                    /*scope.columns = scope.columns.filter(function (item) {
                        return column.___column_id !== item.___column_id;
                    });*/
                    for (var i = 0; i < scope.columns.length; i++) {

                        if (column.___column_id === scope.columns[i].___column_id) {

                            colToDeleteAttr = JSON.parse(angular.toJson(scope.columns[i]));
                            scope.columns.splice(i, 1);
                            break;

                        }

                    }

                    if (scope.viewContext === 'dashboard') {

                        var hasAttrAlready = false;
                        var availableCols = scope.attributeDataService.getAttributesAvailableForColumns();

                        for (var i = 0; i < availableCols.length; i++) {

                            if (availableCols[i].attribute_data.key === colToDeleteAttr.key) {
                                hasAttrAlready = true;
                                break;
                            }

                        }

                        if (!hasAttrAlready) {

                            var newAvailableCol = {
                                attribute_data: {
                                    key: colToDeleteAttr.key,
                                    name: colToDeleteAttr.name,
                                    content_type: colToDeleteAttr.content_type,
                                    value_type: colToDeleteAttr.value_type
                                },
                                is_default: false,
                                layout_name: colToDeleteAttr.layout_name || '',
                                order: scope.colsAvailableForAdditions.length
                            };

                            availableCols.push(newAvailableCol);
                            scope.attributeDataService.setAttributesAvailableForColumns(availableCols);

                        }

                    }

                    scope.evDataService.setColumns(scope.columns);
                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                };

                scope.reportHideSubtotal = function (column) {

                    scope.evEventService.dispatchEvent(popupEvents.CLOSE_POPUP);

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

                /*scope.getColumnContentClasses = function ($index) {
                    var classes = '';

                    /!*if (scope.viewContext === 'dashboard' && !scope.hasFoldingBtn($index)) {
                        classes += 'p-r-8';
                    }*!/

                    if (scope.viewContext === 'dashboard' && scope.hasFoldingBtn($index)) {
                        classes += 'p-r-8';
                    }
                };*/

				let updateGroupTypeIds = function () {

					let groups = scope.evDataService.getGroups();

					groups.forEach(item => {

						item.___group_type_id = evDataHelper.getGroupTypeId(item);

					});

					scope.evDataService.setGroups(groups);

				};

				let setDefaultGroupType = function () {

					let groups = scope.evDataService.getGroups();

					if (scope.isReport) {

						let reportOptions = scope.evDataService.getReportOptions();
						let reportOptionsChanged = false;

						if (!reportOptions.subtotals_options) {
							reportOptions.subtotals_options = {}
						}

						if (!reportOptions.subtotals_options.type) {

							reportOptions.subtotals_options.type = 'line'

							scope.evDataService.setReportOptions(reportOptions);
							scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

						}

					}

					groups.forEach(function (group) {

						if (!group.hasOwnProperty('report_settings')) {
							group.report_settings = {}
						}

						if (!scope.isReport && !group.hasOwnProperty('ev_folded')) {
							group.ev_group_folded = true
						}

					});

					scope.evDataService.setGroups(groups);

				};

				let syncColumnsWithGroups = function () {

					let columns = scope.evDataService.getColumns();
					let groups = scope.evDataService.getGroups();

					let columnsSynced = false;

					groups.forEach((group, groupIndex) => {

						if (group.key !== columns[groupIndex].key) {

							columnsSynced = true;
							let columnToAdd;
							let groupColumnIndex = columns.findIndex(column => group.key === column.key);

							if (groupColumnIndex > -1) {

								columnToAdd = JSON.parse(JSON.stringify(columns[groupColumnIndex]));
								columns.splice(groupColumnIndex, 1);

							} else {

								columnToAdd = evHelperService.getTableAttrInFormOf("column", group);

							}

							columns.splice(groupIndex, 0, columnToAdd);

						}

					});

					if (columnsSynced) {
						scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
					}

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

                var getColsAvailableForAdditions = function () {
                    var availableCols = scope.attributeDataService.getAttributesAvailableForColumns();

                    scope.colsAvailableForAdditions = availableCols.filter(function (aColumn) {
                        for (var i = 0; i < scope.columns.length; i++) {
                            if (scope.columns[i].key === aColumn.attribute_data.key) {
                                return false;
                            }
                        }

                        return true;
                    });

                };

                var flagMissingColumns = function () {


                    console.log("flagMissingColumns.columns", scope.columns);

                    var attributeTypes;
                    var attributes;

                    if (scope.isReport) {

                        switch (scope.entityType) {

                            case 'balance-report':
                                attributes = scope.attributeDataService.getBalanceReportAttributes();
                                break;

                            case 'pl-report':
                                attributes = scope.attributeDataService.getPlReportAttributes();
                                break;

                            case 'transaction-report':
                                attributes = scope.attributeDataService.getTransactionReportAttributes();
                                break;

                        }

                        console.log("flagMissingColumns.attributes", attributes);

                        scope.columns = scope.columns.map(function (column) {

                            column.status = 'ok';

                            if (column.key.indexOf('attributes.') !== -1) {

                                isMissing = true;

                                attributes.forEach(function (attribute) {

                                    if(column.key === attribute.key) {
                                        isMissing = false;
                                    }


                                });

                                if (isMissing) {
                                    column.status = 'missing'
                                }

                            }

                            return column

                        });

                        scope.evDataService.setColumns(scope.columns);

                    } else {

                        attributeTypes = scope.attributeDataService.getDynamicAttributesByEntityType(scope.entityType);

                        console.log("flagMissingColumns.attributeTypes", attributeTypes);

                        var user_code;
                        var isMissing;

                        scope.columns = scope.columns.map(function (column) {

                            column.status = 'ok';

                            if (column.key.indexOf('attributes.') !== -1) {

                                isMissing = true;

                                user_code = column.key.split('attributes.')[1];

                                attributeTypes.forEach(function (attributeType) {

                                    if (attributeType.user_code === user_code) {
                                        isMissing = false;
                                    }

                                });

                                if (isMissing) {
                                    column.status = 'missing'
                                }

                            }

                            return column


                        });

                        scope.evDataService.setColumns(scope.columns);

                    }


                };

                scope.addColumn = function ($event) {

                    var allAttrsList = getAttributes();

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

                scope.addColumnToDashboardReport = function (attribute) {
                    var colData = JSON.parse(JSON.stringify(attribute.attribute_data));

                    colData.columns = true;
                    if (attribute.layout_name) {
                        colData.layout_name = JSON.parse(JSON.stringify(attribute.layout_name));
                    }
                    scope.columns.push(colData);
                    scope.evDataService.setColumns(scope.columns);

                    scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                };

                let initEventListeners = function () {

                	scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

						updateGroupTypeIds();

						setDefaultGroupType();

                		scope.groups = scope.evDataService.getGroups();
                		scope.evDataService.resetTableContent();

						if (scope.isReport) {
							syncColumnsWithGroups();
						}

                		evDataHelper.importGroupsStylesFromColumns(scope.groups, scope.columns)

						scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);

						// setFiltersLayoutNames();

						scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

					});

					scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

						evDataHelper.updateColumnsIds(scope.evDataService);
						evDataHelper.setColumnsDefaultWidth(scope.evDataService);

						scope.columns = scope.evDataService.getColumns();

						getColsAvailableForAdditions();
						flagMissingColumns();

						scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);
						setFiltersLayoutNames()
						//keysOfColsToHide = scope.evDataService.getKeysOfColumnsToHide();

					});

					scope.evEventService.addEventListener(evEvents.GROUPS_LEVEL_UNFOLD, function () {

						scope.groups = scope.evDataService.getGroups();
						evDataHelper.importGroupsStylesFromColumns(scope.groups, scope.columns)
						scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);
						setFiltersLayoutNames()

					});

					if (!scope.isReport) {
						scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
							getDownloadedTableItemsCount();
						});
					}

				};

                const init = function () {

					updateGroupTypeIds();

                    scope.columns = scope.evDataService.getColumns();
                    flagMissingColumns();

                    scope.notGroupingColumns = evDataHelper.separateNotGroupingColumns(scope.columns, scope.groups);
                    setFiltersLayoutNames();

                    evDataHelper.updateColumnsIds(scope.evDataService);
                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);
                    if (scope.viewContext === 'dashboard') {
                        getColsAvailableForAdditions();
                        //keysOfColsToHide = scope.evDataService.getKeysOfColumnsToHide();
                    }

					initEventListeners();

                };

                init();
            }
        }
    }


}());