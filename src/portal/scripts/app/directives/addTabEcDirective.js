/**
 * Created by szhitenev on 01.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($compile) {
        return {
            scope: {
                tabs: '='
            },
            link: function (scope, elem) {

                var btnString = '<md-button class="ec-tab-add-btn"' +
                    'data-ng-click="vm.addTab()" aria-label="tab addition button">' +
                    '<span class="material-icons">add_circle</span>' +
                    '</md-button>';

                var btn = $compile(btnString)(scope.$parent);

                var wrapper  = $(elem).find('md-pagination-wrapper');

                wrapper.append(btn);

            }
        }
    }


}());