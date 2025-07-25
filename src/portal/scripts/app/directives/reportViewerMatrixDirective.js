(function () {

    'use strict';

    var renderHelper = require('../helpers/render.helper');
    var evHelperService = require('../services/entityViewerHelperService').default;

    var reportViewerMatrixHelper = require('../helpers/report-viewer-matrix.helper');

    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog, groupsService) {
        return {
            restriction: 'E',
            scope: {
                matrixSettings: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/report-viewer-matrix-view.html',
            link: function (scope, elem, attr) {

                scope.activeItem = null;

                // console.log('Report Viewer Matrix Component', scope);
                scope.processing = true;
                scope.matrixCreationInProgress = false;

                scope.viewContext = scope.evDataService.getViewContext();
                scope.dashboardFilterCollapsed = true;
                scope.matrixView = scope.matrixSettings.matrix_view;
                scope.emptyLinesHidingType = '';

                scope.availableAbscissaAttrs = scope.matrixSettings.available_abscissa_keys || [];
                if (scope.availableAbscissaAttrs.length) scope.availableAbscissaAttrs = JSON.parse(angular.toJson(scope.availableAbscissaAttrs));

                scope.availableOrdinateAttrs = scope.matrixSettings.available_ordinate_keys || [];
                if (scope.availableOrdinateAttrs.length) scope.availableOrdinateAttrs = JSON.parse(angular.toJson(scope.availableOrdinateAttrs));

                scope.availableValueAttrs = scope.matrixSettings.available_value_keys || [];
                if (scope.availableValueAttrs.length) scope.availableValueAttrs = JSON.parse(angular.toJson(scope.availableValueAttrs));

                if (scope.matrixSettings.hide_empty_lines) {
                    scope.emptyLinesHidingType = scope.matrixSettings.hide_empty_lines;
                }

                scope.canChangeAbscissaAttr = false;
                scope.canChangeOrdinateAttr = false;
                scope.canChangeValueAttr = false;

                // var cellWidth = 0;
                var nameColWidth = 0;
                var measuringCanvas;
                var cellHorPaddings = 16; // based on paddings inside .rv-matrix-cell-mixin() inside report-viewer-matrix.less

                var matrixElem;
                var matrixWrap, matrixHolder;
                var bodyScrollElem;
                var rvmHeaderScrollableRow;
                var rvmBottomRowScrollableElem;
                var bodyScrollableElem;
                var axisAttrsSelectorHolder;
                var rvMatrixValueRowsHolder;
                var rvMatrixFixedBottomRow;
                var rvMatrixLeftCol;
                var rvMatrixRightCol;

                var clearUseFromAboveFilterId;
                var itemList;

                var getElemsForScripts = function () {

                    matrixElem = $(elem)[0].querySelector('.rvMatrix');
                    matrixWrap = $(elem)[0].querySelector('.rvMatrixWrap');
                    matrixHolder = $(elem)[0].querySelector('.rvMatrixHolder');

                    bodyScrollElem = $(elem)[0].querySelector('.rvMatrixBodyScrolls');
                    rvmHeaderScrollableRow = $(elem)[0].querySelector('.rvmHeaderScrollableRow');
                    rvmBottomRowScrollableElem = $(elem)[0].querySelector('.rvmBottomRowScrollableElem');
                    bodyScrollableElem = $(elem)[0].querySelectorAll('.scrollableMatrixBodyColumn');

                    rvMatrixValueRowsHolder = $(elem)[0].querySelector('.rvMatrixValueRowsHolder');
                    rvMatrixFixedBottomRow = $(elem)[0].querySelector('.rvMatrixFixedBottomRow');

                    rvMatrixLeftCol = $(elem)[0].querySelector('.rvMatrixLeftCol');
                    rvMatrixRightCol = $(elem)[0].querySelector('.rvMatrixRightCol');

                    if (scope.viewContext === 'dashboard') {
                        axisAttrsSelectorHolder = $(elem)[0].querySelector('.axisAttrSelectorBtnsHolder');
                    }

                };

                var getCellWidth = function (columnsCount) {
                    var elemWidth = $(elem).width();
                    var cellWidth = 0;
                    var minWidth = 120;
                    var result = {cellWidth: 0, nameColWidth: 0};

                    var calcCellWidth = function (availableSpace) {
                        if (availableSpace < columnsCount * minWidth) {
                            availableSpace = availableSpace - SCROLL_WIDTH;
                        }

                        // Dynamically calculate cell width to fill available space
                        cellWidth = Math.floor(availableSpace / columnsCount);

                        cellWidth = Math.max(cellWidth, minWidth);
                    };

                    calcCellWidth(elemWidth);
                    result.nameColWidth = cellWidth;
                    result.cellWidth = cellWidth;
                    return result;
                };

                // Constants
                const MIN_CELL_HEIGHT = 30;
                const MAX_CELL_HEIGHT = 60;
                const SCROLL_WIDTH = 17;
                const SCROLL_HEIGHT = 14;
                const FONT_SIZE = 16;

                function adjustCellHeight(elemHeight, rowsCount) {

                    var resultElemHeight = elemHeight

                    // TODO consider refactor, maybe logic is not correct
                    if (elemHeight < rowsCount * MAX_CELL_HEIGHT) {
                        resultElemHeight = elemHeight - SCROLL_HEIGHT;
                    }

                    resultElemHeight = resultElemHeight - 3 // WTf if 3?

                    let cellHeight = Math.floor(resultElemHeight / rowsCount);


                    return Math.max(Math.min(cellHeight, MAX_CELL_HEIGHT), MIN_CELL_HEIGHT);
                }

                function adjustMatrixHeight(matrixProbableHeight, matrixWrapHeight) {
                    return matrixProbableHeight < matrixWrapHeight ? matrixProbableHeight : matrixWrapHeight;
                }

                function setStyle(element, styles) {
                    for (let property in styles) {
                        if (styles.hasOwnProperty(property)) {
                            element.style[property] = styles[property];
                        }
                    }
                }

                function adjustItemStyles(items, cellHeight, cellWidth, nameColWidth) {
                    for (let item of items) {
                        let width = item.classList.contains('firstColumnCell') ? nameColWidth : cellWidth;
                        let paddingTop = Math.abs((cellHeight / 2 - FONT_SIZE / 2)) + 'px';
                        setStyle(item, {
                            width: width + 'px',
                            height: cellHeight + 'px',
                            paddingTop: paddingTop
                        });
                    }
                }

                // Main function
                function adjustLayout(scope, elem) {
                    const rowsCount = scope.rows.length + 2;
                    const columnsCount = scope.columns.length + 2;
                    const elemHeight = $(elem).height()

                    const {cellWidth, nameColWidth} = getCellWidth(columnsCount);
                    // let cellHeight = MAX_CELL_HEIGHT;

                    let cellHeight = adjustCellHeight(elemHeight, rowsCount);

                    let matrixMaxWidth = columnsCount * cellWidth;

                    if (scope.matrixView === 'fixed-totals') {
                        setStyle(rvmBottomRowScrollableElem, {
                            left: nameColWidth + 'px',
                            width: matrixMaxWidth + 'px'
                        });
                        setStyle(rvMatrixRightCol, {width: cellWidth + 'px'});
                        setStyle(rvMatrixFixedBottomRow, {height: cellHeight + 'px'});
                    }

                    rvMatrixLeftCol.style.width = nameColWidth + 'px';
                    const matrixWrapHeight = matrixWrap.clientHeight;


                    // if (scope.matrixSettings.calculate_name_column_width) {
                    //     matrixMaxWidth = (columnsCount - 1) * cellWidth + nameColWidth;
                    // }

                    const matrixMaxHeight = rowsCount * cellHeight;
                    let matrixVCContainerWidth = matrixMaxWidth - nameColWidth;
                    const matrixVCContainerHeight = matrixMaxHeight - cellHeight;
                    let matrixProbableHeight = rowsCount * cellHeight;

                    if (elemHeight < matrixProbableHeight) {
                        matrixProbableHeight = matrixProbableHeight + SCROLL_HEIGHT
                    }
                    matrixProbableHeight = matrixProbableHeight + 3 // wtf 3? probably flex issue


                    matrixHolder.style.height = adjustMatrixHeight(matrixProbableHeight, matrixWrapHeight) + 'px';

                    setStyle(rvMatrixValueRowsHolder, {
                        width: matrixVCContainerWidth + 'px',
                        height: matrixVCContainerHeight + 'px'
                    });

                    for (let elem of bodyScrollableElem) {
                        $(elem)[0].style.height = matrixVCContainerHeight + 'px';
                    }

                    rvmHeaderScrollableRow.style.width = matrixMaxWidth + 'px';

                    if (scope.viewContext === 'dashboard') {
                        setStyle(axisAttrsSelectorHolder, {
                            width: nameColWidth + 'px',
                            height: cellHeight + 'px'
                        });
                    }

                    const items = $(elem)[0].querySelectorAll('.rvMatrixCell');
                    adjustItemStyles(items, cellHeight, cellWidth, nameColWidth);
                }

                scope.alignGrid = function () {

                    adjustLayout(scope, elem);

                }

                // Probably deprecated
                scope.alignGridOld = function () {

                    /*var elemWidth = $(elem).width();
                    var elemHeight = $(elem).height();*/

                    var rowsCount = scope.rows.length + 2; // add header and footer rows
                    var columnsCount = scope.columns.length + 2; // add left and right fixed columns

                    // var minHeight = 20;

                    // var matrixHolderMinHeight = elem[0].querySelector('.report-viewer-matrix').clientHeight;

                    // cellWidth = Math.floor(elemWidth / columnsCount);
                    var cwResult = getCellWidth(columnsCount);
                    var cellWidth = cwResult.cellWidth;
                    nameColWidth = cwResult.nameColWidth;

                    var cellHeight = 60;

                    // var minWidth = 100;
                    // var maxWidth = 300;
                    // var matrixHolderMinHeight = cellHeight * 3; // equal to 3 rows

                    /* if (scope.matrixSettings.auto_scaling) {

                        minWidth = 46;

                        var elemHeight = $(elem).height();
                        var cellHeight = Math.floor(elemHeight / rowsCount);

                        cellHeight = Math.max(cellHeight, 14);
                        cellHeight = Math.min(cellHeight, 48);

                    } */
                    if (scope.matrixSettings.auto_scaling) {

                        var elemHeight = $(elem).height();
                        var cellHeight = Math.floor(elemHeight / rowsCount);

                        cellHeight = Math.max(cellHeight, 30);
                        cellHeight = Math.min(cellHeight, 60);

                    }

                    var fontSize = 16;

                    // cellWidth = Math.max(cellWidth, minWidth);
                    // cellWidth = Math.min(cellWidth, maxWidth);
                    /* if (cellWidth < minWidth) {
                        cellWidth = minWidth;
                    } */

                    if (scope.matrixView === 'fixed-totals') {

                        rvmBottomRowScrollableElem.style.left = nameColWidth + 'px';
                        rvMatrixRightCol.style.width = cellWidth + 'px';
                        rvMatrixFixedBottomRow.style.height = cellHeight + 'px';

                    }

                    // because of children with absolute positioning, elem below requires manual width setting
                    rvMatrixLeftCol.style.width = nameColWidth + 'px';

                    var matrixWrapHeight = matrixWrap.clientHeight;
                    var matrixMaxWidth = columnsCount * cellWidth;

                    if (scope.matrixSettings.calculate_name_column_width) {
                        matrixMaxWidth = (columnsCount - 1) * cellWidth + nameColWidth;
                    }

                    var matrixMaxHeight = rowsCount * cellHeight;

                    if (scope.matrixView === 'fixed-totals') {
                        rvmBottomRowScrollableElem.style.width = matrixMaxWidth + 'px';
                    }

                    // size of .rv-matrix-value-cells-container element
                    var matrixVCContainerWidth = matrixMaxWidth - nameColWidth; // subtract width of column with names
                    var matrixVCContainerHeight = matrixMaxHeight - cellHeight; // subtract height of matrix header

                    var matrixProbableHeight = rowsCount * cellHeight;

                    var matrixVCAvailableWidth = matrixWrap.clientWidth - nameColWidth;
                    var matrixVCAvailableHeight = matrixWrapHeight - cellHeight;

                    // whether matrix has scrolls
                    if (matrixVCAvailableWidth < matrixVCContainerWidth) {

                        matrixHolder.classList.add('has-x-scroll');
                        matrixProbableHeight = matrixProbableHeight + 14; // add space for scroll
                        matrixVCAvailableHeight = matrixVCAvailableHeight - 30;

                    } else {
                        matrixHolder.classList.remove('has-x-scroll');
                    }

                    if (matrixVCAvailableHeight < matrixVCContainerHeight) {
                        matrixHolder.classList.add('has-y-scroll');
                    } else {
                        matrixHolder.classList.remove('has-y-scroll');
                    }

                    if (matrixProbableHeight < matrixWrapHeight) {
                        matrixHolder.style.height = matrixProbableHeight + 'px';
                    } else {

                        /*var canFitRowsNumber = matrixWrapHeight / cellHeight;
                        var matrixHolderHeight = canFitRowsNumber * cellHeight;*/

                        matrixHolder.style.height = matrixWrapHeight + 'px';

                    }

                    rvMatrixValueRowsHolder.style.width = matrixVCContainerWidth + 'px';
                    rvMatrixValueRowsHolder.style.height = matrixVCContainerHeight + 'px';

                    for (var i = 0; i < bodyScrollableElem.length; i++) {
                        bodyScrollableElem[i].style.height = matrixVCContainerHeight + 'px';
                    }

                    rvmHeaderScrollableRow.style.width = matrixMaxWidth + 'px';

                    if (scope.viewContext === 'dashboard') {
                        axisAttrsSelectorHolder.style.width = nameColWidth + 'px';
                        axisAttrsSelectorHolder.style.height = cellHeight + 'px';
                    }

                    var items = elem[0].querySelectorAll('.rvMatrixCell');

                    for (var i = 0; i < items.length; i = i + 1) {

                        var width = items[i].classList.contains('firstColumnCell') ? nameColWidth : cellWidth;

                        items[i].style.width = width + 'px';
                        items[i].style.height = cellHeight + 'px';
                        items[i].style.paddingTop = Math.abs((cellHeight / 2 - fontSize / 2)) + 'px';

                    }

                };

                var scrollHeaderAndColumn = function () {
                    rvmHeaderScrollableRow.style.left = -bodyScrollElem.scrollLeft + 'px';
                    const columnsCount = scope.columns.length + 2;

                    const {cellWidth, nameColWidth} = getCellWidth(columnsCount);


                    if (rvmBottomRowScrollableElem) {

                        rvmBottomRowScrollableElem.style.left = (nameColWidth - bodyScrollElem.scrollLeft) + 'px';
                    }

                    for (var c = 0; c < bodyScrollableElem.length; c++) {
                        bodyScrollableElem[c].style.top = -bodyScrollElem.scrollTop + 'px';
                    }
                };

                var initMatrixMethods = function () {

                    getElemsForScripts();
                    scope.alignGrid();

                    bodyScrollElem.addEventListener('scroll', scrollHeaderAndColumn);

                    // Add event listener for mouseover
                    bodyScrollElem.addEventListener('mouseover', function() {
                        rvMatrixFixedBottomRow.style.opacity = '0.3';
                        rvMatrixRightCol.style.opacity = '0.3';
                        rvMatrixFixedBottomRow.style.pointerEvents = 'none';
                        rvMatrixRightCol.style.pointerEvents = 'none';
                    });

                    bodyScrollElem.addEventListener('mouseout', function() {
                        rvMatrixFixedBottomRow.style.opacity = '1';
                        rvMatrixRightCol.style.opacity = '1';
                        rvMatrixFixedBottomRow.style.pointerEvents = 'auto';
                        rvMatrixRightCol.style.pointerEvents = 'auto';
                    });

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

                    var result = val;

                    if (scope.matrixSettings.number_format && (val || val === 0)) {

                        result = renderHelper.formatValue(
                            {
                                value: val
                            },
                            {
                                key: 'value',
                                report_settings: scope.matrixSettings.number_format
                            }
                        );

                    }

                    if (!result && result !== 0) {
                        return '';
                    }

                    return result;

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

                    activeObject[scope.matrixSettings.abscissa] = scope.columns[index].key;

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.singleRowTotalClick = function ($event, index) {

                    console.log('singleRowTotalClick, index', index);

                    scope.activeItem = 'row_total:' + index;

                    var activeObject = {};

                    activeObject[scope.matrixSettings.ordinate] = scope.rows[index].key;

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                scope.cellClick = function ($event, rowIndex, columnIndex) {

                    console.log('singleRowTotalClick rowIndex, columnIndex', rowIndex, columnIndex);

                    scope.activeItem = 'cell:' + rowIndex + ':' + columnIndex;

                    var activeObject = {};

                    activeObject[scope.matrixSettings.ordinate] = scope.rows[rowIndex].key;
                    activeObject[scope.matrixSettings.abscissa] = scope.columns[columnIndex].key;

                    console.log('activeObject', activeObject);

                    scope.evDataService.setActiveObject(activeObject);
                    scope.evEventService.dispatchEvent(evEvents.ACTIVE_OBJECT_CHANGE);

                };

                var getValuesForMatrix = function () {

                    return new Promise(function (resolve, reject) {

                        var abscissaAttrMockup = {
                            "key": scope.matrixSettings.abscissa, // columns
                            "name": scope.matrixSettings.abscissa,
                            "value_type": 10
                        };

                        var abscissaGroupType = evHelperService.getTableAttrInFormOf("group", abscissaAttrMockup);

                        var ordinateAttrMockup = {
                            "key": scope.matrixSettings.ordinate,
                            "name": scope.matrixSettings.ordinate,
                            "value_type": 10
                        };

                        var ordinateGroupType = evHelperService.getTableAttrInFormOf("group", ordinateAttrMockup);


                        var options = {
                            page: 1,
                            page_size: 1000,
                            frontend_request_options: {
                                groups_types: [{...abscissaGroupType}]
                            }
                        }

                        groupsService.getList(options, scope.evDataService).then(function (data) {

                            console.log("getValuesForMatrix.data", data);

                            var firstLevelGroups = data.results;


                            scope.columns = firstLevelGroups.map(function (item, index) {
                                return {
                                    index: index,
                                    key: item.___group_identifier,
                                    name: item.___group_name,
                                    total: item.subtotal[scope.matrixSettings.value_key]
                                }
                            })

                            console.log('getValuesForMatrix.columns', scope.columns);
                            console.log('getValuesForMatrix.firstLevelGroups', firstLevelGroups);
                            console.log('scope.matrixSettings', scope.matrixSettings);

                            var promises = []

                            scope.grandtotal = 0

                            firstLevelGroups.forEach(function (group) {

                                options = {
                                    page: 1,
                                    page_size: 1000,
                                    frontend_request_options: {
                                        groups_types: [
                                            {...abscissaGroupType},
                                            {...ordinateGroupType},
                                        ],
                                        groups_values: [group.___group_identifier]
                                    }
                                }

                                promises.push(groupsService.getList(options, scope.evDataService))


                                scope.grandtotal = scope.grandtotal + group.subtotal[scope.matrixSettings.value_key]

                            })


                            scope.rows = []

                            var secondLevelGroups = []

                            Promise.all(promises).then(function (data) {

                                console.log('getValuesForMatrix.promises.data', data);

                                // Generate one list of all secondLevelGroups
                                firstLevelGroups.forEach(function (group, rowIndex) {

                                    data[rowIndex].results.forEach(function (secondGroup) {

                                        var item = Object.assign({}, secondGroup)

                                        item.column = group.___group_identifier

                                        secondLevelGroups.push(item)

                                    })

                                })

                                console.log('getValuesForMatrix.firstLevelGroups', firstLevelGroups);
                                console.log('getValuesForMatrix.secondLevelGroups', secondLevelGroups);

                                // Creating structure to fill scope.rows
                                var rowsObject = {}

                                secondLevelGroups.forEach(function (group) {

                                    if (!rowsObject.hasOwnProperty(group.___group_identifier)) {
                                        rowsObject[group.___group_identifier] = {
                                            key: group.___group_identifier,
                                            total: 0
                                        }
                                    }

                                    rowsObject[group.___group_identifier].total = rowsObject[group.___group_identifier].total + group.subtotal[scope.matrixSettings.value_key]

                                })

                                Object.keys(rowsObject).forEach(function (key, index) {

                                    var item = rowsObject[key]
                                    item.index = index;

                                    scope.rows.push(item)

                                })

                                // creating matrix, when we have scope.columns and scope.rows
                                scope.matrix = []

                                scope.rows.forEach(function (row, rowIndex) {

                                    var resultItem = {
                                        row_name: row.key,
                                        index: rowIndex,
                                        items: []
                                    }

                                    scope.columns.forEach(function (column, columnIndex) {

                                        var columnItem = {
                                            index: columnIndex,
                                            data: {
                                                value: 0
                                            }
                                        }

                                        secondLevelGroups.forEach(function (secondLevelGroup) {

                                            if (secondLevelGroup.column === column.key) {

                                                if (secondLevelGroup.___group_identifier === row.key) {

                                                    columnItem.data.value = secondLevelGroup.subtotal[scope.matrixSettings.value_key];

                                                }


                                            }

                                        })

                                        resultItem.items.push(columnItem)

                                    })

                                    scope.matrix.push(resultItem)

                                })

                                console.log('getValuesForMatrix.rows', scope.columns);
                                console.log('getValuesForMatrix.rows', scope.rows);

                                console.log('getValuesForMatrix.matrix', scope.matrix);

                                // itemList = scope.evDataService.getUnfilteredFlatList();
                                //
                                // scope.columns = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.abscissa, scope.matrixSettings.value_key);
                                // scope.rows = reportViewerMatrixHelper.getMatrixUniqueValues(itemList, scope.matrixSettings.ordinate, scope.matrixSettings.value_key);


                                scope.evEventService.dispatchEvent(evEvents.DATA_LOAD_END);
                                resolve()

                            })


                        })


                    })

                };

                scope.createMatrix = function () {

                    scope.processing = true;

                    scope.matrixCreationInProgress = true;
                    window.removeEventListener('resize', scope.alignGrid);

                    getValuesForMatrix().then(function () {

                        scope.processing = false;

                        scope.$apply();

                        setTimeout(function () {

                            initMatrixMethods();

                            scope.matrixCreationInProgress = false;
                            window.addEventListener('resize', scope.alignGrid);

                        }, 200)

                    })

                };

                scope.setNumberFormatPreset = function (preset) {

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

                scope.openNumberFormatSettings = function ($event) {

                    $mdDialog.show({
                        controller: 'NumberFormatSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/number-format-settings-dialog-view.html',
                        parent: document.querySelector('.dialog-containers-wrap'),
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                settings: scope.matrixSettings.number_format
                            }
                        }

                    }).then(function (res) {

                        if (res.status === 'agree') {

                            scope.matrixSettings.number_format = res.data;

                        }

                    });

                };

                scope.setSubtotalType = function (subtotal_formula_id) {

                    scope.matrixSettings.subtotal_formula_id = subtotal_formula_id;

                    scope.createMatrix();

                    /*setTimeout(function () {

                        scope.$apply();

                        initMatrixMethods();
                    }, 0)*/

                };

                scope.getTopLeftTitle = function () {
                    return scope.top_left_title || '-';
                };

                scope.hideEmptyLines = function (hideType) {

                    if (scope.emptyLinesHidingType === hideType) {
                        scope.emptyLinesHidingType = '';

                    } else {
                        scope.emptyLinesHidingType = hideType;
                    }

                    scope.processing = false;

                    scope.createMatrix();

                };

                //<editor-fold desc="Popup-selector of attributes for axises">
                /**
                 *
                 * @param option {{id: string, name: string, isActive: boolean}}
                 * @param optionsList {Array.<Object>}
                 * @param axisProp {String} - can be 'abscissa' or 'ordinate'
                 * @param _$popup {Object} - data from popup
                 */
                var onAxisAttrsOptionSelect = function (option, optionsList, axisProp, _$popup) {

                    _$popup.cancel();

                    if (option.id !== scope.matrixSettings[axisProp]) {

                        scope.matrixSettings[axisProp] = option.id;
                        if (axisProp === 'value_key') scope.matrixValueAttrName = option.name;

                        scope.createMatrix();

                        var activeOption = optionsList.find(sOption => sOption.isActive);
                        if (activeOption) activeOption.isActive = false;

                        option.isActive = true;

                        scope.evEventService.dispatchEvent(evEvents.DASHBOARD_COMPONENT_DATA_CHANGED);

                    }

                };

                var formatAttrsForSelector = function (attrsList, selectedAttrKey) {

                    return attrsList.map(attr => {

                        return {
                            name: attr.layout_name || attr.attribute_data.name,
                            id: attr.attribute_data.key,
                            isActive: attr.attribute_data.key === selectedAttrKey
                        };

                    });

                };

                var canChangeAxisAttr = function (availableAttrsList, axisAttrKey) {

                    if (availableAttrsList.length) {

                        if (availableAttrsList.length === 1) {

                            // One different attribute is available for axis
                            return availableAttrsList[0].attribute_data.key !== axisAttrKey;

                        } else {
                            return true;
                        }

                    }

                    return false;

                };

                var initAxisAttrsSelectors = function () {

                    scope.abscissaSelectorData = {
                        options: formatAttrsForSelector(scope.availableAbscissaAttrs, scope.matrixSettings.abscissa),
                        selectOption: function (option, _$popup) {
                            onAxisAttrsOptionSelect(option, scope.abscissaSelectorData.options, 'abscissa', _$popup);
                        }
                    };

                    scope.ordinateSelectorData = {
                        options: formatAttrsForSelector(scope.availableOrdinateAttrs, scope.matrixSettings.ordinate),
                        selectOption: function (option, _$popup) {
                            onAxisAttrsOptionSelect(option, scope.ordinateSelectorData.options, 'ordinate', _$popup);
                        }
                    };

                    scope.valueSelectorData = {
                        options: formatAttrsForSelector(scope.availableValueAttrs, scope.matrixSettings.value_key),
                        selectOption: function (option, _$popup) {
                            onAxisAttrsOptionSelect(option, scope.valueSelectorData.options, 'value_key', _$popup);
                        }
                    };

                    var activeValueAttr = scope.availableValueAttrs.find(attr => {
                        return attr.attribute_data.key === scope.matrixSettings.value_key;
                    });

                    if (activeValueAttr) {
                        scope.matrixValueAttrName = activeValueAttr.layout_name || activeValueAttr.attribute_data.name;
                    }

                };
                //</editor-fold desc="Popup-selector of attributes for axises">

                scope.init = function () {

                    scope.evDataService.setActiveObject({});

                    // scope.top_left_title = scope.matrixSettings.top_left_title;
                    scope.styles = scope.matrixSettings.styles;

                    initAxisAttrsSelectors();

                    scope.createMatrix();

                    clearUseFromAboveFilterId = scope.evEventService.addEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, function () {
                        scope.alignGrid();
                    });

                    scope.canChangeAbscissaAttr = canChangeAxisAttr(scope.availableAbscissaAttrs, scope.matrixSettings.abscissa);
                    scope.canChangeOrdinateAttr = canChangeAxisAttr(scope.availableOrdinateAttrs, scope.matrixSettings.ordinate);
                    scope.canChangeValueAttr = canChangeAxisAttr(scope.availableValueAttrs, scope.matrixSettings.value_key);

                };

                scope.init();

                scope.$on('$destroy', function () {

                    window.removeEventListener('resize', scope.alignGrid);

                    scope.evEventService.removeEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, clearUseFromAboveFilterId);

                });

            }
        }
    }

}());