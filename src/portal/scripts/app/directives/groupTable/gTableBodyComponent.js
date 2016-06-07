/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                items: '=',
                grouping: '=',
                tabs: '=',
                columns: '=',
                entityType: '@'
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {
                console.log('Table body component', scope.items);
                //console.log('scope columns', scope.columns);

                var entityType = scope.entityType;
                var keywords = [];
                scope.keywordsReady = false;

                metaService.getBaseAttrs().then(function (data) {
                    keywords = data[entityType];
                    scope.keywordsReady = true;
                    scope.$apply();
                });

                scope.openEntityMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.bindCell = function (groupedItem, column) {
                    if (column.hasOwnProperty('id')) {
                        return groupedItem[column.name];
                    } else {
                        var i;
                        for (i = 0; i < keywords.length; i = i + 1) {
                            if (keywords[i].name === column.name) {
                                return groupedItem[keywords[i].key];
                            }
                        }
                    }
                };

                scope.rowCallback = function (item) {
                    console.log('open additions!', item);
                    if (scope.entityType === 'portfolio') {
                        scope.$parent.externalGetAdditions({id: item.id}).then(function () {
                            scope.$parent.additionsStatus.additionsWorkArea = true;
                            console.log('work?', scope);
                        });
                    }
                };

                scope.deleteEntity = function (ev, portfolio) {
                    $mdDialog.show({
                        controller: 'PortfolioDeleteDialogController as vm',
                        templateUrl: 'views/administration/portfolio-delete-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            portfolio: portfolio
                        }
                    });
                };

                scope.editEntity = function (ev, portfolio) {
                    $mdDialog.show({
                        controller: 'PortfolioEditDialogController as vm',
                        templateUrl: 'views/administration/portfolio-edit-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            parentScope: scope,
                            portfolio: portfolio
                        }
                    });
                };
            }
        }
    }


}());