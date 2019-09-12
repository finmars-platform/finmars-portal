/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents')

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardConstructorDataService: '=',
                dashboardConstructorEventService: '='
            },
            templateUrl: 'views/directives/dashboard-constructor-field-view.html',
            link: function (scope, elem, attr) {

                scope.getVerboseType = function () {

                    if (scope.item.data.type === 'report_viewer') {
                        return 'Report Viewer'
                    }

                    if (scope.item.data.type === 'report_viewer_split_panel') {
                        return 'Report Viewer Split Panel'
                    }

                    if (scope.item.data.type === 'entity_viewer') {
                        return 'Entity Viewer'
                    }

                    if (scope.item.data.type === 'entity_viewer_split_panel') {
                        return 'Entity Viewer Split Panel'
                    }

                    if (scope.item.data.type === 'input_form') {
                        return 'Input Form'
                    }

                    if (scope.item.data.type === 'control') {
                        return 'Control'
                    }

                    if (scope.item.data.type === 'button_set') {
                        return 'Button Set'
                    }

                    return 'Unknown'

                };

                scope.toggleFieldEditMode = function () {

                    var layout = scope.dashboardConstructorDataService.getData();

                    layout.data.tabs = layout.data.tabs.map(function (tab) {

                        tab.layout.rows = tab.layout.rows.map(function (row) {

                            row.columns = row.columns.map(function (item) {

                                item.editMode = false;

                                return item
                            });

                            return row

                        });

                        return tab
                    });

                    scope.dashboardConstructorDataService.setData(layout);

                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

                    scope.item.editMode = true;

                    scope.calculateColspanList();
                    scope.calculateRowspanList();

                };

                scope.cancelFieldEdit = function () {
                    scope.item.editMode = false
                };

                scope.colspanList = [1];
                scope.rowspanList = [1];

                scope.calculateColspanList = function () {

                    var result = [scope.columnNumber];

                    var layout = scope.dashboardConstructorDataService.getData();
                    var tab;
                    var row;
                    var item;

                    tab = layout.data.tabs[scope.tabNumber];
                    row = tab.layout.rows[scope.rowNumber];

                    for (var c = scope.columnNumber + 1; c < row.columns.length; c = c + 1) {

                        item = row.columns[c];

                        if (item.cell_type === 'empty') {

                            if (item.is_hidden) {

                                if (item.hidden_by.row_number === scope.rowNumber &&
                                    item.hidden_by.column_number === scope.columnNumber) {

                                    result.push(item.column_number)

                                } else {
                                    break;
                                }

                            } else {

                                result.push(item.column_number)
                            }

                        } else {
                            break;
                        }

                    }

                    scope.colspanList = result.map(function (item, index) {
                        return index + 1
                    });

                };

                scope.calculateRowspanList = function () {

                    var result = [scope.rowNumber];

                    var layout = scope.dashboardConstructorDataService.getData();
                    var tab;
                    var row;
                    var item;

                    tab = layout.data.tabs[scope.tabNumber];

                    for (var r = scope.rowNumber + 1; r < tab.layout.rows.length; r = r + 1) {

                        row = tab.layout.rows[r];
                        item = row.columns[scope.columnNumber];

                        if (item.cell_type === 'empty') {

                            if (item.is_hidden) {

                                if (item.hidden_by.row_number === scope.rowNumber &&
                                    item.hidden_by.column_number === scope.columnNumber) {

                                    result.push(item.row_number)

                                } else {
                                    break;
                                }

                            } else {

                                result.push(row.row_number)
                            }

                        } else {
                            break
                        }

                    }

                    scope.rowspanList = result.map(function (item, index) {
                        return index + 1
                    });

                };

                scope.changeSpan = function () {

                    var layout = scope.dashboardConstructorDataService.getData();
                    var tab;
                    var row;
                    var item;

                    tab = layout.data.tabs[scope.tabNumber];

                    for (var r = scope.rowNumber; r < scope.rowNumber + scope.item.rowspan; r = r + 1) {

                        row = tab.layout.rows[r];

                        for (var c = scope.columnNumber; c < scope.columnNumber + scope.item.colspan; c = c + 1) {

                            item = row.columns[c];
                            item.is_hidden = true;
                            item.hidden_by = {
                                row_number: scope.rowNumber,
                                column_number: scope.columnNumber
                            }

                        }

                    }

                    scope.dashboardConstructorDataService.setData(layout)

                };

                scope.saveField = function () {

                    scope.item.editMode = false;

                    console.log('saveField scope.item', scope.item);

                    var layout = scope.dashboardConstructorDataService.getData();

                    layout.data.tabs = layout.data.tabs.map(function (tab) {

                        if (tab.tab_number === scope.tabNumber) {

                            tab.layout.rows = tab.layout.rows.map(function (row) {

                                if (row.row_number === scope.rowNumber) {

                                    row.columns = row.columns.map(function (item) {

                                        if (item.column_number === scope.columnNumber) {

                                            return scope.item

                                        }

                                        return item
                                    });

                                }

                                return row

                            });

                        }

                        return tab

                    });

                    scope.dashboardConstructorDataService.setData(layout);

                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

                };

                scope.deleteField = function () {

                    console.log('scope.tab_number', scope.tabNumber);
                    console.log('scope.row_number', scope.rowNumber);
                    console.log('scope.column_number', scope.columnNumber);

                    var layout = scope.dashboardConstructorDataService.getData();

                    // set hidden empty cells to visible start

                    var tab;
                    var row;
                    var item;

                    tab = layout.data.tabs[scope.tabNumber];

                    for (var r = scope.rowNumber; r < scope.rowNumber + scope.item.rowspan; r = r + 1) {

                        row = tab.layout.rows[r];

                        for (var c = scope.columnNumber; c < scope.columnNumber + scope.item.colspan; c = c + 1) {

                            item = row.columns[c];
                            delete item.is_hidden;
                            delete item.hidden_by;

                        }

                    }

                    console.log('tab', tab);

                    // set hidden empty cells to visible end


                    layout.data.tabs = layout.data.tabs.map(function (tab) {

                        if (tab.tab_number === scope.tabNumber) {

                            tab.layout.rows = tab.layout.rows.map(function (row) {

                                if (row.row_number === scope.rowNumber) {

                                    row.columns = row.columns.map(function (item) {

                                        if (item.column_number === scope.columnNumber) {

                                            return {
                                                column_number: scope.columnNumber,
                                                cell_type: 'empty',
                                                colspan: 1,
                                                rowspan: 1,
                                                data: {},
                                                options: {}
                                            };

                                        }

                                        return item
                                    });

                                }

                                return row

                            });

                        }

                        return tab

                    });

                    scope.dashboardConstructorDataService.setData(layout);

                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);
                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

                };

                scope.init = function () {

                };

                scope.init();


            }
        }
    }

}());