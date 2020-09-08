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
                var bodyElem = document.querySelector("body");

                var popupBackdropElem = document.createElement("div");
                popupBackdropElem.classList.add("popup-area-backdrop");

                var popUpElem;

                // Popup methods
                var popupFooter = "<div class='popup-area-footer'>" +
                        "<md-button class='m-l-0' data-ng-click='closePopupArea()'>Cancel</md-button>" +
                        "<md-button class='m-r-0' data-ng-click='acceptPopupChanges()'>Agree</md-button>" +
                    "</div>"

                scope.acceptPopupChanges = function () {

                    var popupValue = null;

                    if (scope.popupValue) {
                        popupValue = scope.popupValue;
                    }

                    scope.cellValue = popupValue;
                    scope.column.settings.value = popupValue;
                    // gridTableData.body[scope.row.order].columns[scope.column.order].settings.value = popupValue;

                    scope.onCellValueChange();

                    closePopupArea();

                };

                function closePopupArea () {
                    bodyElem.removeChild(popupBackdropElem);
                    bodyElem.removeChild(popUpElem);
                }

                scope.closePopupArea = function () {
                    closePopupArea();
                };

                var setPopupPosition = function (posX, posY) {

                    // subtracting 50 to add space for mouse inside popup when it appears
                    var positionX = posX - 50;
                    var positionY = posY - 50;

                    var popupHeight = popUpElem.clientHeight;
                    var popupWidth = popUpElem.clientWidth;

                    var windowHeight = document.body.clientHeight;
                    var windowWidth = document.body.clientWidth;

                    if (positionX + popupWidth > windowWidth) {
                        popUpElem.style.right = '0';

                    } else if (positionX < 20) {
                        popUpElem.style.left = '0';

                    } else {
                        popUpElem.style.left = positionX + 'px';
                    }

                    if (positionY + popupHeight > windowHeight) {
                        popUpElem.style.bottom = '0';

                    } else if (positionY < 20) {
                        popUpElem.style.top = '0';

                    } else {
                        popUpElem.style.top = positionY + 'px';
                    }

                }

                var createPopup = function (posX, posY) {

                    popUpElem = document.createElement("div");
                    popUpElem.classList.add("popup-area");

                    popUpElem.innerHTML = "<div class='popup-area-container'>" +
                            "<div calss='popup-area-main'>" +
                                "<text-input label='{{cell.columnName}}' " +
                                            "placeholder-text='{{cell.columnName}}' " +
                                            "model='popupValue'></text-input>" +
                            "</div>" +
                            popupFooter +
                        "</div>"


                    $compile($(popUpElem))(scope);
                    console.log("grid table popUpElem", popUpElem);

                    bodyElem.appendChild(popupBackdropElem);
                    $(bodyElem).append($(popUpElem));

                    popUpElem.addEventListener('mouseenter', function (e) {
                        e.stopPropagation();
                    });

                    setPopupPosition(posX, posY);

                    popupBackdropElem.addEventListener('mouseenter', closePopupArea, {once: true});

                }
                // < Popup methods >

                scope.editCell = function ($event) {

                    var posX = $event.pageX;
                    var posY = $event.pageY;

                    if (scope.column.settings.value) {
                        scope.popupValue = JSON.parse(JSON.stringify(scope.column.settings.value));
                    }

                    createPopup(posX, posY);

                };

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
                    return scope.column.cellType !== 'multiselector' &&
                           scope.column.cellType !== 'selector' &&
                           scope.column.cellType !== 'checkbox' &&
                           scope.row.order !== 'header';
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

                }

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