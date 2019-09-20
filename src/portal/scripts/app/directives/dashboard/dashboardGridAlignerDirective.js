/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

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

                scope.calculateSingleCellWidth = function () {

                    var tabWidth = elem.width();

                    scope.cellWidth = Math.floor(tabWidth / scope.columnsTotal)

                };

                scope.calculateSingleCellHeight = function () {

                    var tabHeight = elem.height();

                    // scope.cellHeight = Math.floor(tabHeight / scope.columnsTotal)

                    scope.cellHeight = 50; // Let it be fixed value
                };

                scope.resizeGridCells = function () {

                    var layout = scope.dashboardDataService.getData();

                    var tab = layout.data.tabs[scope.tabNumber];

                    var elements = elem.find('.dashboard-cell');
                    var domElem;
                    var layoutElem;

                    var rowNumber;
                    var columnNumber;


                    for (var i = 0; i < elements.length; i = i + 1) {

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


                        domElem.style.width = (layoutElem.colspan * scope.cellWidth) + 'px';
                        domElem.style.height = (layoutElem.rowspan * scope.cellHeight) + 'px';

                        domElem.style.position = 'absolute';
                        domElem.style.top = (rowNumber * scope.cellHeight) + 'px';
                        domElem.style.left = (columnNumber * scope.cellWidth) + 'px';

                    }


                };

                scope.resize = function () {

                    var layout = scope.dashboardDataService.getData();

                    var tab = layout.data.tabs[scope.tabNumber];

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

                    $(window).on('resize', function () {
                        scope.resize();
                    })

                };

                scope.init();


            }
        }
    }

}());