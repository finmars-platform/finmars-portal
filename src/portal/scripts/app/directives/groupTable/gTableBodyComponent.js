/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var entityClassifierSingletonService = require('../../services/entityClassifierSingletonService');
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

                logService.component('groupTableBody', 'initialized', 1);

                scope.readyStatus = {cellsReady: false, groupsReady: true}; // if groups not exist

                var entityType = scope.entityType;
                var baseAttrs = [];
                var entityAttrs = [];

                var entityFieldsArray = {};

                var classifiersInstances = {};

                baseAttrs = metaService.getBaseAttrs();
                entityAttrs = metaService.getEntityAttrs(entityType);

                scope.toggleGroupFold = function (item) {
                    //console.log('item.isFolded', item.isFolded);
                    item.isFolded = !item.isFolded;
                };

                scope.openEntityMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                if (scope.grouping.length) {
                    findGroups();
                }

                var getFieldDisplayNamesArray = function () {
                    var i;
                    var promises = [];
                    for (i = 0; i < scope.columns.length; i = i + 1) {
                        console.log(scope.columns[i]);
                        if (scope.columns[i]['value_type'] === 'field') {
                            promises.push(bindCellService.findEntities(scope.columns[i].key, {entityType: entityType}));
                        }
                        if (scope.columns[i]['value_type'] === 30) {
                            //console.log('scope.columns[i]', scope.columns[i]);
                            promises.push(attributeTypeService.getByKey(entityType, scope.columns[i].id));
                        }
                    }

                    Promise.all(promises).then(function (results) {
                        //console.log('results', results);
                        results.forEach(function (item) {
                            if (item.key) {
                                entityFieldsArray[item.key] = item.data;
                            } else {
                                entityFieldsArray['classifier_' + item.id] = item;
                            }
                        });

                        findEntityFields();

                    });

                    //console.log('entityFieldsArray', entityFieldsArray);
                };

                function findGroups() {
                    scope.readyStatus.groupsReady = false; //if groups exist
                    var i, g;
                    var promisesClassifiers = [];
                    var promisesEntityFields = [];

                    for (i = 0; i < scope.items.length; i = i + 1) {
                        //console.log('scope.items[i].groups', scope.items[i].groups);
                        if (scope.items[i].hasOwnProperty('groups')) {
                            for (g = 0; g < scope.items[i].groups.length; g = g + 1) {
                                if (scope.items[i].groups[g]['value_type'] === 'classifier') {
                                    promisesClassifiers.push(entityClassifierSingletonService.getByKey(scope.entityType, scope.items[i].groups[g].value))
                                }
                                if (scope.items[i].groups[g]['value_type'] === 'field') {
                                    //console.log('scope.items[i].groups[g].value', scope.items[i].groups[g].value);
                                    console.log('scope.items[i].groups[g].value', scope.items[i].groups[g]);
                                    if (scope.items[i].groups[g].value !== null) {
                                        promisesEntityFields.push(bindCellService.getByKey(scope.items[i].groups[g].key, scope.items[i].groups[g].value))
                                    }
                                }
                            }
                        }
                    }

                    Promise.all(promisesClassifiers).then(function (data) {
                        var i;
                        for (i = 0; i < data.length; i = i + 1) {
                            if (classifiersInstances[data[i].key] === undefined) {
                                classifiersInstances[data[i].key] = {};
                            }
                            classifiersInstances[data[i].key]['id_' + data[i].data.id] = data[i].data
                        }

                        Promise.all(promisesEntityFields).then(function (data) {
                            var i;
                            for (i = 0; i < data.length; i = i + 1) {
                                if (entityFieldsArray[data[i].key] == undefined) {
                                    entityFieldsArray[data[i].key] = [];
                                }
                                entityFieldsArray[data[i].key].push(data[i].data);
                            }

                            setTimeout(function () {
                                scope.readyStatus.groupsReady = true;
                                scope.$apply();
                            }, 500)

                        });

                    })
                }

                function findEntityFields() {
                    var i, g, e;
                    var promises = [];
                    for (i = 0; i < scope.items.length; i = i + 1) {
                        if (scope.items[i].hasOwnProperty('groups')) {
                            for (g = 0; g < scope.items[i].groups.length; g = g + 1) {

                                if (scope.items[i].groups[g]['value_type'] === 'field') {
                                    var exist = false;
                                    var entityItem;
                                    //console.log('scope.items[i].groups[g].key', scope.items[i].groups[g].key);
                                    if (entityFieldsArray.hasOwnProperty(scope.items[i].groups[g].key)) {
                                        for (e = 0; e < entityFieldsArray[scope.items[i].groups[g].key].length; e = e + 1) {
                                            entityItem = entityFieldsArray[scope.items[i].groups[g].key][e];
                                            if (entityItem.id == scope.items[i].groups[g].value) {
                                                exist = true;
                                            }
                                        }
                                    }
                                    if (!exist) {
                                        //console.log('here???');
                                        promises.push(bindCellService.getByKey(scope.items[i].groups[g].key, scope.items[i].groups[g].value))

                                    }
                                }
                            }
                        }
                    }

                    Promise.all(promises).then(function (results) {
                        //console.log('RESULTS', results);
                        results.forEach(function (item) {
                            //console.log('-------------------------------', item);
                            if (item.key) {
                                if (entityFieldsArray[item.key] == undefined || !entityFieldsArray[item.key].length) {
                                    entityFieldsArray[item.key] = [];
                                }
                                entityFieldsArray[item.key].push(item.data);
                            }
                        });
                        setTimeout(function () {
                            scope.readyStatus.cellsReady = true;
                            scope.$apply();
                        }, 500)
                    });

                }

                scope.toggleSelectRow = function (item) {

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

                scope.checkReady = function () {
                    if (scope.readyStatus.cellsReady && scope.readyStatus.groupsReady) {
                        return true;
                    }
                    return false;
                };

                scope.$watchCollection('columns', function () {
                    scope.readyStatus.cellsReady = false;
                    getFieldDisplayNamesArray();
                });

                scope.$watchCollection('grouping', function () {
                    scope.readyStatus.groupsReady = false;
                    findGroups();
                });

                scope.bindGroupValue = function (group) {

                    //console.log('group', group);

                    if (group.value_type === 'classifier') {
                        if (scope.readyStatus.groupsReady) {
                            return classifiersInstances[scope.entityType]['id_' + group.value].name
                        }
                    }
                    if (group.value_type === 'field') {
                        if (!entityFieldsArray.hasOwnProperty(group.key)) {
                            scope.readyStatus.groupsReady = false;
                            console.log('_______________________________________________________________')
                            findGroups();
                        }

                        if (scope.readyStatus.groupsReady) {
                            //console.log('entityFieldsArray[group.key]', entityFieldsArray[group.key]);
                            var i, result;
                            for (i = 0; i < entityFieldsArray[group.key].length; i = i + 1) {
                                //console.log('111111111111111111111111111111111111111111111111111111111111111111111111111', entityFieldsArray[group.key][i]);
                                //console.log('111111111111111111111111111111111111111111111111111111111111111111111111111', group.value);
                                if (entityFieldsArray[group.key][i].id === group.value) {
                                    result = entityFieldsArray[group.key][i];
                                }
                            }

                            //console.log('result', result);
                            if (result) {
                                if (result.hasOwnProperty('display_name')) {
                                    return result.display_name;
                                }
                                return result.name;
                            }
                        }
                    }
                    return group.value;
                };

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
                                        if (groupedItem[entityAttrs[e].key].length == 1) {
                                            return 'linked with ' + groupedItem[entityAttrs[e].key].length + ' entity'
                                        } else {
                                            if (groupedItem[entityAttrs[e].key].length > 1) {
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
                    scope.itemAdditionsEditorEntityId = item.id;
                    //if (localStorage.getItem('entityIsChanged') === "true") { // wow such shitcode
                    //    $mdDialog.show({
                    //        controller: 'WarningDialogController as vm',
                    //        templateUrl: 'views/warning-dialog-view.html',
                    //        parent: angular.element(document.body),
                    //        targetEvent: ev,
                    //        clickOutsideToClose: true,
                    //        locals: {
                    //            warning: {
                    //                title: 'Warning',
                    //                description: 'Unsaved data will be lost'
                    //            }
                    //        }
                    //    }).then(function (res) {
                    //        if (res.status === 'agree') {
                    //            scope.itemAdditionsEditorEntityId = item.id;
                    //            localStorage.setItem('entityIsChanged', false);
                    //        }
                    //    });
                    //} else {
                    //    scope.itemAdditionsEditorEntityId = item.id;
                    //    //localStorage.setItem('entityIsChanged', false);
                    //}
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
                            entity: entity,
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

                //console.log('Table body component columns ', scope.columns);
            }
        }
    }


}());