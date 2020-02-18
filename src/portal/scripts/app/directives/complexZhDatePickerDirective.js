/**
 * Created by mevstratov on 08.03.2019.
 */
(function () {

    'use strict';

    var metaService = require('../services/metaService');
    var expressionService = require('../services/expression.service');
    var evEvents = require('../services/entityViewerEvents');

    module.exports = function ($mdDialog, pickmeup) {

        return {
            restrict: 'AE',
            scope: {
                displayOptions: '<',
                callbackMethod: '&',
                datepickerOptions: '=',
                date: '=',
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '='
            },
            templateUrl: 'views/directives/complex-zh-date-picker-view.html',
            link: function (scope, elem, attrs) {

                scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();

                var entityType = scope.evDataService.getEntityType();
                var isReport = metaService.isReport(entityType);

                // var input = $(elem).find('.complex-datepicker-input');
                var input = elem[0].querySelector('.complex-datepicker-input');

                var linkToAboveEventIndex;
                var attributesFromAbove;
                var columnKey;

                // TIPS
                // scope.displayOptions is an object that may contain next properties:
                // position: side to show datepicker on
                // defaultDate: show default date in datepicker empty
                // labelName: name to show in label of input

                scope.availableModes = { // determine whether to hide some of datepicker modes
                    inception: true
                };

                var position = 'right';
                var defaultDate = false;

                if (scope.displayOptions) {

                    if (scope.displayOptions.position) {
                        position = scope.displayOptions.position;
                    }

                    if (scope.displayOptions.defaultDate) {
                        defaultDate = scope.displayOptions.defaultDate;
                    }

                    if (scope.displayOptions.modes) {
                        var modesAvailability = scope.displayOptions.modes;

                        var modesAvailabilityKeys = Object.keys(modesAvailability);

                        modesAvailabilityKeys.forEach(function (mode) {
                            scope.availableModes[mode] = modesAvailability[mode];
                        })
                    }

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

                    pickmeup(input, {
                        date: new Date(scope.date),
                        current: new Date(scope.date),
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d'
                    });

                } else {

                    pickmeup(input, {
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d'
                    });

                }

                input.addEventListener("pickmeup-change", function (event) {
                    scope.date = event.detail.formatted_date;
                    scope.$apply();
                });

                scope.testModelChange = function () {
                    scope.callbackMethod();
                };

                scope.toggleMode = function (mode) {
                    scope.datepickerOptions.datepickerMode = mode;
                };

                var enableTodayMode = function () {

                    scope.datepickerActiveModeTitle = 'Today';
                    scope.datepickerOptions.expression = "now()";
                    input.setAttribute('disabled', '');

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
                    input.setAttribute('disabled', '');

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
                    delete scope.datepickerOptions.expression;

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                    input.removeAttribute('disabled');

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                        columnKey = null;
                    }
                };

                var enableExpressionMode = function () {
                    scope.datepickerActiveModeTitle = 'Custom';

                    input.setAttribute('disabled', '');

                    if (linkToAboveEventIndex) {
                        scope.evEventService.removeEventListener(evEvents.ACTIVE_OBJECT_FROM_ABOVE_CHANGE, linkToAboveEventIndex);
                        linkToAboveEventIndex = null;
                    }
                };

                scope.openEditExpressionDialog = function ($event) {

                    if (scope.datepickerOptions.datepickerMode !== 'expression') {
                        scope.datepickerOptions.datepickerMode = 'expression';
                        scope.datepickerOptions.expression = undefined;

                        setTimeout(function () {
                            scope.callbackMethod()
                        }, 500);
                    }

                    var datepickerOptionsCopy = JSON.parse(JSON.stringify(scope.datepickerOptions));

                    var eeData = {returnExpressionResult: true};

                    if (isReport) {
                        eeData.entityType = entityType;
                        eeData.attributeDataService = scope.attributeDataService;
                    }

                    $mdDialog.show({
                        controller: 'ExpressionEditorDialogController as vm',
                        templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                        targetEvent: $event,
                        autoWrap: true,
                        locals: {
                            item: {expression: datepickerOptionsCopy.expression},
                            data: eeData
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
                    delete scope.datepickerOptions.expression;

                    scope.date = '0001-01-01';

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
                            data: {
                                item: columnKey,
                                data: {value_type: 40},
                                entityType: entityType
                            },
                            attributeDataService: scope.attributeDataService
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
                    input.setAttribute('disabled', '');

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

                    }
                });

            }
        }

    }

}());