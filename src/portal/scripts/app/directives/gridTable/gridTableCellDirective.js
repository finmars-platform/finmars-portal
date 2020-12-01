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

                var cellMethods = scope.column.methods || {};
                var cellsWithPopup = ['text', 'number', 'date', 'expression', 'custom_popup'];

                scope.onCellValueChange = function () {

                    var rowData = {
                        key: scope.row.key,
                        order: scope.row.order
                    };

                    var colData = {
                        key: scope.column.key,
                        order: scope.column.order
                    };

                    if (cellMethods.onChange) {

                        cellMethods.onChange(rowData, colData, scope.gtDataService, scope.gtEventService);
                    }

                    /*var changedCellData = {
                        row: {
                            key: scope.row.key,
                            order: scope.row.order
                        },
                        column: {
                            key: scope.column.key,
                            order: scope.column.order
                        }
                    };*/

                    scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED, {row: rowData, column: colData});

                };

                scope.onSelOpen = function () {
                    if (cellMethods.onOpen) {
                        cellMethods.onOpen(scope.row.order, scope.column.order, scope.gtDataService, scope.gtEventService);
                    }
                }

                scope.unselectOptions = function () {
                    scope.column.settings.value = null
                    scope.onCellValueChange();
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

                    if (cellMethods.onInit) {

                        var rowData = {key: scope.row.key, order: scope.row.order};
                        var colData = {key: scope.column.key, order: scope.column.order};

                        cellMethods.onInit(rowData, colData, scope.gtDataService, scope.gtEventService);

                    }

                };

                scope.multiselectorEditClick = function () {
                    var multiselectorElem = elem[0].querySelector("two-fields-multiselect.grid-table-cell-multiselector");
                    multiselectorElem.click();
                };

                var init = function () {

                    if (scope.row.order !== 'header' && !scope.cellWithPopup()) { // if no child directive initialized
                        scope.onChildrenLoadEnd();
                    }

                    if (scope.column.settings && scope.column.settings.value) {
                        scope.cellValue = scope.column.settings.value;
                    }

                    scope.gtEventService.addEventListener(gtEvents.SORTING_SETTINGS_CHANGED, function () {

                        scope.sortingOn = false;
                        scope.sortRowsReverse = false;

                        var sortSettings = scope.gtDataService.getSortingSettings();

                        if (sortSettings.column === scope.column.order) {

                            scope.sortingOn = true
                            scope.sortRowsReverse = sortSettings.reverse

                        }

                    });

                };

                init();

            }
        }
    }
}());