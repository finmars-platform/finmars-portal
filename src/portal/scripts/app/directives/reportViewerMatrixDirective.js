(function () {

    'use strict';

    var rvDataHelper = require('../helpers/rv-data.helper');
    var renderHelper = require('../helpers/render.helper');

    var reportViewerMatrixHelper = require('../helpers/report-viewer-matrix.helper');

    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
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

                // console.log('Report Viewer Matrix Component', scope);

                scope.processing = true;

                scope.viewContext = scope.evDataService.getViewContext();
                scope.dashboardFilterCollapsed = true;
                scope.matrixView = scope.matrixSettings.matrix_view;

                var cellWidth = 0;

                var matrixHolder;
                var bodyScrollElem;
                var rvmHeaderScrollableRow;
                var rvmBottomRowScrollableElem;
                var bodyScrollableElem;
                var rvMatrixValueRowsHolder;
                var rvMatrixFixedBottomRow;
                var rvMatrixLeftCol;
                var rvMatrixRightCol;

                var getElemsForScripts = function () {
                    matrixHolder = elem[0].querySelector('.rvMatrixHolder');

                    bodyScrollElem = elem[0].querySelector('.rvMatrixBodyScrolls');
                    rvmHeaderScrollableRow = elem[0].querySelector('.rvmHeaderScrollableRow');
                    rvmBottomRowScrollableElem = elem[0].querySelector('.rvmBottomRowScrollableElem');

                    bodyScrollableElem = elem[0].querySelectorAll('.scrollableMatrixBodyColumn');

                    rvMatrixValueRowsHolder = elem[0].querySelector('.rvMatrixValueRowsHolder');
                    rvMatrixFixedBottomRow = elem[0].querySelector('.rvMatrixFixedBottomRow');

                    rvMatrixLeftCol = elem[0].querySelector('.rvMatrixLeftCol');
                    rvMatrixRightCol = elem[0].querySelector('.rvMatrixRightCol');
                };

                scope.alignGrid = function () {

                    var elemWidth = elem.width();
                    //var elemHeight = elem.height();

                    // console.log('elemHeight', elemHeight);
                    // console.log('elemWidth', elemWidth);

                    var rowsCount = scope.rows.length + 2; // add header and footer rows
                    var columnsCount = scope.columns.length + 2; // add left and right fixed columns

                    var minWidth = 100;
                    //var minHeight = 20;

                    var matrixHolderMinHeight = elem[0].querySelector('.report-viewer-matrix').clientHeight;

                    console.log('matrixHolderMinHeight', matrixHolderMinHeight);

                    cellWidth = Math.floor(elemWidth / columnsCount);
                    //var cellHeight = Math.floor(elemHeight / rowsCount);
                    var cellHeight = 25;

                    var items = elem[0].querySelectorAll('.rvMatrixCell');

                    var fontSize = 16;

                    if (cellWidth < minWidth) {
                        cellWidth = minWidth;
                    }

                    if (scope.matrixView === 'fixed-totals') {

                        rvmBottomRowScrollableElem.style.left = cellWidth + 'px';
                        rvMatrixRightCol.style.width = cellWidth + 'px';
                        rvMatrixFixedBottomRow.style.height = cellHeight + 'px';

                    }

                    // because of children with absolute positioning, elem below requires manual width setting
                    rvMatrixLeftCol.style.width = cellWidth + 'px';

                    var matrixMaxWidth = columnsCount * cellWidth;
                    var matrixMaxHeight = rowsCount * cellHeight;

                    if (scope.matrixView === 'fixed-totals') {
                        rvmBottomRowScrollableElem.style.width = matrixMaxWidth + 'px';
                    }

                    var matrixVCContainerWidth = matrixMaxWidth - cellWidth; // subtract width of column with names
                    var matrixVCContainerHeight = matrixMaxHeight - cellHeight; // subtract height of matrix header

                    var matrixProbableHeight = rowsCount * cellHeight;

                    var matrixVCAvailableWidth = matrixHolder.clientWidth - cellWidth;
                    var matrixVCAvailableHeight = matrixHolder.clientHeight - cellHeight;
                    // whether matrix has scrolls
                    if (matrixVCAvailableWidth < matrixVCContainerWidth) {
                        matrixHolder.classList.add('has-x-scroll');
                        matrixProbableHeight = matrixProbableHeight + 14; // add space for scroll
                    } else {
                        matrixHolder.classList.remove('has-x-scroll');
                    }

                    if (matrixVCAvailableHeight < matrixVCContainerHeight) {
                        matrixHolder.classList.add('has-y-scroll');
                    } else {
                        matrixHolder.classList.remove('has-y-scroll');
                    }

                    if (matrixProbableHeight < matrixHolder.clientHeight) {
                        matrixHolder.style.height = matrixProbableHeight + 'px';
                    } else {
                        matrixHolder.style.height = matrixHolderMinHeight + 'px';
                    }

                    rvMatrixValueRowsHolder.style.width = matrixVCContainerWidth + 'px';
                    rvMatrixValueRowsHolder.style.height = matrixVCContainerHeight + 'px';

                    for (var i = 0; i < bodyScrollableElem.length; i++) {
                        bodyScrollableElem[i].style.height = matrixVCContainerHeight + 'px';
                    }

                    rvmHeaderScrollableRow.style.width = matrixMaxWidth + 'px';

                    for (var i = 0; i < items.length; i = i + 1) {

                        items[i].style.width = cellWidth + 'px';
                        items[i].style.height = cellHeight + 'px';
                        items[i].style.paddingTop = Math.abs((cellHeight / 2 - fontSize / 2)) + 'px';

                    }

                };

                var scrollHeaderAndColumn = function () {
                    rvmHeaderScrollableRow.style.left = -bodyScrollElem.scrollLeft + 'px';
                    if (rvmBottomRowScrollableElem) {
                        rvmBottomRowScrollableElem.style.left = (cellWidth - bodyScrollElem.scrollLeft) + 'px';
                    }

                    for (var c = 0; c < bodyScrollableElem.length; c++) {
                        bodyScrollableElem[c].style.top = -bodyScrollElem.scrollTop + 'px';
                    }
                };

                var initMatrixMethods = function () {
                    getElemsForScripts();
                    scope.alignGrid();

                    bodyScrollElem.addEventListener('scroll', scrollHeaderAndColumn);
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

                scope.singleColumnTotalClick = function ($event, index) {

                    scope.activeItem = 'column_total:' + index;

                    var activeObject = {};

                    activeObject[scope.matrixSettings.abscissa] = scope.columns[index];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.singleRowTotalClick = function ($event, index) {

                    console.log('singleRowTotalClick, index', index);

                    scope.activeItem = 'row_total:' + index;

                    var activeObject = {};

                    activeObject[scope.matrixSettings.ordinate] = scope.rows[index];

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.cellClick = function ($event, rowIndex, columnIndex) {

                    console.log('singleRowTotalClick rowIndex, columnIndex', rowIndex, columnIndex);

                    scope.activeItem = 'cell:' + rowIndex + ':' + columnIndex;

                    var activeObject = {};

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

                    scope.columns = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.abscissa);
                    scope.rows = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.ordinate);

                    scope.matrix = reportViewerMatrixHelper.getMatrix(itemList,
                        scope.rows,
                        scope.columns,
                        scope.matrixSettings.ordinate,
                        scope.matrixSettings.abscissa,
                        scope.matrixSettings.value_key,
                        scope.matrixSettings.subtotal_formula_id);

                    scope.totals = reportViewerMatrixHelper.getMatrixTotals(scope.matrix);

                };

                scope.setNumberFormatPreset = function(preset){

                    switch (preset) {

                        case 'price':
                            scope.matrixSettings.number_format.zero_format_id = 1;
                            scope.matrixSettings.number_format.negative_color_format_id = 0;
                            scope.matrixSettings.number_format.negative_format_id = 0;
                            scope.matrixSettings.number_format.round_format_id = 1;
                            scope.matrixSettings.number_format.percentage_format_id = 0;
                            break;
                        case 'market_value':
                            scope.matrixSettings.number_format.zero_format_id = 1;
                            scope.matrixSettings.number_format.negative_color_format_id = 1;
                            scope.matrixSettings.number_format.negative_format_id = 1;
                            scope.matrixSettings.number_format.thousands_separator_format_id = 2;
                            scope.matrixSettings.number_format.round_format_id = 1;
                            scope.matrixSettings.number_format.percentage_format_id = 0;
                            break;
                        case 'amount':
                            scope.matrixSettings.number_format.zero_format_id = 1;
                            scope.matrixSettings.number_format.negative_color_format_id = 1;
                            scope.matrixSettings.number_format.negative_format_id = 0;
                            scope.matrixSettings.number_format.thousands_separator_format_id = 2;
                            scope.matrixSettings.number_format.round_format_id = 3;
                            scope.matrixSettings.number_format.percentage_format_id = 0;
                            break;
                        case 'exposure':
                            scope.matrixSettings.number_format.zero_format_id = 1;
                            scope.matrixSettings.number_format.negative_color_format_id = 1;
                            scope.matrixSettings.number_format.negative_format_id = 1;
                            scope.matrixSettings.number_format.round_format_id = 0;
                            scope.matrixSettings.number_format.percentage_format_id = 2;
                            break;
                        case 'return':
                            scope.matrixSettings.number_format.zero_format_id = 1;
                            scope.matrixSettings.number_format.negative_color_format_id = 1;
                            scope.matrixSettings.number_format.negative_format_id = 0;
                            scope.matrixSettings.number_format.percentage_format_id = 3;
                            break;
                    }

                };

                scope.openNumberFormatSettings = function($event){

                    $mdDialog.show({
                        controller: 'NumberFormatSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/number-format-settings-dialog-view.html',
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                settings: scope.matrixSettings.number_format
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.matrixSettings.number_format = res.data.settings;

                        }

                    });

                };

                scope.setSubtotalType = function(subtotal_formula_id){

                    scope.matrixSettings.subtotal_formula_id = subtotal_formula_id;

                    scope.createMatrix();

                    setTimeout(function () {

                        scope.$apply();

                        initMatrixMethods();
                    }, 0)

                };

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    scope.top_left_title = scope.matrixSettings.top_left_title;
                    scope.styles = scope.matrixSettings.styles;

                    // If we already have data (e.g. viewType changed) start
                    var flatList = rvDataHelper.getFlatStructure(scope.evDataService);

                    if (flatList.length > 1) {

                        scope.processing = false;

                        scope.createMatrix();

                        setTimeout(function () {

                            scope.$apply();

                            initMatrixMethods();
                        }, 0)
                    }

                    // If we already have data (e.g. viewType changed) end

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                        scope.processing = false;

                        scope.createMatrix();

                        scope.$apply();

                        initMatrixMethods();

                    });

                    scope.evEventService.addEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, function () {

                        console.log("Align Grid");

                        scope.alignGrid();

                    });


                    window.addEventListener('resize', scope.alignGrid);

                };

                scope.init();

                scope.$on('$destroy', function () {
                    window.removeEventListener('resize', scope.alignGrid);
                });

            }
        }
    }
}());