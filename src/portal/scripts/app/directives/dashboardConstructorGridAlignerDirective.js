/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents');

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                dashboardConstructorDataService: '=',
                dashboardConstructorEventService: '=',
                tabNumber: '='
            },
            link: function (scope, elem, attr) {

                scope.columnsTotal = 1;
                scope.rowsTotal = 1;

                scope.cellWidth = 0;
                scope.cellHeight = 0;

                // scope.cellMinWidth = 100;
                scope.cellMinWidth = 75;

                scope.rowControlsHolderElem;
                scope.dashboardLayoutElem;


                scope.calculateSingleCellWidth = function () {

                    var rowControlsWidth = 110;

                    var tabWidth = $(elem).width() - rowControlsWidth;

                    scope.cellWidth = Math.floor(tabWidth / scope.columnsTotal);

                    if (scope.cellWidth < scope.cellMinWidth) {
                        scope.cellWidth = scope.cellMinWidth;
                    }

                };

                scope.calculateSingleCellHeight = function () {

                    // var tabHeight = $(elem).height();
                    //
                    // console.log('tabHeight', tabHeight);
                    //
                    // scope.cellHeight = Math.floor(tabHeight / scope.rowsTotal)

                    // scope.cellHeight = 50; // var it be fixed value
                    scope.cellHeight = 75; // var it be fixed value

                };

                scope.resizeLayoutWidth = function () {

                    var rowControlsWidth = 110;
                    var accordionGuideWidth = 110;

                    // scope.dashboardLayoutElem.style.width = (scope.columnsTotal * scope.cellWidth + rowControlsWidth - accordionGuideWidth) + 'px'
                    scope.dashboardLayoutElem.style.width = '100%';

                };

                scope.resizeGridCells = function () {

                    var layout = scope.dashboardConstructorDataService.getData();
                    var tab;

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

                    scope.rowsTotal = tab.layout.rows_count;
                    scope.columnsTotal = tab.layout.columns_count;

                    var elements = $(elem).find('.dashboard-constructor-cell');
                    var domElem;
                    var layoutElem;

                    var rowNumber;
                    var columnNumber;

                    console.log('elements', elements);


                    for (var i = 0; i < elements.length; i = i + 1) {

                        domElem = elements[i];

                        rowNumber = parseInt(domElem.dataset.row, 10);
                        columnNumber = parseInt(domElem.dataset.column, 10);
                        layoutElem = tab.layout.rows[rowNumber].columns[columnNumber];

                        if (layoutElem.cell_type === 'empty') {

                            if (layoutElem.is_hidden) {
                                domElem.style.display = 'none';
                            } else {
                                domElem.style.display = 'flex';
                            }

                        }

                        /*if (layoutElem.cell_type === 'component') {

                            // nothing here yet
                        }*/

                        domElem.style.width = (layoutElem.colspan * scope.cellWidth) + 'px';
                        domElem.style.height = (layoutElem.rowspan * scope.cellHeight) + 'px';

                        domElem.style.position = 'absolute';
                        domElem.style.top = (rowNumber * scope.cellHeight) + 'px';
                        domElem.style.left = (columnNumber * scope.cellWidth) + 'px';

                    }


                };

                scope.resizeRowControls = function () {

                    var elements = $(elem).find('.dashboard-constructor-row-controls');
                    var domElem;
                    var rowNumber;

                    for (var i = 0; i < elements.length; i = i + 1) {

                        domElem = elements[i];
                        rowNumber = parseInt(domElem.dataset.row, 10);

                        domElem.style.top = (rowNumber * scope.cellHeight) + 'px';

                    }


                };

                scope.updateRowControlsHolderPosition = function (event) {

                    var layout = scope.dashboardConstructorDataService.getData();

                    var rowControlsOffset = 100;

                    var tab;

                    if (scope.tabNumber === 'fixed_area') {
                        tab = layout.data.fixed_area;
                    } else {
                        tab = layout.data.tabs[scope.tabNumber];
                    }

                    scope.columnsTotal = tab.layout.columns_count;

                    var columnWidth = 121;

                    console.log('scope.cellWidth', scope.cellWidth);

                    scope.rowControlsHolderElem.style.left = (scope.columnsTotal * scope.cellWidth) + 'px'

                };

                scope.resize = function () {

                    var layout = scope.dashboardConstructorDataService.getData();

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

                    // console.log('cellHeight', scope.cellHeight);

                    scope.resizeLayoutWidth();
                    scope.resizeGridCells();
                    scope.resizeRowControls();
                    scope.updateRowControlsHolderPosition();

                };

                scope.init = function () {

                    setTimeout(function () {

                        scope.rowControlsHolderElem = $(elem).find('.row-controls-holder')[0];
                        scope.dashboardLayoutElem = $(elem).find('.dashboard-layout')[0];


                        scope.resize();

                        scope.dashboardConstructorEventService.addEventListener(dashboardConstructorEvents.UPDATE_GRID_CELLS_SIZE, function () {

                            setTimeout(function () {
                                scope.resize()
                            }, 0);

                        });

                        window.addEventListener('resize', function () {
                            scope.resize();
                        });

                        console.log('elem', elem);


                        elem[0].addEventListener("scroll", function (event) {
                            //console.log('here?', event);
                            scope.updateRowControlsHolderPosition(event)
                        });

                        elem[0].dispatchEvent(new Event('scroll'))

                        scope.$apply();

                    }, 0)

                };

                scope.init();


            }
        }
    }

}());