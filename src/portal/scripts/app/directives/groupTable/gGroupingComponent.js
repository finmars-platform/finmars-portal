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
                sorting: '=',
                grouping: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function (scope, elem, attrs) {
                console.log('Grouping component');

                console.log('grouping', scope.grouping);

                scope.sortHandler = function (group, sort) {
                    console.log('group', group);
                    var i;
                    for (i = 0; i < scope.grouping.length; i = i + 1) {
                        if (!scope.grouping[i].options) {
                            scope.grouping[i].options = {};
                        }
                        scope.grouping[i].options.sort = null;
                    }
                    group.options.sort = sort;
                    if(group.hasOwnProperty('id')) {
                        scope.sorting.group.id = group.id;
                        scope.sorting.group.key = null;
                        scope.sorting.group.sort = sort;
                    } else {
                        scope.sorting.group = {};
                        scope.sorting.group.id = null;
                        scope.sorting.group.key = group.key;
                        scope.sorting.group.sort = sort;
                    }
                    scope.externalCallback();
                };

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.$watchCollection('grouping', function () {
                    //console.log('change');
                    scope.externalCallback();
                });

                scope.toggleGroupFold = function(item){
                    item.options.isFolded = !item.options.isFolded;
                    scope.externalCallback();
                };

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