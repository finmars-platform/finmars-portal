(function () {

    var gtEvents = require('../../../services/gridTableEvents');

    'use strict';

    module.exports = function () {
        return {
            restrict: 'E',
            scope: {
                column: '=',
                gtDataService: '=',
                gtEventService: '=',
                onLoadEnd: '&?'
            },
            template: '<div class="gt-cell-text-container">' +
                '<div class="gt-cell-text">' +
                    '<ng-md-icon data-ng-show="sortingOn && !sortRowsReverse" ' +
                                'icon="arrow_upwards" ' +
                                'size="14" ' +
                                'class="gt-sorting-icon"></ng-md-icon>' +
                    '<ng-md-icon data-ng-show="sortingOn && sortRowsReverse" ' +
                                'icon="arrow_downward" ' +
                                'size="14" ' +
                                'class="gt-sorting-icon"></ng-md-icon>' +
                    '<span data-ng-bind="column.columnName" class="sortingOnClick"></span>' +
                '</div>' +
            '</div>',
            link: function (scope, elem, attrs) {

                scope.sortRowsReverse = false;
                scope.sortingOn = false;


                var sortOnClickElem = elem[0].querySelector(".sortingOnClick");

                sortOnClickElem.addEventListener('click', function () {

                    scope.gtDataService.setSortingSettings(scope.column.order);
                    scope.gtEventService.dispatchEvent(gtEvents.SORTING_SETTINGS_CHANGED);

                });

                var sortSettingsChangeIndex = scope.gtEventService.addEventListener(gtEvents.SORTING_SETTINGS_CHANGED, function () {

                    scope.sortingOn = false;
                    scope.sortRowsReverse = false;

                    var sortSettings = scope.gtDataService.getSortingSettings();

                    if (sortSettings.column === scope.column.order) {

                        scope.sortingOn = true;
                        scope.sortRowsReverse = sortSettings.reverse;

                    }

                    scope.$apply();

                });

                if (scope.onLoadEnd) {
                    scope.onLoadEnd();
                }

                scope.$on('$destroy', function () {
                    scope.gtEventService.removeEventListener(gtEvents.SORTING_SETTINGS_CHANGED, sortSettingsChangeIndex)
                });

            }
        }
    }

}());