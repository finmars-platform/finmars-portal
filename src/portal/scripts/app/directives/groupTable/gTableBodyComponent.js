/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../services/logService');
    var metaService = require('../../services/metaService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                items: '=',
                grouping: '=',
                tabs: '=',
                columns: '=',
                entityType: '='
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupTableBody', 'initialized');

                //console.log('scope columns', scope.columns);

                var entityType = scope.entityType;
                var keywords = [];

                keywords = metaService.getBaseAttrs();

                scope.toggleGroupFold = function (item) {
                    console.log('item.isFolded', item.isFolded);
                    item.isFolded = !item.isFolded;
                };

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

                scope.deleteEntity = function (ev, entity) {
                    $mdDialog.show({
                        controller: 'EntityViewerDeleteDialogController as vm',
                        templateUrl: 'views/entity-viewer/entity-viewer-delete-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            entity: entity
                        }
                    });
                };

                scope.editEntity = function (ev, entity) {
                    $mdDialog.show({
                        controller: 'EntityViewerEditDialogController as vm',
                        templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        clickOutsideToClose: true,
                        locals: {
                            parentScope: scope,
                            entity: entity
                        }
                    });
                };
            }
        }
    }


}());