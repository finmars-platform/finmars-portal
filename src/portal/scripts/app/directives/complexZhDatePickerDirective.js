/**
 * Created by mevstratov on 08.03.2019.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {

        return {
            restrict: 'AE',
            scope: {
                position: '@',
                defaultDate: '@',
                callbackMethod: '&',
                labelName: '<',
                datepickerOptions: '=',
                date: '='
            },
            templateUrl: 'views/directives/zh-date-picker-complex-view.html',
            link: function (scope, elem, attrs) {

                console.log('complex datepicker', scope.date, scope.datepickerOptions, scope.callbackMethod);

                var input = $(elem).find('#complex-datepicker-input');

                var position = 'right';
                if (scope.position) {
                    position = scope.position;
                }

                var defaultDate = false;
                if (scope.defaultDate) {
                    defaultDate = true;
                }

                scope.datepickerActiveMode = '';

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
                    scope.datepickerActiveMode = 'Expression';
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

                if (scope.datepickerOptions.datepickerMode) {
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

                    console.log('complex datepicker active mode', scope.datepickerOptions.datepickerMode);
                }

            }
        }

    }

}());