(function () {

    var gtEvents = require('../../services/gridTableEvents');

    'use strict';

    module.exports = function ($compile) {
        return {
            restrict: 'E',
            scope: {
                row: '=',
                column: '=',
                gtDataService: '=',
                gtEventService: '='
            },
            templateUrl: 'views/directives/gridTable/grid-table-cell-view.html',
            link: function (scope, elem, attrs) {

                scope.cellValue = '';

                var cellMethods = scope.column.methods;
                var cellsWithPopup = ['text', 'number', 'date', 'expression', 'custom_popup'];

                scope.onCellValueChange = function () {

                    if (cellMethods && cellMethods.onChange) {
                        cellMethods.onChange(scope.row.order, scope.column.order, scope.gtDataService, scope.gtEventService);
                    }

                    scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED);
                };

                scope.onSelOpen = function () {
                    if (cellMethods && cellMethods.onOpen) {
                        cellMethods.onOpen(scope.row.order, scope.column.order, scope.gtDataService, scope.gtEventService);
                    }
                }

                scope.cellWithPopup = function () {
                    return cellsWithPopup.indexOf(scope.column.cellType) > -1;
                };

                var setCellCustomStyles = function () {

                    var classNames = Object.keys(scope.column.styles);

                    classNames.forEach(function (cName) {

                        var customStyles = scope.column.styles[cName];
                        var elemWithStyles = elem[0].querySelector('.' + cName);

                        if (elemWithStyles) {

                            var styleNames = Object.keys(customStyles);

                            styleNames.forEach(function (styleName) {
                                var styleVal = customStyles[styleName];
                                elemWithStyles.style[styleName] = styleVal;
                            });

                        }

                    });

                };

                scope.onChildrenLoadEnd = function () {

                    if (scope.column.styles) {
                        setCellCustomStyles();
                    }

                };

                var init = function () {

                    if (scope.row.order !== 'header' && scope.column.styles) {
                        setCellCustomStyles();
                    }

                    if (scope.column.settings && scope.column.settings.value) {
                        scope.cellValue = scope.column.settings.value;
                    }

                    scope.gtEventService.addEventListener(gtEvents.SORTING_SETTINGS_CHANGED, function () {

                        scope.sortingOn = false;

                        var sortSettings = scope.gtDataService.getSortingSettings();

                        if (sortSettings.column === scope.column.order) {
                            scope.sortingOn = true;
                        }

                    });

                };

                init();

            }
        }
    }
}());