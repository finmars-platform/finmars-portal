/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                filters: '=',
                columns: '=',
                tabs: '=',
                grouping: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function (scope, elem, attrs) {
                console.log('Grouping component');

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.$watchCollection('grouping', function () {
                    console.log('change');
                    scope.externalCallback();
                });

                scope.removeGroup = function (group) {
                    //console.log('grouping', scope.grouping);
                    //console.log('remove', group);
                    scope.grouping = scope.grouping.map(function (item) {
                        if (item.id === group.id || item.name === group.name) {
                            return undefined
                        }
                        return item
                    }).filter(function (item) {
                        return !!item;
                    });
                    //console.log('grouping after', scope.grouping);
                    setTimeout(function () {
                        scope.externalCallback();
                    }, 0)
                };

                scope.openModalSettings = function (ev) {
                    $mdDialog.show({
                        controller: 'gModalController as vm', // ../directives/gTable/gModalComponents
                        templateUrl: 'views/directives/groupTable/modal-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        locals: {
                            callback: scope.externalCallback,
                            parentScope: scope
                        }
                    }).then(function (answer) {
                        scope.status = 'You said the information was "' + answer + '".';
                    }, function () {
                        scope.status = 'You cancelled the dialog.';
                    });
                }
            }
        }
    }


}());