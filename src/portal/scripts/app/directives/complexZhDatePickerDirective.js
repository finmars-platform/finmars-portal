/**
 * Created by mevstratov on 08.03.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {

        return {
            restrict: 'AE',
            scope: {
                displayOptions: '<',
                callbackMethod: '&',
                datepickerOptions: '=',
                date: '='
            },
            templateUrl: 'views/directives/zh-date-picker-complex-view.html',
            link: function (scope, elem, attrs) {

                console.log('complex datepicker', scope.displayOptions, scope.date, scope.datepickerOptions, scope.callbackMethod);

                var input = $(elem).find('#complex-datepicker-input');

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

                scope.datepickerActiveMode = '';

                scope.getDatepickerName = function () {
                    if (scope.displayOptions.labelName) {
                        return scope.displayOptions.labelName + ": " + scope.datepickerActiveMode + " mode";
                    } else {
                        return "Date: " +  scope.datepickerActiveMode + " mode";
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

                scope.todayMode = function () {
                    scope.datepickerActiveMode = 'Today';
                    scope.datepickerOptions.datepickerMode = 'today';

                    var today = moment(new Date()).format('YYYY-MM-DD');
                    scope.date = today;

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                    input.attr('disabled', '');
                };

                scope.yesterdayMode = function () {
                    scope.datepickerActiveMode = 'Yesterday';
                    scope.datepickerOptions.datepickerMode = 'yesterday';
                    var yesterday = moment(new Date()).subtract(1, 'day').format('YYYY-MM-DD');

                    scope.date = yesterday;

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                    input.attr('disabled', '');
                };

                scope.datepickerMode = function () {
                    scope.datepickerActiveMode = 'Datepicker';
                    scope.datepickerOptions.datepickerMode = 'datepicker';

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                    input.removeAttr('disabled');
                };

                scope.expressionMode = function () {
                    scope.datepickerActiveMode = 'Custom';
                    scope.datepickerOptions.datepickerMode = 'expression';

                    setTimeout(function () {
                        scope.callbackMethod()
                    }, 500);
                };

                scope.openEditExpressionDialog = function ($event) {
                    $mdDialog.show({
                        controller: 'ExpressionEditorDialogController as vm',
                        templateUrl: 'views/dialogs/expression-editor-dialog-view.html',
                        targetEvent: $event,
                        autoWrap: true,
                        locals: {
                            item: scope.datepickerOptions
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            console.log("res", res.data);

                            scope.datepickerOptions.expression = res.data.item.expression;
                            // scope.$apply();
                            console.log('complex datepicker datepickerOptions', scope.datepickerOptions);

                            if (scope.callbackMethod) {
                                scope.callbackMethod();
                            }
                        }
                    });
                };

                switch (scope.datepickerOptions.datepickerMode) {
                    case "today":
                        scope.todayMode();
                        break;
                    case "yesterday":
                        scope.yesterdayMode();
                        break;
                    case "expression":
                        scope.expressionMode();
                        break;
                    default:
                        scope.datepickerMode();
                }

            }
        }

    }

}());