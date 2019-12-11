/**
 * Created by szhitenev on 28.06.2016.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'E',
            templateUrl: 'views/directives/context-menu-constructor-option-view.html',
            replace: true,
            transclude : true,
            scope: {
                item: '=',
                parent: '=',
                index: '=',
                addCallback: '&',
                editCallback: '&',
                deleteCallback: '&',
                moveUpCallback: '&',
                moveDownCallback: '&'
            },
            link: function (scope, elem, attrs, ngModelCtrl) {

                scope.editOption = function ($event, item) {

                    console.log("Directive edit", item);

                    scope.editCallback({event: $event, item: item})

                };

                scope.moveUp = function (itemIndex) {
                    console.log("sorting moveUp itemIndex", itemIndex);
                    scope.moveUpCallback({itemIndex: itemIndex});
                };

                scope.moveDown = function (itemIndex) {
                    console.log("sorting moveDown itemIndex", itemIndex);
                    scope.moveDownCallback({itemIndex: itemIndex});
                };

                scope.addOption = function ($event, item) {

                    console.log("Directive add", item);

                    scope.addCallback({event: $event, item: item})

                };

                scope.deleteOption = function ($event, item, $index) {

                    console.log("Directive delete", item);

                    scope.deleteCallback({event: $event, item: item, index: $index})

                }


            }
        };
    }

}());