(function () {

    var gtEvents = require('../../../services/gridTableEvents');

    'use strict';

    module.exports = function ($compile) {
        return {
            restrict: 'E',
            scope: {
                row: '=',
                column: '=',
                gtDataService: '=',
                gtEventService: '=',
                onLoadEnd: '&?'
            },
            template: '<div class="gt-cell-text-container">' +
                '<div class="gt-cell-text"><span data-ng-bind="column.settings.cellText"></span></div>' +
                '<div class="gt-cell-edit-btn">' +
                    '<ng-md-icon icon="edit" size="24"></ng-md-icon>' +
                '</div>' +
            '</div>',
            link: function (scope, elem, attrs) {
                // console.log("grid table popupDirective column", scope.column);
                scope.popupData = {};
                scope.popupSettings = null;

                var cellMethods = scope.column.methods;
                var bodyElem = document.querySelector("body");
                var cellTextContainer = elem[0].querySelector('.gt-cell-text-container');

                var popupBackdropElem = document.createElement("div");
                popupBackdropElem.classList.add("popup-area-backdrop");

                var popUpElem;
                var popupContent;
                var popupFooter = "<div class='popup-area-footer'>" +
                        "<md-button class='m-l-0' data-ng-click='cancelPopupArea()'>Cancel</md-button>" +
                        "<md-button class='m-r-0' data-ng-click='acceptPopupChanges()'>Agree</md-button>" +
                    "</div>"

                var getPopupHtmlContent = function () {

                    var popupMain;

                    switch (scope.column.cellType) {
                        case 'text':

                            popupMain = "<text-input label='{{column.columnName}}' " +
                                "placeholder-text='{{column.columnName}}' " +
                                "model='popupData.value'></text-input>"

                            break;

                        case 'number':
                            popupMain = "<number-input label='{{column.columnName}}' model='popupData.value'></number-input>"
                            break;

                        case 'custom_popup':

                            if (scope.popupSettings.contentHtml.hasOwnProperty('main')) {
                                popupMain = scope.popupSettings.contentHtml.main
                            }

                            break;
                    }

                    popupContent = "<div class='popup-area-container'>" +
                        "<div class='popup-area-main'>" + popupMain + "</div>" +
                        popupFooter +
                    "</div>"

                };

                // Popup methods
                var createPopup = function (posX, posY) {

                    popUpElem = document.createElement("div");
                    popUpElem.classList.add("popup-area");
                    console.log("grid table popupContent", popupContent);
                    popUpElem.innerHTML = popupContent

                    $compile($(popUpElem))(scope);
                    console.log("grid table popUpElem", popUpElem);

                    bodyElem.appendChild(popupBackdropElem);
                    $(bodyElem).append($(popUpElem));

                    scope.$apply();

                    popUpElem.addEventListener('mouseenter', function (e) {
                        e.stopPropagation();
                    });

                    setPopupPosition(posX, posY);

                    if (scope.column.settings.closeOnMouseOut !== false) {
                        popupBackdropElem.addEventListener('mouseenter', closePopupArea, {once: true});
                    }

                }

                scope.acceptPopupChanges = function () {

                    var popupValue = null;

                    if (scope.popupData.value) {
                        popupValue = scope.popupData.value
                    }

                    scope.column.settings.cellText = popupValue
                    scope.column.settings.value = popupValue
                    // gridTableData.body[scope.row.order].columns[scope.column.order].settings.value = popupValue;
                    console.log("grid table after cell change", scope.popupData, scope.column)
                    if (cellMethods && cellMethods.onChange) {
                        cellMethods.onChange(scope.row.order, scope.column.order, scope.gtDataService, scope.gtEventService)
                    }

                    scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED);

                    closePopupArea();

                };

                function closePopupArea () {
                    bodyElem.removeChild(popupBackdropElem);
                    bodyElem.removeChild(popUpElem);
                }

                scope.cancelPopupArea = function () {

                    closePopupArea();

                    if (scope.column.settings.value &&
                        typeof scope.column.settings.value === 'object') {

                        scope.popupData.value = JSON.parse(JSON.stringify(scope.column.settings.value))

                    } else {
                        scope.popupData.value = scope.column.settings.value
                    }

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

                // < Popup methods >

                var init = function () {

                    if (!scope.column.settings.hasOwnProperty('cellText')) {
                        scope.column.settings.cellText = scope.column.settings.value
                    }

                    if (scope.onLoadEnd) {
                        scope.onLoadEnd();
                    }

                    /*if (scope.column.settings && scope.column.settings.value) {
                        scope.cellValue = scope.column.settings.value;
                    }*/

                    switch (scope.column.cellType) {
                        case 'custom_popup':

                            scope.popupSettings = scope.column.settings.popupSettings

                            if (scope.popupSettings.contentHtml.hasOwnProperty('footer')) {
                                popupFooter = scope.popupSettings.contentHtml.footer
                            }

                        case 'text':
                        case 'number':

                            getPopupHtmlContent();

                            cellTextContainer.addEventListener('click', function (e) {

                                var posX = e.pageX;
                                var posY = e.pageY;

                                if (scope.column.settings.value) {

                                    if (scope.column.settings.value &&
                                        typeof scope.column.settings.value === 'object') {

                                        scope.popupData.value = JSON.parse(JSON.stringify(scope.column.settings.value))

                                    } else {
                                        scope.popupData.value = scope.column.settings.value
                                    }

                                }

                                createPopup(posX, posY);

                            })

                            break;

                        case 'date':

                            cellTextContainer.addEventListener('click', function (e) {
                                pickmeup(cellTextContainer).show();
                            })

                            var dataVal = scope.column.settings.value;

                            if (dataVal) {

                                pickmeup(cellTextContainer, {
                                    date: new Date(dataVal),
                                    current: new Date(dataVal),
                                    position: 'right',
                                    hide_on_select: true,
                                    format: 'Y-m-d'
                                });

                            } else {

                                pickmeup(cellTextContainer, {
                                    position: 'right',
                                    hide_on_select: true,
                                    format: 'Y-m-d'
                                });

                            }

                            cellTextContainer.addEventListener('pickmeup-change', function (event) {

                                scope.column.settings.value = event.detail.formatted_date;
                                scope.column.settings.cellText = event.detail.formatted_date;
                                scope.$apply();

                                scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED);

                            });

                            break;

                    }

                };

                init();

            }
        }
    }

}());