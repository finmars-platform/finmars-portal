/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var evEvents = require('../../services/entityViewerEvents');
    var evDataHelper = require('../../helpers/ev-data.helper');

    var metaService = require('../../services/metaService');

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                items: '=',
                options: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/columns-view.html',
            link: function (scope, elem, attrs) {

                if (scope.options) {
                    scope.sorting = scope.options.sorting;
                }

                scope.columns = scope.evDataService.getColumns();
                scope.entityType = scope.evDataService.getEntityType();
                scope.components = scope.evDataService.getComponents();


                scope.isReport = ['balance-report',
                    'cash-flow-projection-report',
                    'performance-report', 'pnl-report',
                    'transaction-report'].indexOf(scope.entityType) !== -1;

                console.log('COLUMNS scope.isReport', scope.isReport);

                var baseAttrs = [];
                var entityAttrs = [];
                if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(scope.entityType) === -1) {
                    baseAttrs = metaService.getBaseAttrs();
                }
                entityAttrs = metaService.getEntityAttrs(scope.entityType);

                scope.isAllSelected = scope.evDataService.getSelectAllRowsState();


                scope.selectAllRows = function () {

                    console.time('Selecting all rows');

                    var dataList = scope.evDataService.getDataAsList();

                    scope.isAllSelected = scope.evDataService.getSelectAllRowsState();

                    scope.isAllSelected = !scope.isAllSelected;

                    dataList.forEach(function (item) {

                        item.___is_selected = scope.isAllSelected;

                        if (item.results && item.results.length) {

                            item.results.forEach(function (childItem) {

                                childItem.___is_selected = scope.isAllSelected;

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

                    // if (column.hasOwnProperty('id')) {
                    //     scope.sorting.column.id = column.id;
                    //     scope.sorting.column.key = null;
                    //     scope.sorting.column.sort = sort;
                    // } else {
                    //     scope.sorting.column.id = null;
                    //     scope.sorting.column.key = column.key;
                    //     scope.sorting.column.sort = sort;
                    // }


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

                var dragAndDrop = {

                    init: function () {

                        console.log('Reinit dragula', this);

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

                            }

                        })
                    },

                    dragulaInit: function () {

                        var items = [document.querySelector('.g-columns-holder')];

                        this.dragula = dragula(items);
                    }
                };

                setTimeout(function () {
                    dragAndDrop.init();
                }, 500);

                scope.isSortable = function (column) {

                    if (column.hasOwnProperty('key')) {

                        if (['accounts', 'counterparties', 'responsibles', 'transaction_types', 'portfolios'].indexOf(column.key) !== -1) {
                            return false;
                        }

                    }

                    return true;

                    // var b, e;
                    // if (baseAttrs && baseAttrs.length) {
                    //     for (b = 0; b < baseAttrs.length; b = b + 1) {
                    //         if (baseAttrs[b].key === column.key && baseAttrs[b].key !== 'notes') {
                    //             return true;
                    //         }
                    //     }
                    // }
                    // if (entityAttrs && entityAttrs.length) {
                    //     for (e = 0; e < entityAttrs.length; e = e + 1) {
                    //         if (entityAttrs[e].key === column.key) {
                    //             return true;
                    //         }
                    //     }
                    // }
                    //
                    // return false;
                };

                scope.removeColumn = function (column) {
                    if (column.id) {
                        scope.columns = scope.columns.map(function (item) {
                            if (item.id === column.id || item.key === column.key) {
                                item = undefined
                            }
                            return item
                        }).filter(function (item) {
                            return !!item;
                        });
                    } else {
                        if (column.key) {
                            scope.columns = scope.columns.map(function (item) {
                                if (item.key === column.key) {
                                    return undefined
                                }
                                return item
                            }).filter(function (item) {
                                return !!item;
                            });
                        }

                    }

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

                        console.log('gColumnsComponent.columns', scope.columns)

                    });


                };

                init();
            }
        }
    }


}());