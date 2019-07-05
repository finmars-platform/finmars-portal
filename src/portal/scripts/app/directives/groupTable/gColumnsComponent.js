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
                contentWrapElement: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {

                scope.columns = scope.evDataService.getColumns();
                scope.entityType = scope.evDataService.getEntityType();
                scope.components = scope.evDataService.getComponents();
                scope.groups = scope.evDataService.getGroups();

                scope.isReport = ['balance-report',
                    'cash-flow-projection-report',
                    'performance-report', 'pl-report',
                    'transaction-report'].indexOf(scope.entityType) !== -1;

                scope.isAllSelected = scope.evDataService.getSelectAllRowsState();

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

                        if (item.results && item.results.length) {

                            item.results.forEach(function (childItem) {

                                childItem.___is_activated = scope.isAllSelected;

                            })

                        }

                    });

                    scope.evDataService.setSelectAllRowsState(scope.isAllSelected);
                    scope.evDataService.setAllData(dataList);

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                    console.timeEnd('Selecting all rows');

                };

                scope.isColumnFloat = function (column) {

                    return column.value_type == 20
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

                        if (column.key === item.key || column.id === item.id) {
                            item = column
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
                };

                scope.checkSubtotalFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.subtotal_formula_id === type) {
                            return true;
                        }

                    }

                    return false

                };

                scope.renameColumn = function (column, $mdMenu, $event) {

                    $mdMenu.close();

                    console.log('renameColumn', column);

                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
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
                };

                scope.checkRoundFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.round_format_id == type) {
                            return true;
                        }

                    }
                    return false
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
                };

                scope.checkNegativeFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.negative_format_id == type) {
                            return true;
                        }

                    }
                    return false
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
                };

                scope.checkZeroFormatFormula = function (column, type) {

                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.zero_format_id == type) {
                            return true;
                        }

                    }
                    return false
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

                var dragAndDrop = {

                    init: function () {
                        this.dragulaInit();
                        this.eventListeners();
                    },

                    eventListeners: function () {

                        this.dragula.on('over', function (elem, container, source) {

                            $(container).addClass('active');
                            $(container).on('mouseleave', function () {
                                $(this).removeClass('active');
                            })
                        });
                        this.dragula.on('drop', function (elem, target) {
                            $(target).removeClass('active');
                        });

                        this.dragula.on('dragend', function (element) {

                            var parent = element.parentElement;

                            var elemItems = parent.querySelectorAll('.g-cell.g-column');

                            console.log('elemItems', elemItems);

                            var result = [];
                            var columns = scope.evDataService.getColumns();

                            for (var i = 0; i < elemItems.length; i = i + 1) {

                                // console.log('elemItems[i].dataset.columnId', elemItems[i].dataset.columnId);

                                for (var x = 0; x < columns.length; x = x + 1) {

                                    // console.log('columns[x].___column_id', columns[x].___column_id);

                                    if (elemItems[i].dataset.columnId === columns[x].___column_id) {
                                        result.push(columns[x]);
                                    }

                                }

                            }

                            var isChanged = false;

                            console.log('result', result);
                            console.log('columns', columns);

                            result.forEach(function (resultItem, index) {

                                if (resultItem.___column_id !== columns[index].___column_id) {
                                    isChanged = true;
                                }


                            });

                            console.log('isChanged', isChanged);

                            if (isChanged) {

                                scope.evDataService.setColumns(result);

                                scope.evEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);

                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                                scope.$apply();

                            }

                        })
                    },

                    dragulaInit: function () {

                        var items = [document.querySelector('.g-columns-holder')];

                        this.dragula = dragula(items);
                    }
                };

                if (!scope.isReport) {
                    setTimeout(function () {
                        dragAndDrop.init();
                    }, 500);
                }

                scope.isSortable = function (column) {

                    if (column.hasOwnProperty('key')) {

                        if (['accounts', 'counterparties', 'responsibles', 'transaction_types', 'portfolios'].indexOf(column.key) !== -1) {
                            return false;
                        }

                    }

                    return true;

                };

                scope.checkForExistingGroupingColumn = function (index) {
                    var groups = scope.evDataService.getGroups();
                    if (groups.length > 0 && index <= groups.length - 1) {
                        return false;
                    } else {
                        return true;
                    }
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
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE)

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

                };

                scope.triggerResizeTableHeadColumns = function () {
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_HEAD_COLUMNS_SIZE);
                };

                var init = function () {

                    evDataHelper.updateColumnsIds(scope.evDataService);
                    evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                    scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                        evDataHelper.updateColumnsIds(scope.evDataService);
                        evDataHelper.setColumnsDefaultWidth(scope.evDataService);

                        scope.columns = scope.evDataService.getColumns();

                    });

                    scope.evEventService.addEventListener(evEvents.GROUPS_LEVEL_UNFOLD, function () {

                        scope.groups = scope.evDataService.getGroups();

                    })

                };

                init();
            }
        }
    }


}());