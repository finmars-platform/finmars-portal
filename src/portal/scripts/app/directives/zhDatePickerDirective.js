/**
 * Created by szhitenev on 01.07.2016.
 */
(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'AE',
            scope: {
                position: '@'
            },
            require: '?ngModel',
            template: '<div class="pick-me-up"><input type="text" value=""></div>',
            // template: '<md-input-container class="pick-me-up"><input type="text" value=""></md-input-containe>',
            link: function (scope, elem, attrs, ngModel) {
                //console.log('ngModel', ngModel);
                var input = $(elem).find('input');

                var position = 'right';

                if (scope.position) {
                    position = scope.position;
                }

                //setTimeout(function () {
                if (ngModel.$modelValue) {
                    $(elem).parent().addClass('md-input-has-value');
                    input.pickmeup({
                        date: new Date(ngModel.$modelValue),
                        position: position,
                        default_date: false,
                        'hide_on_select': true,
                        format: 'Y-m-d',
                        change: function () {
                            ngModel.$setViewValue(this.value);
                        }
                    });
                } else {
                    $(elem).parent().addClass('md-input-has-value');
                    input.pickmeup({
                        position: position,
                        default_date: false,
                        'hide_on_select': true,
                        format: 'Y-m-d',
                        change: function () {
                            ngModel.$setViewValue(this.value);
                        }
                    });
                }


                scope.$watch(function () {
                    //console.log('ngModel', ngModel);
                    if (ngModel.$modelValue) {
                        input.val(moment(new Date(ngModel.$modelValue)).format('YYYY-MM-DD'));
                    }
                });


                //    scope.$apply();
                //}, 0);


            }
        }

    }

}());