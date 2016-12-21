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
    var groupTableReportService = require('../../services/groupTable/groupTableReportService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                items: '='
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupTableBody', 'initialized', 1);

                scope.externalCallback = scope.options.externalCallback;
                scope.grouping = scope.options.grouping;
                scope.columns = scope.options.columns;
                scope.entityType = scope.options.entityType;
                scope.reportIsReady = scope.options.reportIsReady;
                scope.isReport = scope.options.isReport;

                scope.readyStatus = {
                    cellsFirstReady: false,
                    cellsSecondReady: false,
                    attributeTypesReady: false,
                    classifiersReady: false
                }; // if groups not exist

                var entityType = scope.entityType;
                var baseAttrs = [];
                var entityAttrs = [];

                var promisesClassifiersAlreadyAdded = [];
                var promisesEntityFieldsAlreadyAdded = [];
                var promisesAttributeTypesAlreadyAdded = [];

                var entityFieldsArray = {};

                var classifiersInstances = {};

                baseAttrs = metaService.getBaseAttrs();
                entityAttrs = metaService.getEntityAttrs(entityType);

                setTimeout(function () {
                    $('.g-table-section .custom-scrollbar')[0].dispatchEvent(new Event('scroll'));
                }, 1000);

                function getCellsCaptionsPatterns(item, itemIndex) {

                    var result = [];

                    //console.log('item.cellsCaptions', item.cellsCaptions);

                    item.cellsCaptions.forEach(function (cellCaption, $index) {
                        if ($index <= itemIndex) {
                            result.push(cellCaption.comparePattern);
                        }
                    });

                    return result.join('_-_');
                }

                scope.toggleGroupFold = function (item, $index) {
                    //console.log('item.isFolded', item.isFolded);
                    if (scope.isReport) {

                        //console.log('ITEM', item);

                        item.cellsCaptions[$index].isFolded = !item.cellsCaptions[$index].isFolded;

                        var itemCellCaptionsPatterns = getCellsCaptionsPatterns(item, $index);

                        var localItems = []; // to find first element, and revert isFolded;

                        //console.log('$index', $index);
                        //console.log('itemCellCaptionsPatterns', itemCellCaptionsPatterns);

                        scope.reportItems.forEach(function (reportItem) {

                            var reportCellCaptionsPatterns = getCellsCaptionsPatterns(reportItem, $index);

                            //console.log('reportItem', reportItem);
                            //console.log('reportCellCaptionsPatterns', reportCellCaptionsPatterns);

                            if (itemCellCaptionsPatterns == reportCellCaptionsPatterns) {

                                reportItem.isFirstOfFolded = false;
                                reportItem.cellsCaptions[$index].isFolded = item.cellsCaptions[$index].isFolded;

                                localItems.push(reportItem);
                            }


                        });


                        localItems[0].isFirstOfFolded = true;

                        localItems.forEach(function (locItem) {

                            locItem.cellsCaptions.forEach(function (cellCaption, cellCaptionIndex) {

                                if (cellCaptionIndex > $index) {
                                    cellCaption.isFolded = false;
                                }

                            })


                        });

                        //console.log('localItems', localItems);

                    } else {
                        item.isFolded = !item.isFolded;
                    }
                };

                scope.itemIsFolded = function (item) {

                    var isShowed = true;

                    //console.log('item', item);
                    if (item.hasOwnProperty('cellsCaptions')) {
                        if (item.isFirstOfFolded != true) {
                            item.cellsCaptions.forEach(function (cellCaption) {

                                if (cellCaption.hasOwnProperty('isFolded') && cellCaption.isFolded == true) {
                                    isShowed = false;
                                }

                            });
                        }
                    }


                    return isShowed;

                };

                scope.openEntityMenu = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };


                scope.checkReportColumnCaption = function (cellsCaptions, column, $columnIndex) {

                    //console.log('$columnIndex', $columnIndex);
                    //console.log('$columnIndex', $columnIndex);

                    if ($columnIndex > cellsCaptions.length - 1) { // 1 - index
                        return false;
                    }

                    // todo cellCaptions[columnIndex] == column

                    return true;

                };

                var getFieldDisplayNamesArray = function () {
                    return new Promise(function (resolve, reject) {
                        var i;
                        var promises = [];

                        for (i = 0; i < scope.columns.length; i = i + 1) {
                            var attributeExist = false;
                            //console.log('12312312312312312', scope.columns[i]);
                            if (scope.columns[i]['value_type'] == 'field') {
                                promises.push(bindCellService.findEntities(scope.columns[i].key, {entityType: entityType}));
                            }
                            if (scope.columns[i]['value_type'] == 30) {
                                //console.log('scope.columns[i]', scope.columns[i]);

                                promisesAttributeTypesAlreadyAdded.forEach(function (attribute) {
                                    if (attribute == scope.columns[i].id) {
                                        attributeExist = true;
                                    }
                                });

                                if (!attributeExist) {
                                    promisesAttributeTypesAlreadyAdded.push(scope.columns[i].id);
                                    promises.push(attributeTypeService.getByKey(entityType, scope.columns[i].id));
                                }

                            }
                        }

                        findEntityFields();

                        Promise.all(promises).then(function (results) {
                            //console.log('results11111111111111111', results);
                            results.forEach(function (item) {
                                if (item.key) {

                                    entityFieldsArray[item.key] = item.data;
                                } else {
                                    entityFieldsArray['classifier_' + item.id] = item;
                                }
                            });

                            //console.log('entityFieldsArray', entityFieldsArray);

                            scope.readyStatus.attributeTypesReady = true;

                            //console.log('attribute types ready');


                            //findEntityFields().then(function () {
                            //    resolve({status: "columns ready"});
                            //});

                        }).then(function () {
                            scope.$apply();
                        })

                    });
                    //console.log('entityFieldsArray', entityFieldsArray);
                };

                if (scope.grouping && scope.grouping.length) {
                    syncGroupsAndColumns();
                }

                if (scope.isReport == true) {

                    scope.$watch('items', function () {
                        scope.reportItems = groupTableReportService.transformItems(scope.items);
                    });
                }

                function findGroups() {

                    return new Promise(function (resolve, reject) {

                        var i, g;
                        var promisesClassifiers = [];
                        var promisesEntityFields = [];


                        var items = scope.items;
                        var classifierExist = false;
                        var entityExist = false;

                        //console.log('ITEMS', items);

                        for (i = 0; i < scope.items.length; i = i + 1) {
                            //console.log('scope.items[i].groups', scope.items[i].groups);
                            if (scope.items[i].hasOwnProperty('groups')) {
                                for (g = 0; g < scope.items[i].groups.length; g = g + 1) {
                                    classifierExist = false;
                                    entityExist = false;
                                    //console.log("scope.items[i].groups[g]['value_type']", scope.items[i].groups[g]['value_type']);
                                    if (scope.items[i].groups[g]['value_type'] === 'classifier') {


                                        promisesClassifiersAlreadyAdded.forEach(function (classifier) {
                                            if (classifier == scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value) {
                                                classifierExist = true;
                                            }
                                        });
                                        if (!classifierExist) {
                                            promisesClassifiersAlreadyAdded.push(scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value);
                                            promisesClassifiers.push(entityClassifierSingletonService.getByKey(scope.entityType, scope.items[i].groups[g].value))
                                        }
                                    }
                                    if (scope.items[i].groups[g]['value_type'] === 'field') {
                                        //console.log('scope.items[i].groups[g].value', scope.items[i].groups[g].value);
                                        //console.log('scope.items[i].groups[g].value', scope.items[i].groups[g]);

                                        if (scope.items[i].groups[g].value !== null) {

                                            promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                                if (entity == scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value) {
                                                    entityExist = true;
                                                }
                                            });
                                            //console.log('promisesEntityFieldsAlreadyAdded', promisesEntityFieldsAlreadyAdded);

                                            if (!entityExist) {
                                                promisesEntityFieldsAlreadyAdded.push(scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value);
                                                promisesEntityFields.push(bindCellService.getByKey(scope.items[i].groups[g].key, scope.items[i].groups[g].value, {entityType: scope.entityType}))
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        //console.log('promisesClassifiers', promisesClassifiers);

                        Promise.all(promisesClassifiers).then(function (data) {

                            //console.log('test----------------------------------------', data);

                            if (data.length) {
                                var i;
                                for (i = 0; i < data.length; i = i + 1) {
                                    if (classifiersInstances[data[i].key] === undefined) {
                                        classifiersInstances[data[i].key] = {};
                                    }
                                    if (data[i].data !== undefined) {
                                        classifiersInstances[data[i].key] = data[i].data
                                    }
                                }
                            }

                            //console.log('promisesEntityFields', promisesEntityFields);

                            scope.readyStatus.classifiersReady = true;

                            //console.log('classifiers ready');
                        }).then(function () {
                            scope.$apply();
                        });

                        Promise.all(promisesEntityFields).then(function (data) {

                            if (data.length) {
                                var i;

                                console.log('data', data);

                                for (i = 0; i < data.length; i = i + 1) {

                                    if (entityFieldsArray[data[i].key] == undefined) {
                                        entityFieldsArray[data[i].key] = [];
                                    }
                                    entityFieldsArray[data[i].key].push(data[i].data);
                                }
                            }

                            scope.readyStatus.cellsFirstReady = true;
                            //console.log('cells first ready');
                            resolve({status: "groups ready"});


                        }).then(function () {
                            scope.$apply();
                        })

                    })
                }

                scope.reportItemsProjection = function () {
                    //console.log('scope.reportItems', scope.reportItems);
                    return scope.reportItems;
                };

                scope.isSubtotalHided = function (column) {
                    if (column.hasOwnProperty('report_settings') && column.report_settings) {
                        if (column.report_settings.hide_subtotal == true) {
                            return false;
                        }
                    }

                    return true;
                };


                scope.resolveReportCellItemBackground = function (rowType, item, column, $index) {
                    var result = '';

                    //console.log('item', item);

                    if (item.hasOwnProperty('value_options')) {

                        if (item.value_options.type == 'area') {
                            result = 'cell-area-bg-' + item.value_options.level;
                        }

                        if (rowType == 'subtotal-line') {

                            if (item.value_options.type == 'line') {
                                result = 'cell-line-bg-' + item.value_options.level;
                            }
                        }

                    }

                    return result;
                };

                scope.resolveReportCellBackground = function (rowType, item, column, $index) {

                    if ($index == 1) {
                        //console.log(rowType, item, column, $index);
                    }

                    var result = '';


                    if (item.hasOwnProperty('cellsCaptions')) {

                        var cellCaption = item.cellsCaptions[$index];

                        if (cellCaption && cellCaption.hasOwnProperty('level') && cellCaption.hasOwnProperty('type')) {

                            if (cellCaption.type !== 'empty') {
                                if (cellCaption.type == 'area') {
                                    result = 'cell-area-bg-' + cellCaption.level;
                                }

                                if (rowType == 'subtotal-line') {

                                    //console.log('item', item);

                                    if (cellCaption.type == 'line') {
                                        result = 'cell-line-bg-' + cellCaption.level;
                                    }
                                }
                            }
                        }
                    }

                    return result;

                };

                scope.resolveReportCellBorder = function (rowType, item, column, $index) {

                    var result = '';

                    //console.log('item', item);

                    if (rowType == 'subtotal') {

                        if ($index < item.cellsCaptions.length) {
                            if (item.cellsCaptions[$index] == 'Subtotal') {
                                result = 'r-c-border-left-border-bottom';
                            }

                            if (item.cellsCaptions[$index + 1] == 'Subtotal') {
                                result = 'r-c-border-left-border-right'
                            }

                            if (item.cellsCaptions[$index - 1] == 'Subtotal') {
                                result = 'r-c-border-right-border-bottom-border-top';
                            }

                            if ($index == 0) {
                                result = 'r-c-border-left-border-right'
                            }

                        } else {
                            result = 'r-c-border-right-border-bottom-border-top';
                        }

                    }

                    if (rowType == 'normal') {

                        result = 'r-c-border-right-border-bottom-border-top';

                        if ($index < item.cellsCaptions.length) {
                            result = 'r-c-border-left-border-right'
                        }

                        if ($index == 0) {
                            result = 'r-c-border-left-border-right'
                        }


                    }

                    if (rowType == 'header') {

                        result = 'r-c-border-right-border-bottom-border-top';

                        if ($index < item.cellsCaptions.length) {
                            result = 'r-c-border-left-border-right'
                        }
                        if ($index == 0) {
                            result = 'r-c-border-left-border-right'
                        }

                    }

                    return result;

                };


                function syncGroupsAndColumns() {

                    //console.log("scope.grouping!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!", scope.grouping);

                    var promises = [];

                    promises.push(getFieldDisplayNamesArray());
                    promises.push(findGroups());

                    //console.log('??????????????????', promises);

                    Promise.all(promises).then(function () {
                        scope.$apply();
                    })
                }

                function findEntityFields() {

                    return new Promise(function (resolve, reject) {
                        var i, g, e;
                        var promises = [];

                        for (i = 0; i < scope.items.length; i = i + 1) {

                            //console.log('scope.items[i]', scope.items[i]);

                            if (scope.items[i].hasOwnProperty('groups')) {
                                for (g = 0; g < scope.items[i].groups.length; g = g + 1) {

                                    if (scope.items[i].groups[g]['value_type'] === 'field' && scope.items[i].groups[g].value !== null) {
                                        var entityExist = false;

                                        promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                            if (entity == scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value) {
                                                entityExist = true;
                                            }
                                        });

                                        //console.log('promisesEntityFieldsAlreadyAdded', promisesEntityFieldsAlreadyAdded);
                                        //console.log('scope.items[i].groups[g]', scope.items[i].groups[g]);
                                        if (!entityExist) {
                                            promisesEntityFieldsAlreadyAdded.push(scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value);
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
                                    if (entityFieldsArray[item.key] == undefined) {
                                        entityFieldsArray[item.key] = [];
                                    }
                                    if (item.data !== undefined) {
                                        entityFieldsArray[item.key].push(item.data);
                                    }
                                }
                            });

                            scope.readyStatus.cellsSecondReady = true;

                            //console.log('cells second ready');

                            resolve({status: "entity field ready"});

                        }).then(function () {
                            scope.$apply();
                        })
                    })

                }

                scope.checkRowSelection = function (item) {
                    //console.log('checkRowSelection', item);

                    if (item) {
                        if (item.selectedRow || item.simpleSelect) {
                            return true;
                        }
                    }
                    return false;
                };

                scope.toggleSelectRow = function ($event, item) {

                    if (item.simpleSelect == true) {
                        item.simpleSelect = false;
                    }
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
                    $event.stopPropagation();
                };

                scope.checkReady = function () {

                    //console.log('scope.options.reportIsReady', scope.options.reportIsReady);

                    if (scope.readyStatus.cellsFirstReady == true &&
                        scope.readyStatus.cellsSecondReady == true &&
                        scope.readyStatus.classifiersReady == true &&
                            //scope.reportIsReady == true &&
                        scope.options.reportIsReady == true &&
                        scope.readyStatus.attributeTypesReady == true) {

                        scope.$parent.triggerResize();

                        return true;
                    }
                    return false;
                };

                scope.$watchCollection('columns', function () {
                    syncGroupsAndColumns();

                    //console.log('scope.isReport', scope.isReport);

                    if (scope.isReport == true) {
                        scope.reportItems = groupTableReportService.transformItems(scope.items);
                    }
                });

                scope.$watchCollection('grouping', function () {
                    syncGroupsAndColumns();

                    if (scope.isReport == true) {
                        scope.reportItems = groupTableReportService.transformItems(scope.items);
                    }
                });

                scope.bindGroupValue = function (group) {

                    //console.log('group', group);
                    //console.log('entityFieldsArray', entityFieldsArray);

                    if (group.hasOwnProperty('r_entityType')) {
                        return group[group.r_entityType + '_attribute_' + group.source_name];
                    }

                    var result = '';

                    if (group.value_type === 'classifier') {
                        if (scope.readyStatus.cellsFirstReady) {
                            //console.log('classifiersInstances', classifiersInstances);
                            if (classifiersInstances.hasOwnProperty(scope.entityType + '_' + group.value) && classifiersInstances[scope.entityType + '_' + group.value] !== undefined) {
                                //console.log('11111111111111111111111111111111', classifiersInstances[scope.entityType]);
                                if (classifiersInstances[scope.entityType + '_' + group.value] && classifiersInstances[scope.entityType + '_' + group.value] !== undefined) {
                                    result = classifiersInstances[scope.entityType + '_' + group.value].name
                                }
                            }
                        }
                    }
                    if (group.value_type === 'field') {
                        if (!entityFieldsArray.hasOwnProperty(group.key)) {
                            //findGroups();
                        }

                        //console.log('entityFieldsArray', entityFieldsArray.portfolio);

                        if (scope.readyStatus.cellsFirstReady == true) {

                            if (entityFieldsArray.hasOwnProperty(group.key) &&
                                entityFieldsArray[group.key] &&
                                entityFieldsArray[group.key] !== undefined &&
                                entityFieldsArray[group.key].length) {

                                var i, resultObject;
                                for (i = 0; i < entityFieldsArray[group.key].length; i = i + 1) {

                                    if (group.value !== undefined) {
                                        if (entityFieldsArray[group.key][i].id === group.value) {

                                            resultObject = entityFieldsArray[group.key][i];
                                            //console.log('result', resultObject, '++' + entityFieldsArray[group.key][i].id);
                                        }
                                    }

                                }


                                if (resultObject) {
                                    if (result.hasOwnProperty('display_name')) {
                                        result = resultObject.display_name;
                                    } else {
                                        if (result.hasOwnProperty('scheme_name')) {
                                            result = resultObject.scheme_name;
                                        } else {
                                            result = resultObject.name;
                                        }
                                    }

                                }
                            }
                        }
                    }

                    if (group.value_type == '10'
                        || group.value_type == '40'
                        || group.value_type == 'float'
                        || group.value_type == 'string'
                        || group.value_type == 'date'
                        || group.value_type == 'value_string'
                        || group.value_type == 'value_float'
                        || group.value_type == 'value_date'
                    ) {
                        result = group.value;
                    }

                    //console.log('result string', result);

                    return result;
                };

                scope.bindCellSubTotal = function (values, column) {

                    //console.log(column);

                    var result = '';

                    if (column.hasOwnProperty('key')) {
                        result = values[column.key];
                    }

                    if (result !== undefined) {

                        if (column.value_type == 20 || column.value_type == 'float') {
                            return result.toFixed(2) + '';
                        } else {
                            return result;
                        }
                    }

                };

                scope.bindCell = function (groupedItem, column) {

                    //console.log('groupedItem', groupedItem);


                    if (column.hasOwnProperty('r_entityType')) {

                        return groupedItem[column.r_entityType + '_attribute_' + column.source_name];

                    }

                    function findNodeInChildren(item) {
                        if (groupedItem[column.name] == item.id) {
                            classifierNode = item;
                        } else {
                            if (item.children.length) {
                                item.children.forEach(findNodeInChildren);
                            }
                        }
                    }

                    //console.log('column value_type', column, column['value_type']);
                    if (column.hasOwnProperty('id')) {
                        if (column['value_type'] === 30) {
                            //if (scope.readyStatus.cellsFirstReady == true) {
                            var classifierNode;
                            if (entityFieldsArray && entityFieldsArray['classifier_' + column.id]) {
                                entityFieldsArray['classifier_' + column.id].classifiers.forEach(findNodeInChildren);
                                if (classifierNode) {
                                    if (classifierNode['display_name']) {
                                        return classifierNode['display_name'];
                                    }
                                    return classifierNode['name'];
                                }
                            }
                            return '';
                            //} else {
                            //    return '<div class="zh-loader"></div>';
                            //}
                        } else {

                            if (column.hasOwnProperty('columnType') && column.columnType == 'custom-field') {

                                result = '';

                                console.log('groupedItem', groupedItem);

                                groupedItem.custom_fields.forEach(function (customField) {

                                    if (customField.custom_field == column.id) {
                                        result = customField.value;
                                    }

                                });

                                return result

                            } else {
                                return groupedItem[column.name];
                            }
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
                                    //if (scope.readyStatus.cellsFirstReady) {
                                    //console.log('entityFieldsArray', entityFieldsArray);
                                    if (entityFieldsArray[column.key]) {
                                        var result = entityFieldsArray[column.key].filter(function (item) {
                                            return item.id === _groupedItemVal;
                                        })[0];

                                    }
                                    if (result) {
                                        if (column['key'] === 'instrument' && result['user_code']) {
                                            return result['user_code'];
                                        } else if (column['key'] === 'price_download_scheme') {
                                            return result['scheme_name'];
                                        }
                                        else if (result['display_name']) {
                                            return result['display_name'];
                                        }
                                        return result['name'];
                                    }
                                    return '';
                                    //} else {
                                    //    return '<div class="zh-loader"></div>';
                                    //}
                                } else {
                                    // if (column['value_type'] === 'mc_field') {
                                    //     if (groupedItem[entityAttrs[e].key].length == 1) {
                                    //         return 'linked with ' + groupedItem[entityAttrs[e].key].length + ' entity'
                                    //     } else {
                                    //         if (groupedItem[entityAttrs[e].key].length > 1) {
                                    //             return 'linked with ' + groupedItem[entityAttrs[e].key].length + ' entities'
                                    //         }
                                    //     }
                                    // } else {
                                    //     return groupedItem[entityAttrs[e].key];
                                    // }
                                    if (column['value_type'] === 'mc_field') {
                                        if (groupedItem[entityAttrs[e].key] && groupedItem[entityAttrs[e].key].length >= 1) {
                                            return '[' + groupedItem[entityAttrs[e].key].length + ']'
                                        }
                                    } else {

                                        if (groupedItem[entityAttrs[e].key] !== null) {

                                            if (column.value_type == 20 || column.value_type == 'float') {
                                                return groupedItem[entityAttrs[e].key].toFixed(2) + '';
                                            } else {
                                                return groupedItem[entityAttrs[e].key];
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                };

                scope.bindCellTitle = function (item, column) {

                    var result = '';

                    if (item && item.hasOwnProperty(column.key)) {
                        if (column['value_type'] === 'mc_field') {
                            result = '[' + item[column.key].length + ']';
                        }
                        else {
                            result = item[column.key];
                        }
                    }

                    return result;
                };

                scope.rowCallback = function (item, ev) {
                    //console.log('open additions!', item);
                    scope.options.editorEntityId = item.id;
                    var itemHasSimpleSelect = false;
                    if (item.simpleSelect) {
                        itemHasSimpleSelect = JSON.parse(JSON.stringify(item.simpleSelect));
                    }

                    //console.log('scope.itemAdditionsEditorEntityId', itemHasSimpleSelect);

                    scope.items.forEach(function (item) {
                        if (item.hasOwnProperty('groups')) {
                            item.simpleSelect = false;
                            item.items.forEach(function (row) {
                                row.simpleSelect = false;
                            })
                        } else {
                            item.simpleSelect = false;
                        }
                    });

                    item.simpleSelect = !item.simpleSelect;

                    if (itemHasSimpleSelect == true) {
                        item.simpleSelect = false;
                        scope.options.editorEntityId = undefined;
                    }

                    scope.externalCallback({silent: true, redraw: false, options: {editorEntityId: scope.options.editorEntityId}});

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
                        if (res && res.res === 'agree') {
                            scope.externalCallback();
                        }
                    });
                };

                scope.changePage = function (page) {
                    scope.paginationPageCurrent = page;
                    setTimeout(function () {
                        scope.externalCallback(); // do update table after angular digest refresh scope.paginationPageCurrent
                    }, 0)
                }
            }
        }
    }


}());