/**
 * Created by mevstratov on 08.03.2019.
 */
(function () {

    'use strict';

    var expressionService = require('../services/expression.service');
    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog) {

        return {
            restrict: 'AE',
            scope: {
                displayOptions: '<',
                callbackMethod: '&',
                datepickerOptions: '=',
                date: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/complex-zh-date-picker-view.html',
            link: function (scope, elem, attrs) {

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                var input = $(elem).find('.complex-datepicker-input');

                var linkToAboveEventIndex;
                var attributesFromAbove;
                var columnKey;

                // TIPS
                // scope.displayOptions is an object that may contain next properties:
                // position: side to show datepicker on
                // defaultDate: show default date in datepicker empty
                // labelName: name to show in label of input

                var position = 'right';
                if (scope.displayOptions.position) {
                    position = scope.displayOptions.position;
                }

                var defaultDate = false;
                if (scope.displayOptions.defaultDate) {
                    defaultDate = scope.displayOptions.defaultDate;
                }

                scope.datepickerActiveModeTitle = '';

                scope.getDatepickerName = function () {
                    if (scope.displayOptions.labelName) {
                        return scope.displayOptions.labelName + ": " + scope.datepickerActiveModeTitle;
                    } else {
                        return "Date: " +  scope.datepickerActiveModeTitle + " mode";
                    }
                };

                if (scope.date) {

                    input.pickmeup({
                        date: new Date(scope.date),
                        current: new Date(scope.date),
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d',
                        change: function () {
                            scope.date = this.value;
                            scope.$apply();
                            scope.callbackMethod();
                        }
                    });

                } else {

                    input.pickmeup({
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d',
                        change: function () {
                            scope.date = this.value;
                            scope.$apply();
                            scope.callbackMethod();
                        }
                    });

                }

                scope.toggleMode = function (mode) {
                    scope.datepickerOptions.datepickerMode = mode;
                };

                var enableTodayMode = function () {

                    scope.datepickerActiveModeTitle = 'Today';
                    scope.datepickerOptions.expression = "now()";
                    input.attr('disabled', '');

                    var today = moment(new Date()).format('YYYY-MM-DD');
                    scope.date = today;

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                        columnKey = null;
                    }

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);

                };

                var enableYesterdayMode = function () {

                    scope.datepickerActiveModeTitle = 'Yesterday';
                    scope.datepickerOptions.expression = "now()-days(1)";
                    input.attr('disabled', '');

                    var yesterday = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');

                    scope.date = yesterday;

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                        columnKey = null;
                    }

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);

                };

                var enableDatepickerMode = function () {
                    scope.datepickerActiveModeTitle = 'Datepicker';
                    // scope.datepickerOptions.datepickerMode = 'datepicker';
                    delete scope.datepickerOptions.expression;

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                    input.removeAttr('disabled');

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                        columnKey = null;
                    }
                };

                var enableExpressionMode = function () {
                    scope.datepickerActiveModeTitle = 'Custom';

                    input.attr('disabled', '');

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                    }
                };

                scope.openEditExpressionDialog = function ($event) {

                    if (scope.datepickerOptions.datepickerMode !== 'expression') {
                        scope.datepickerOptions.datepickerMode = 'expression';
                        scope.datepickerOptions.expression = undefined;
                    }

                    var datepickerOptionsCopy = JSON.parse(JSON.stringify(scope.datepickerOptions));

                    $mdDialog.show({
                        controller: 'ExpressionEditorDialogController as vm',
                        templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                        targetEvent: $event,
                        autoWrap: true,
                        locals: {
                            item: {expression: datepickerOptionsCopy.expression},
                            data: {returnExpressionResult: true}

                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            console.log("res", res.data);

                            scope.datepickerOptions.expression = res.data.item.expression;

                            var expressionData = {
                                expression: scope.datepickerOptions.expression,
                                is_eval: true
                            };

                            expressionService.getResultOfExpression(expressionData).then(function (resData) {

                                scope.date = resData.result;
                                scope.datepickerOptions.date = resData.result;
                                scope.$apply();

                                if (scope.callbackMethod) {
                                    scope.callbackMethod();
                                }

                            }).catch(function (error) {

                                $mdDialog.show({
                                    controller: 'WarningDialogController as vm',
                                    templateUrl: 'views/warning-dialog-view.html',
                                    clickOutsideToClose: false,
                                    locals: {
                                        warning: {
                                            title: 'Error',
                                            description: 'Invalid expression'
                                        }
                                    }
                                });

                            });
                        }
                    });
                };

                var enableInceptionDateMode = function () {
                    // scope.datepickerOptions.datepickerMode = 'datepicker';
                    delete scope.datepickerOptions.expression;

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                        columnKey = null;
                    }
                };

                scope.chooseEntityToUseFromAbove = function ($event) {

                    attributesFromAbove = scope.evDataService.getAttributesFromAbove().filter(function(attribute) {
                        return attribute.value_type === 40;
                    });

                    if (scope.datepickerOptions.datepickerMode !== 'link_to_above') {
                        scope.datepickerOptions.datepickerMode = 'link_to_above';
                    }

                    $mdDialog.show({
                        controller: 'UseFromAboveDialogController as vm',
                        templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        preserveScope: true,
                        multiple: true,
                        autoWrap: true,
                        skipHide: true,
                        locals: {
                            item: columnKey,
                            data: {attributes: attributesFromAbove}
                        }
                    }).then(function (res) {

                        if (res.status === 'agree' && res.data.item) {

                            columnKey = res.data.item;

                        }
                    })

                };

                var enableLinkToAboveMode = function () {

                    scope.datepickerActiveModeTitle = 'Link To Above';

                    delete scope.datepickerOptions.expression;
                    input.attr('disabled', '');

                    linkToAboveEventIndex = scope.evEventService.addEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, function () {

                        if (columnKey) {

                            var activeObjectFromAbove = scope.evDataService.getActiveObjectFromAbove();

                            var key = columnKey;
                            var value = activeObjectFromAbove[key];

                            scope.date = [value];

                            if (scope.callbackMethod) {
                                setTimeout(function() {
                                    scope.callbackMethod();
                                }, 500)
                            }

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                        }

                    });

                };

                scope.$watch("datepickerOptions.datepickerMode", function (datepickerMode) {

                    switch (datepickerMode) {
                        case "today":
                            enableTodayMode();
                            break;
                        case "yesterday":
                            enableYesterdayMode();
                            break;
                        case "expression":
                            enableExpressionMode();
                            break;
                        case "datepicker":
                            enableDatepickerMode();
                            break;
                        case "inception":
                            enableInceptionDateMode();
                            break;
                        case "link_to_above":
                            if (!scope.isRootEntityViewer) {
                                enableLinkToAboveMode();
                            } else {
                                enableDatepickerMode();
                            }
                            break;
                        default:
                            scope.datepickerOptions.datepickerMode = 'datepicker';
                            // scope.date = moment(new Date()).format('YYYY-MM-DD');
                            // enableDatepickerMode();
                    }
                });

            }
        }

    }

}());