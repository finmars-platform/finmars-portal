/**
 * Created by szhitenev on 30.05.2016.
 */
(function () {

    'use strict';

    var dashboardConstructorEvents = require('../services/dashboard-constructor/dashboardConstructorEvents')

    module.exports = function () {
        return {
            restrict: 'AE',
            scope: {
                dashboardConstructorDataService: '=',
                dashboardConstructorEventService: '=',
                tabNumber: '='
            },
            link: function (scope, elem, attr) {

                console.log('Dashboard Constructor Grid Aligner');

                scope.columnsTotal = 1;
                scope.rowsTotal = 1;


                scope.cellWidth = 0;
                scope.cellHeight = 0;

                scope.calculateSingleCellWidth = function () {

                    var tabWidth = elem.width();

                    console.log('tabWidth ', tabWidth);

                    scope.cellWidth = Math.floor(tabWidth / scope.rowsTotal)


                };

                scope.calculateSingleCellHeight = function () {

                    var tabHeight = elem.height();

                    console.log('tabHeight ', tabHeight);

                    scope.cellHeight = Math.floor(tabHeight / scope.columnsTotal)

                };

                scope.resizeGridCells = function () {

                    var layout = scope.dashboardConstructorDataService.getData();

                    var tab = layout.data.tabs[scope.tabNumber];

                    var elements = elem.find('.dashboard-constructor-cell');
                    var domElem;
                    var layoutElem;

                    var rowNumber;
                    var columnNumber;

                    for (var i = 0; i < elements.length; i = i + 1) {

                        domElem = elements[i];

                        rowNumber  = parseInt(domElem.dataset.row, 10)
                        columnNumber  = parseInt(domElem.dataset.column, 10);

                        console.log('tab.layout.rows', tab.layout.rows);
                        console.log('tab.layout.rows[rowNumber]', tab.layout.rows[rowNumber]);

                        layoutElem = tab.layout.rows[rowNumber].columns[columnNumber];

                        if (layoutElem.cell_type === 'empty') {
                            if (layoutElem.is_hidden) {
                                domElem.style.dispaly = 'none';
                            } else {
                                domElem.style.width = (layoutElem.colspan * scope.cellWidth) + 'px';
                                domElem.style.height = (layoutElem.rowspan * scope.cellHeight) + 'px';
                            }
                        }

                        if (layoutElem.cell_type === 'component') {

                            domElem.style.width = (layoutElem.colspan * scope.cellWidth) + 'px';
                            domElem.style.height = (layoutElem.rowspan * scope.cellHeight) + 'px';

                        }

                    }


                };

                scope.init = function () {

                    scope.dashboardConstructorEventService.addEventListener(dashboardConstructorEvents.GRID_RENDERED, function () {

                        var layout = scope.dashboardConstructorDataService.getData();

                        var tab = layout.data.tabs[scope.tabNumber];

                        console.log('tab', tab);

                        scope.rowsTotal = tab.layout.rows_count;
                        scope.columnsTotal = tab.layout.columns_count;

                        console.log('scope.rowsTotal', scope.rowsTotal);
                        console.log('scope.columnsTotal', scope.columnsTotal);

                        scope.calculateSingleCellHeight();
                        scope.calculateSingleCellWidth();

                        scope.resizeGridCells();

                        console.log('scope.cellHeight', scope.cellHeight);
                        console.log('scope.cellWidth', scope.cellWidth);

                    });


                };

                scope.init();


            }
        }
    }

}());