/**
 * Created by mevstratov on 5.04.2019.
 */
(function () {

    'use strict';

    module.exports = function () {

        return {
            restrict: 'E',
            scope: {
                labelTitle: '@',
                model: '=',
                loadRelation: '&',
                relationItems: '=',
                propertyName: '@',
                propertyValue: '@',
                selectedValue: '<',
                selectedName: '<'
            },
            templateUrl: 'views/directives/ttype-actions-relations-select-view.html',
            link: function (scope, elem, attrs) {

                if (!scope.propertyValue) {
                    scope.propertyValue = "id";
                }
                if (!scope.propertyName) {
                    scope.propertyName = "name";
                }
                elem[0].title = scope.labelTitle;

                scope.loadRelationsOnOpen = function () {
                    if (!scope.relationItems) {
                        scope.loadRelation().then(function () {
                            scope.$apply();
                        });
                    }
                };

                scope.filterPredicateFunction = function (propertyName, searchTerm) {
                    if (searchTerm) {
                        return function (item) {
                            return item[propertyName].indexOf(searchTerm) !== -1;
                        }
                    }
                };

            }
        }
    };

}());