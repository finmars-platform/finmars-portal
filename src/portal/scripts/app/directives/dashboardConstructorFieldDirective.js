/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents')

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            scope: {
                tabNumber: '=',
                rowNumber: '=',
                columnNumber: '=',
                item: '=',
                dashboardConstructorDataService: '=',
                dashboardConstructorEventService: '=',
                attributeDataService: '='
            },
            templateUrl: 'views/directives/dashboard-constructor-field-view.html',
            link: function (scope, elem, attr) {
                console.log("d3 service dashboard field", scope.item);
                scope.getVerboseType = function () {

                    var verboseType = 'Unknown';

                    switch (scope.item.data.type) {
                        case 'report_viewer':
                            verboseType = 'Report Viewer';
                            break;
                        case 'report_viewer_split_panel':
                            verboseType = 'Report Viewer Split Panel';
                            break;
                        case 'report_viewer_grand_total':
                            verboseType = 'Report Viewer Grand Total';
                            break;
                        case 'report_viewer_bars_chart':
                            verboseType = 'Report Viewer Charts';
                            break;
                        case 'report_viewer_matrix':
                            verboseType = 'Report Viewer Matrix';
                            break;
                        case 'entity_viewer':
                            verboseType = 'Entity Viewer';
                            break;
                        case 'entity_viewer_split_panel':
                            verboseType = 'Entity Viewer Split Panel';
                            break;
                        case 'input_form':
                            verboseType = 'Input Form';
                            break;
                        case 'control':
                            verboseType = 'Control';
                            break;
                        case 'button_set':
                            verboseType = 'Button Set';
                            break;
                    }

                    return verboseType;

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

                    if (scope.tabNumber === 'fixed_area') {
                        row = layout.data.fixed_area.layout.rows[scope.rowNumber];
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                        row = tab.layout.rows[scope.rowNumber];
                    }

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

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

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

                scope.clearElemSpans = function () {

                    var layout = scope.dashboardConstructorDataService.getData();

                    var tab;
                    var row;
                    var item;

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

                    for (var r = 0; r < tab.layout.rows.length; r = r + 1) {

                        row = tab.layout.rows[r];

                        for (var c = scope.columnNumber; c < row.columns.length; c = c + 1) {

                            item = row.columns[c];

                            if (item.is_hidden === true) {

                                if (item.hidden_by.row_number === scope.rowNumber &&
                                    item.hidden_by.column_number === scope.columnNumber) {

                                    delete item.is_hidden
                                    delete item.hidden_by

                                }


                            }

                        }

                    }

                };

                scope.changeSpan = function () {

                    var layout = scope.dashboardConstructorDataService.getData();
                    var tab;
                    var row;
                    var item;

                    scope.clearElemSpans();

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

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

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

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


                    if (scope.tabNumber === 'fixed_area') {

                        layout.data.fixed_area.layout.rows = layout.data.fixed_area.layout.rows.map(function (row) {

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

                    } else {

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
                    }
                    scope.dashboardConstructorDataService.setData(layout);

                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR);
                    scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE);

                };

                scope.syncWithComponentType = function () {

                    var layout = scope.dashboardConstructorDataService.getData();

                    scope.item.data = layout.data.components_types.find(function (item) {

                        return item.id === scope.item.data.id

                    });

                };

                scope.editComponentType = function ($event, item) {

                    var contrName = '';
                    var templateUrl = '';

                    var locals = {
                        item: JSON.parse(JSON.stringify(item)),
                        dataService: scope.dashboardConstructorDataService,
                        eventService: scope.dashboardConstructorEventService,
                        attributeDataService: scope.attributeDataService
                    };

                    switch (item.type) {
                        case 'control':
                            contrName = 'DashboardConstructorControlComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-control-component-dialog-view.html';
                            break;
                        case 'report_viewer':
                            contrName = 'DashboardConstructorReportViewerComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-component-dialog-view.html';
                            break;
                        case 'report_viewer_split_panel':
                            contrName = 'DashboardConstructorReportViewerSplitPanelComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-split-panel-component-dialog-view.html';
                            break;
                        case 'report_viewer_grand_total':
                            contrName = 'DashboardConstructorReportViewerGrandTotalComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-grand-total-component-dialog-view.html';
                            break;
                        case 'report_viewer_bars_chart':
                            contrName = 'DashboardConstructorReportViewerChartsComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-charts-component-dialog-view.html';
                            break;
                        case 'report_viewer_matrix':
                            contrName = 'DashboardConstructorReportViewerMatrixComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-report-viewer-matrix-component-dialog-view.html';
                            break;
                        case 'entity_viewer':
                            contrName = 'DashboardConstructorEntityViewerComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-component-dialog-view.html';
                            break;
                        case 'entity_viewer_split_panel':
                            contrName = 'DashboardConstructorEntityViewerSplitPanelComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-entity-viewer-split-panel-component-dialog-view.html';
                            break;
                        case 'button_set':
                            contrName = 'DashboardConstructorButtonSetComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-button-set-component-dialog-view.html';
                            break;
                        case 'input_form':
                            contrName = 'DashboardConstructorInputFormComponentDialogController as vm';
                            templateUrl = 'views/dialogs/dashboard-constructor/dashboard-constructor-input-form-component-dialog-view.html';
                            break;
                    }
                    ;

                    if (contrName && templateUrl) {
                        $mdDialog.show({
                            controller: contrName,
                            templateUrl: templateUrl,
                            targetEvent: $event,
                            multiple: true,
                            preserveScope: true,
                            autoWrap: true,
                            skipHide: true,
                            locals: locals
                        }).then(function (value) {

                            scope.syncWithComponentType();

                            scope.dashboardConstructorEventService.dispatchEvent(dashboardConstructorEvents.UPDATE_DASHBOARD_CONSTRUCTOR)

                        });
                    }
                    ;

                };


            }
        }
    }

}());