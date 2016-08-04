/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var bindCellService = require('../../services/bindCellService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                items: '=',
                grouping: '=',
                externalCallback: '&',
                columns: '=',
                itemAdditionsEditorEntityId: '=',
                isAllSelected: '=',
                entityType: '='
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupTableBody', 'initialized');

                scope.readyStatus = {cellsReady: false};

                var entityType = scope.entityType;
                var baseAttrs = [];
                var entityAttrs = [];

                var entityFieldsArray = {};

                baseAttrs = metaService.getBaseAttrs();
                entityAttrs = metaService.getEntityAttrs(entityType);

                scope.toggleGroupFold = function (item) {
                    //console.log('item.isFolded', item.isFolded);
                    item.isFolded = !item.isFolded;
                };

                scope.openEntityMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                var getFieldDisplayNamesArray = function () {
                    var i;
                    var promises = [];
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        //console.log(scope.columns[i]);
                        if (scope.columns[i]['value_type'] === 'field') {
                            promises.push(bindCellService.findEntities(scope.columns[i].key));
                        }
                        if (scope.columns[i]['value_type'] === 30) {
                            console.log('scope.columns[i]', scope.columns[i]);
                            promises.push(attributeTypeService.getByKey(entityType, scope.columns[i].id));
                        }
                    }

                    Promise.all(promises).then(function (results) {
                        console.log('results', results);
                        results.forEach(function (item) {
                            if (item.key) {
                                entityFieldsArray[item.key] = item.data;
                            } else {
                                entityFieldsArray['classifier_' + item.id] = item;
                            }
                        });
                        scope.readyStatus.cellsReady = true;
                    });

                    //console.log('entityFieldsArray', entityFieldsArray);
                };

                scope.toggleSelectRow = function (item) {
                    console.log('item111111111111111111', item);
                    item.selectedRow = !item.selectedRow;
                    if (scope.isAllSelected === true && item.selectedRow === false) {
                        scope.isAllSelected = false;
                    }

                    var allSelected = true;
                    scope.items.forEach(function (item) {
                        if (item.hasOwnProperty('groups')) {
                            if (!!item.selectedRow === false) {
                                allSelected = false;
                            }
                            item.items.forEach(function (row) {
                                if (!!row.selectedRow === false) {
                                    allSelected = false;
                                }
                            })
                        } else {
                            if (!!item.selectedRow === false) {
                                allSelected = false;
                            }
                        }
                    });

                    if (allSelected) {
                        scope.isAllSelected = true;
                    }
                };

                scope.$watchCollection('columns', function () {
                    scope.readyStatus.cellsReady = false;
                    getFieldDisplayNamesArray();
                });


                scope.bindCell = function (groupedItem, column) {

                    function findNodeInChildren(item) {
                        if (groupedItem[column.name] == item.id) {
                            classifierNode = item;
                        } else {
                            if (item.children.length) {
                                item.children.forEach(findNodeInChildren);
                            }
                        }
                    }

                    if (column.hasOwnProperty('id')) {
                        if (column['value_type'] === 30) {
                            if (scope.readyStatus.cellsReady) {
                                var classifierNode;
                                entityFieldsArray['classifier_' + column.id].classifiers.forEach(findNodeInChildren);
                                if (classifierNode) {
                                    if (classifierNode['display_name']) {
                                        return classifierNode['display_name'];
                                    }
                                    return classifierNode['name'];
                                }
                                return '';
                            } else {
                                return '<div class="zh-loader"></div>';
                            }
                        } else {
                            return groupedItem[column.name];
                        }
                    } else {
                        var i, e;
                        for (i = 0; i < baseAttrs.length; i = i + 1) {
                            if (baseAttrs[i].key === column.key) {
                                return groupedItem[baseAttrs[i].key];
                            }
                        }

                        for (e = 0; e < entityAttrs.length; e = e + 1) {

                            if (entityAttrs[e].key === column.key) {
                                if (column['value_type'] === 'field') {
                                    var _groupedItemVal = groupedItem[entityAttrs[e].key];
                                    if (scope.readyStatus.cellsReady) {
                                        //console.log('entityFieldsArray', entityFieldsArray);
                                        var result = entityFieldsArray[column.key].filter(function (item) {
                                            return item.id === _groupedItemVal;
                                        })[0];
                                        if (result) {
                                            if (result['display_name']) {
                                                return result['display_name'];
                                            }
                                            return result['name'];
                                        }
                                        return '';
                                    } else {
                                        return '<div class="zh-loader"></div>';
                                    }
                                } else {
                                    if (column['value_type'] === 'mc_field') {
                                        if(groupedItem[entityAttrs[e].key].length == 1) {
                                            return 'linked with ' + groupedItem[entityAttrs[e].key].length + ' entity'
                                        } else {
                                            if(groupedItem[entityAttrs[e].key].length > 1) {
                                                return 'linked with ' + groupedItem[entityAttrs[e].key].length + ' entities'
                                            }
                                        }
                                    } else {
                                        return groupedItem[entityAttrs[e].key];
                                    }
                                }
                            }
                        }
                    }
                };

                scope.bindCellTitle = function (item, column) {
                    return item[column.key];
                };

                scope.rowCallback = function (item, ev) {
                    //console.log('open additions!', item);
                    if(localStorage.getItem('entityIsChanged') === "true") { // wow such shitcode
                        $mdDialog.show({
                            controller: 'WarningDialogController as vm',
                            templateUrl: 'views/warning-dialog-view.html',
                            parent: angular.element(document.body),
                            targetEvent: ev,
                            clickOutsideToClose: true,
                            locals: {
                                warning: {
                                    title: 'Warning',
                                    description: 'Unsaved data will be lost'
                                }
                            }
                        }).then(function (res) {
                            if (res.status === 'agree') {
                                scope.itemAdditionsEditorEntityId = item.id;
                                localStorage.setItem('entityIsChanged', false);
                            }
                        });
                    } else {
                        scope.itemAdditionsEditorEntityId = item.id;
                        localStorage.setItem('entityIsChanged', false);
                    }
                };

                scope.getAlign = function (column) {

                    switch (column['value_type']) {
                        case 20:
                            return 'cell-right-align';
                            break;
                        case 'float':
                            return 'cell-right-align';
                            break;
                        case 40:
                            return 'cell-center-align';
                            break;
                        default:
                            return '';
                            break;
                    }
                };

                scope.deleteEntity = function (ev, entity) {
                    $mdDialog.show({
                        controller: 'EntityViewerDeleteDialogController as vm',
                        templateUrl: 'views/entity-viewer/entity-viewer-entity-delete-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        //clickOutsideToClose: true,
                        locals: {
                            entityId: entity.id,
                            entityType: scope.entityType
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            scope.externalCallback();
                        }
                    })
                };

                scope.editEntity = function (ev, entity) {
                    $mdDialog.show({
                        controller: 'EntityViewerEditDialogController as vm',
                        templateUrl: 'views/entity-viewer/entity-viewer-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: ev,
                        //clickOutsideToClose: true,
                        locals: {
                            parentScope: scope,
                            entityId: entity.id
                        }
                    }).then(function (res) {
                        if (res.res === 'agree') {
                            scope.externalCallback();
                        }
                    });
                };

                console.log('Table body component columns ', scope.columns);
            }
        }
    }


}());