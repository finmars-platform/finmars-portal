/**
 * Created by szhitenev on 01.07.2016.
 */
(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'AE',
            scope: {
                position: '@',
                defaultDate: '=',
                dateValue: '='
            },
            require: '?ngModel',
            template: '<div class="pick-me-up"><input type="text" value=""></div>',
            link: function (scope, elem, attrs, ngModel) {

                // console.log('datepicker!');

                var input = $(elem).find('input');

                var position = 'right';

                if (scope.position) {
                    position = scope.position;
                }

                var defaultDate = false;
                if (scope.defaultDate) {
                    defaultDate = true;
                }

                scope.$watch(function () {

                    return ngModel.$modelValue;

                }, function (newValue) {
                    if (ngModel.$modelValue) {
                        input.val(newValue);
                    }
                });

                if (scope.dateValue) {

                    $(elem).parent().addClass('md-input-has-value');
                    input.pickmeup({
                        date: new Date(scope.dateValue),
                        current: new Date(scope.dateValue),
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d',
                        change: function () {
                            ngModel.$setViewValue(this.value);
                        }
                    });

                } else {

                    input.pickmeup({
                        position: position,
                        default_date: defaultDate,
                        hide_on_select: true,
                        format: 'Y-m-d',
                        change: function () {
                            ngModel.$setViewValue(this.value);
                        }
                    });

                }

            }
        }

    }

}());