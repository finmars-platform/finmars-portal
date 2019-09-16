(function () {

    'use strict';

    var rvDataHelper = require('../helpers/rv-data.helper');
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

                    var rowsCount = scope.rows.length + 2; // header / footer rows
                    var columnsCount = scope.columns.length + 2; // first empty cell and last "Total" cell

                    // console.log('elemWidth', elemWidth);
                    // console.log('elemHeight', elemHeight);
                    //
                    // console.log('rowsCount', rowsCount);
                    // console.log('columnsCount', columnsCount);

                    var minWidth = 100;
                    var minHeight = 24;

                    var cellWidth = Math.floor(elemWidth / columnsCount);
                    var cellHeight = Math.floor(elemHeight / rowsCount);

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

                scope.columnsTotalClick = function ($event) {

                    console.log('columnsTotalClick');

                    scope.activeItem = 'columns_total';

                    var activeObject = scope.evDataService.getActiveObject();

                    delete activeObject[scope.matrixSettings.abscissa];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.rowsTotalClick = function ($event) {

                    console.log('rowsTotalClick');

                    scope.activeItem = 'rows_total';

                    var activeObject = scope.evDataService.getActiveObject();

                    delete activeObject[scope.matrixSettings.ordinate];

                    console.log('activeObject', activeObject);

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
                        scope.matrixSettings.value_key);

                    console.log('scope.matrix', scope.matrix);

                    scope.totals = reportViewerMatrixHelper.getMatrixTotals(scope.matrix);

                    console.log('scope.totals', scope.totals);

                };

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.processing = false;

                        scope.createMatrix();

                        scope.$apply();

                        scope.alignGrid();


                    })

                };

                scope.init();

            }
        }
    }
}());