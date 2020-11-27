(function () {

    var gtEvents = require('../../../services/gridTableEvents');

    'use strict';

    module.exports = function ($compile, $mdDialog) {
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
                '<div class="gt-cell-edit-btn" ng-if="!column.settings.isDisabled">' +
                    '<span class="material-icons">edit</span>' +
                '</div>' +
            '</div>',
            link: function (scope, elem, attrs) {

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

                // Popup methods
                var getPopupHtmlContent = function () {

                    var popupMain;

                    switch (scope.column.cellType) {
                        case 'text':

                            popupMain = "<text-input label='{{column.columnName}}' " +
                                                    "placeholder-text='{{column.columnName}}' " +
                                                    "model='popupData.value' " +
                                                    "small-options='{dialogParent: \".dialog-containers-wrap\"}'>" +
                                        "</text-input>"

                            break;

                        case 'number':
                            popupMain = "<number-input label='{{column.columnName}}' " +
                                                      "model='popupData.value' " +
                                                      "small-options='{dialogParent: \".dialog-containers-wrap\"}'>" +
                                        "</number-input>"
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

                var createPopup = function (posX, posY) {

                    popUpElem = document.createElement("div");
                    popUpElem.classList.add("popup-area");

                    popUpElem.innerHTML = popupContent

                    $compile($(popUpElem))(scope);

                    bodyElem.appendChild(popupBackdropElem);
                    $(bodyElem).append($(popUpElem));

                    scope.$apply();

                    popUpElem.addEventListener('mouseenter', function (e) {
                        e.stopPropagation();
                    });

                    setPopupPosition(posX, posY);

                    document.addEventListener('keyup', function (event) {
                        if (event.key === "Escape") {
                            closePopupArea();
                        }
                    }, {once: true});

                    if (scope.column.settings.closeOnMouseOut !== false) {
                        popupBackdropElem.addEventListener('mouseenter', closePopupArea, {once: true});
                    }

                    if (scope.column.settings.closeOnClick !== false) {
                        popupBackdropElem.addEventListener('click', closePopupArea, {once: true});
                    }

                }

                scope.acceptPopupChanges = function () {

                    var popupValue = null;

                    if (scope.popupData.value) {
                        popupValue = scope.popupData.value
                    }

                    scope.column.settings.cellText = popupValue
                    scope.column.settings.value = popupValue

                    if (cellMethods && cellMethods.onChange) {

                        var rowData = {
                            key: scope.row.key,
                            order: scope.row.order
                        };

                        var colData = {
                            key: scope.column.key,
                            order: scope.column.order
                        };

                        cellMethods.onChange(rowData, colData, scope.gtDataService, scope.gtEventService);

                    }

                    var changedCellData = {
                        row: {
                            key: scope.row.key,
                            order: scope.row.order
                        },
                        column: {
                            key: scope.column.key,
                            order: scope.column.order
                        }
                    };

                    scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED, changedCellData);

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

                    // Victor 12.10.2020
                    if (scope.column.settings.isDisabled) { // not add handlers if column is disabled
                        return;
                    }

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

                                var changedCellData = {
                                    row: {
                                        key: scope.row.key,
                                        order: scope.row.order
                                    },
                                    column: {
                                        key: scope.column.key,
                                        order: scope.column.order
                                    }
                                };

                                scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED, changedCellData);

                            });

                            break;

                        case 'expression':

                            cellTextContainer.addEventListener('click', function (e) {

                                $mdDialog.show({
                                    controller: 'ExpressionEditorDialogController as vm',
                                    templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                                    parent: angular.element(document.body),
                                    targetEvent: e,
                                    preserveScope: true,
                                    multiple: true,
                                    autoWrap: true,
                                    skipHide: true,
                                    locals: {
                                        item: {expression: scope.column.settings.value},
                                        data: scope.column.settings.exprData
                                    }

                                }).then(function (res) {

                                    if (res.status === 'agree') {

                                        scope.column.settings.cellText = res.data.item.expression;
                                        scope.column.settings.value = res.data.item.expression;

                                        var changedCellData = {
                                            row: {
                                                key: scope.row.key,
                                                order: scope.row.order
                                            },
                                            column: {
                                                key: scope.column.key,
                                                order: scope.column.order
                                            }
                                        };

                                        scope.gtEventService.dispatchEvent(gtEvents.CELL_VALUE_CHANGED, changedCellData);

                                    }

                                });

                            })

                        break;

                    }

                };

                init();

            }
        }
    }

}());