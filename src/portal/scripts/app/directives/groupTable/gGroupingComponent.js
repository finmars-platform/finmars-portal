/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                entityType: '=',
                filters: '=',
                columns: '=',
                tabs: '=',
                sorting: '=',
                folding: '=',
                grouping: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/grouping-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupGrouping', 'initialized');

                scope.sortHandler = function (group, sort) {
                    var i;
                    for (i = 0; i < scope.grouping.length; i = i + 1) {
                        if (!scope.grouping[i].options) {
                            scope.grouping[i].options = {};
                        }
                        scope.grouping[i].options.sort = null;
                    }
                    group.options.sort = sort;
                    if (group.hasOwnProperty('id')) {
                        scope.sorting.group = {};
                        scope.sorting.group.id = group.id;
                        scope.sorting.group.key = null;
                        scope.sorting.group.sort = sort;
                    } else {
                        scope.sorting.group = {};
                        scope.sorting.group.id = null;
                        scope.sorting.group.key = group.key;
                        scope.sorting.group.sort = sort;
                    }
                    setTimeout(function(){
                        scope.externalCallback();
                        scope.$apply();
                    }, 0)
                };

                scope.openGroupSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.$watchCollection('grouping', function () {
                    scope.externalCallback();
                });

                scope.toggleGroupFold = function () {
                    scope.folding = !scope.folding;
                    console.log('scope.folding', scope.folding);
                    setTimeout(function(){
                        scope.externalCallback();
                        scope.$apply();
                    }, 0)
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