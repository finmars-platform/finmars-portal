(function () {

    'use strict';

    var rvDataHelper = require('../helpers/rv-data.helper');
    var renderHelper = require('../helpers/render.helper');
    var reportViewerMatrixHelper = require('../helpers/report-viewer-matrix.helper');

    var evEvents = require('../services/entityViewerEvents')

    module.exports = function () {
        return {
            restriction: 'E',
            templateUrl: 'views/directives/report-viewer-matrix-view.html',
            scope: {
                matrixSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                console.log('Report Viewer Matrix Component', scope);

                scope.processing = true;

                scope.alignGrid = function () {

                    var elemWidth = elem.width();
                    var elemHeight = elem.height();

                    console.log('elemHeight', elemHeight);
                    console.log('elemWidth', elemWidth);

                    var rowsCount = scope.rows.length + 2; // header / footer rows
                    var columnsCount = scope.columns.length + 2; // first empty cell and last "Total" cell

                    // console.log('elemWidth', elemWidth);
                    // console.log('elemHeight', elemHeight);
                    //
                    // console.log('rowsCount', rowsCount);
                    // console.log('columnsCount', columnsCount);

                    var minWidth = 100;
                    var minHeight = 20;

                    var cellWidth = Math.floor(elemWidth / columnsCount);
                    var cellHeight = Math.floor(elemHeight / rowsCount);

                    // cellHeight = cellHeight - 2; // 1px for border top / border bottom
                    // cellWidth = cellWidth - 2; // 1px for border left / border right

                    var items = elem.querySelectorAll('.report-viewer-matrix-cell');

                    var holder = elem.querySelectorAll('.report-viewer-matrix-holder')[0];

                    var fontSize = 16;

                    if (cellWidth < minWidth) {
                        cellWidth = minWidth
                    }

                    if (cellHeight < minHeight) {
                        cellHeight = minHeight
                    }

                    holder.style.width = columnsCount * cellWidth + 'px';
                    holder.style.height = rowsCount * cellHeight + 'px';

                    for (var i = 0; i < items.length; i = i + 1) {

                        items[i].style.width = cellWidth + 'px';
                        items[i].style.height = cellHeight + 'px';
                        items[i].style.paddingTop = Math.abs((cellHeight / 2 - fontSize / 2)) + 'px';

                    }

                };

                scope.singleColumnTotalClick = function ($event, index) {

                    console.log('singleColumnTotalClick index', index);

                    scope.activeItem = 'column_total:' + index;

                    var activeObject = scope.evDataService.getActiveObject();

                    activeObject[scope.matrixSettings.abscissa] = scope.columns[index];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.checkNegative = function (val) {

                    if (scope.matrixSettings.number_format) {

                        if (scope.matrixSettings.number_format.negative_color_format_id === 1) {

                            if (val % 1 === 0) { // check whether number is float or integer
                                if (parseInt(val) < 0) {
                                    return true
                                }
                            } else {
                                if (parseFloat(val) < 0) {
                                    return true
                                }
                            }
                        }

                    }

                    return false

                };

                scope.formatValue = function (val) {

                    if (scope.matrixSettings.number_format) {

                        return renderHelper.formatValue({
                            value: val
                        }, {
                            key: 'value',
                            report_settings: scope.matrixSettings.number_format
                        });

                    } else {
                        return val
                    }

                };

                scope.columnsTotalClick = function ($event) {

                    console.log('columnsTotalClick');

                    scope.activeItem = 'columns_total';

                    // var activeObject = scope.evDataService.getActiveObject();
                    //
                    // delete activeObject[scope.matrixSettings.abscissa];
                    //
                    // console.log('activeObject', activeObject);

                    var activeObject = {};

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.rowsTotalClick = function ($event) {

                    console.log('rowsTotalClick');

                    scope.activeItem = 'rows_total';

                    // var activeObject = scope.evDataService.getActiveObject();
                    //
                    // delete activeObject[scope.matrixSettings.ordinate];
                    //
                    // console.log('activeObject', activeObject);

                    var activeObject = {};

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.totalClick = function ($event) {

                    console.log('totalClick');

                    scope.activeItem = 'total';

                    var activeObject = {};

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.singleRowTotalClick = function ($event, index) {

                    console.log('singleRowTotalClick, index', index);

                    scope.activeItem = 'row_total:' + index;

                    var activeObject = scope.evDataService.getActiveObject();

                    activeObject[scope.matrixSettings.ordinate] = scope.rows[index];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.cellClick = function ($event, rowIndex, columnIndex) {

                    console.log('singleRowTotalClick rowIndex, columnIndex', rowIndex, columnIndex);

                    scope.activeItem = 'cell:' + rowIndex + ':' + columnIndex;

                    var activeObject = scope.evDataService.getActiveObject();

                    activeObject[scope.matrixSettings.ordinate] = scope.rows[rowIndex];
                    activeObject[scope.matrixSettings.abscissa] = scope.columns[columnIndex];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.createMatrix = function () {

                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);
                    var itemList = flatList.filter(function (item) {
                        return item.___type === 'object'
                    });

                    // console.log('scope.matrixSettings', scope.matrixSettings);
                    //
                    // console.log('Report Viewer Status: flatList', flatList);

                    scope.columns = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.abscissa);
                    scope.rows = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.ordinate);

                    // console.log('scope.columns ', scope.columns);
                    // console.log('scope.rows ', scope.rows);

                    scope.matrix = reportViewerMatrixHelper.getMatrix(itemList,
                        scope.rows,
                        scope.columns,
                        scope.matrixSettings.ordinate,
                        scope.matrixSettings.abscissa,
                        scope.matrixSettings.value_key,
                        scope.matrixSettings.subtotal_formula_id);

                    // console.log('scope.matrix', scope.matrix);

                    scope.totals = reportViewerMatrixHelper.getMatrixTotals(scope.matrix);

                    // console.log('scope.totals', scope.totals);

                };

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    scope.top_left_title = scope.matrixSettings.top_left_title;

                    // If we already have data (e.g. viewType changed) start
                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);

                    if (flatList.length > 1) {

                        scope.processing = false;

                        scope.createMatrix();

                        setTimeout(function () {

                            scope.$apply();

                            scope.alignGrid();
                        }, 0)
                    }

                    // If we already have data (e.g. viewType changed) end

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.processing = false;

                        scope.createMatrix();

                        scope.$apply();

                        scope.alignGrid();


                    });

                };

                scope.init();

            }
        }
    }
}());