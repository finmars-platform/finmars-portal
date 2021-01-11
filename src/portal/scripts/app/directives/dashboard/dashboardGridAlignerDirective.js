/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardEvents = require('../../services/dashboard/dashboardEvents')

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                dashboardDataService: '=',
                dashboardEventService: '=',
                tabNumber: '='
            },
            link: function (scope, elem, attr) {

                scope.columnsTotal = 1;
                scope.rowsTotal = 1;


                scope.cellWidth = 0;
                scope.cellHeight = 0;

                scope.tabPaddingLeft = 8;
                scope.tabPaddingTop = 8;

                scope.calculateSingleCellWidth = function () {

                    var tabWidth = elem.width();

                    scope.cellWidth = Math.floor(tabWidth / scope.columnsTotal)

                };

                scope.calculateSingleCellHeight = function () {

                    var tabHeight = elem.height();

                    // scope.cellHeight = Math.floor(tabHeight / scope.columnsTotal)

                    scope.cellHeight = 64; // var it be fixed value
                };

                scope.resizeGridCells = function () {

                    var layout = scope.dashboardDataService.getData();
                    var projection = scope.dashboardDataService.getProjection();

                    console.log('resizeGridCells.projection', projection);

                    var tab;
                    var projectionTab

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                        projectionTab = projection[scope.tabNumber]
                    }

                    var elements = elem.find('.dashboard-cell');
                    var emptySpace = elem.find('.dashboard-empty-space')[0];
                    var domElem;
                    var layoutElem;

                    var rowNumber;
                    var columnNumber;


                    var accordionRowsIndexes = []

                    console.log('resizeGridCells.tab', tab);

                    if (tab.accordions) {
                        tab.accordions.forEach(function (item) {
                            accordionRowsIndexes.push(item.from)
                        })
                    }

                    var hiddenRowsIndexes = []

                    if (projectionTab) {

                        projectionTab.accordion_layout.forEach(function (accordion){

                            if (accordion.folded) {

                                accordion.items.forEach(function (item){

                                    hiddenRowsIndexes.push(parseInt(item.row_number, 10))

                                })

                            }


                        })

                    }

                    console.log('resizeGridCells.hiddenRowsIndexes', hiddenRowsIndexes);

                    var heightOffset;
                    var accordionsBefore = 0;
                    var hiddenRowsBefore = 0;
                    var domElemOffsetTop;
                    var domElemOffsetLeft;

                    for (var i = 0; i < elements.length; i = i + 1) {

                        accordionsBefore = 0;
                        hiddenRowsBefore = 0;

                        domElem = elements[i];

                        rowNumber = parseInt(domElem.dataset.row, 10);
                        columnNumber = parseInt(domElem.dataset.column, 10);

                        layoutElem = tab.layout.rows[rowNumber].columns[columnNumber];


                        if (layoutElem.cell_type === 'empty') {

                            if (layoutElem.is_hidden) {
                                domElem.style.display = 'none';
                            } else {
                                domElem.style.display = 'block';
                            }

                        }

                        if (layoutElem.cell_type === 'component') {

                            // nothing here yet

                        }

                        accordionRowsIndexes.forEach(function (indx) {
                            if (indx <= rowNumber) {
                                accordionsBefore = accordionsBefore + 1;
                            }
                        })

                        hiddenRowsIndexes.forEach(function (indx) {
                            if (indx < rowNumber) {
                                hiddenRowsBefore = hiddenRowsBefore + 1;
                            }
                        })

                        heightOffset = (accordionsBefore - hiddenRowsBefore) * scope.cellHeight;

                        domElem.style.width = (layoutElem.colspan * scope.cellWidth) + 'px';
                        domElem.style.height = (layoutElem.rowspan * scope.cellHeight) + 'px';

                        domElem.style.position = 'absolute';

                        domElemOffsetTop =  (rowNumber * scope.cellHeight + heightOffset + scope.tabPaddingTop)
                        domElemOffsetLeft =  (columnNumber * scope.cellWidth + scope.tabPaddingLeft)

                        domElem.style.top = domElemOffsetTop + 'px';
                        domElem.style.left = domElemOffsetLeft + 'px';

                    }

                    if (emptySpace) {
                        emptySpace.style.position = 'absolute';
                        emptySpace.style.top = scope.rowsTotal * (scope.cellHeight + scope.tabPaddingTop) + 'px';
                        emptySpace.style.left = 0;
                        emptySpace.style.height = '200px';
                        emptySpace.style.width = '100%';
                    }


                };

                scope.resize = function () {

                    var layout = scope.dashboardDataService.getData();
                    var tab;

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

                    scope.rowsTotal = tab.layout.rows_count;
                    scope.columnsTotal = tab.layout.columns_count;

                    scope.calculateSingleCellHeight();
                    scope.calculateSingleCellWidth();

                    scope.resizeGridCells();

                };

                scope.init = function () {

                    setTimeout(function () {

                        scope.resize()

                    }, 0);

                    scope.dashboardEventService.addEventListener(dashboardEvents.RESIZE, function () {
                        scope.resize();
                    })

                    window.addEventListener('resize', function () {
                        scope.resize();
                    })

                };

                scope.init();


            }
        }
    }

}());