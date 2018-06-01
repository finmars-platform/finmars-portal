/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var entityClassifierSingletonService = require('../../services/entityClassifierSingletonService');
    var bindCellService = require('../../services/bindCellService');
    var groupTableReportService = require('../../services/groupTable/groupTableReportService');
    var groupTableBodyHelper = require('../../helpers/groupTableBodyHelper');

    var evEvents = require('../../services/entityViewerEvents');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                items: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/table-body-view.html',
            link: function (scope, elem, attrs) {

                scope.grouping = scope.evDataService.getGroups();
                scope.columns = scope.evDataService.getColumns();
                scope.entityType = scope.evDataService.getEntityType();

                scope.reportIsReady = scope.options.reportIsReady;
                scope.isReport = ['balance-report',
                    'cash-flow-projection-report',
                    'performance-report', 'pnl-report',
                    'transaction-report'].indexOf(scope.entityType) !== -1;

                scope.pagination = scope.evDataService.getPagination();

                scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {
                    scope.columns = scope.evDataService.getColumns();
                });

                scope.evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {
                    scope.grouping = scope.evDataService.getGroups();
                });

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
                var promisesAttributeTypesAlreadyAdded = {};

                var entityFieldsArray = {};

                var classifiersInstances = {};

                baseAttrs = metaService.getBaseAttrs();

                if (scope.isReport == true) {

                    entityAttrs = metaService.getEntityAttrs(entityType);

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('instrument').map(function (item) {
                        item.key = 'instrument_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('instrument-type').map(function (item) {
                        item.key = 'instrument_type_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('account').map(function (item) {
                        item.key = 'account_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('account-type').map(function (item) {
                        item.key = 'account_type_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('portfolio').map(function (item) {
                        item.key = 'portfolio_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-1').map(function (item) {
                        item.key = 'strategy1_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-1-subgroup').map(function (item) {
                        item.key = 'strategy1_subgroup_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-1-group').map(function (item) {
                        item.key = 'strategy1_group_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-2').map(function (item) {
                        item.key = 'strategy2_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-2-subgroup').map(function (item) {
                        item.key = 'strategy2_subgroup_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-2-group').map(function (item) {
                        item.key = 'strategy2_group_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-3').map(function (item) {
                        item.key = 'strategy3_object_' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-3-subgroup').map(function (item) {
                        item.key = 'strategy3_subgroup_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs('strategy-3-group').map(function (item) {
                        item.key = 'strategy3_group_object' + item.key;
                        return item;
                    }));

                    entityAttrs = entityAttrs.concat(metaService.getEntityAttrs(entityType));

                    //console.log('entityAttrs', entityAttrs);

                } else {
                    entityAttrs = metaService.getEntityAttrs(entityType);
                }

                function getCellsCaptionsPatterns(item, itemIndex) {

                    var result = [];

                    item.cellsCaptions.forEach(function (cellCaption, $index) {
                        if ($index <= itemIndex) {
                            result.push(cellCaption.comparePattern);
                        }
                    });

                    return result.join('_-_');
                }

                scope.toggleGroupFold = function (item, $index) {

                    if (scope.isReport) {

                        item.cellsCaptions[$index].isFolded = !item.cellsCaptions[$index].isFolded;

                        item.subTotal = item.cellsCaptions[$index].subTotal;

                        var itemCellCaptionsPatterns = getCellsCaptionsPatterns(item, $index);

                        var localItems = []; // to find first element, and revert isFolded;

                        scope.reportItems.forEach(function (reportItem) {

                            var reportCellCaptionsPatterns = getCellsCaptionsPatterns(reportItem, $index);

                            if (itemCellCaptionsPatterns == reportCellCaptionsPatterns) {

                                reportItem.isFirstOfFolded = false;
                                reportItem.cellsCaptions[$index].isFolded = item.cellsCaptions[$index].isFolded;

                                localItems.push(reportItem);
                            }


                        });


                        //localItems[0].isFirstOfFolded = true;
                        localItems[0].isFirstOfFolded = item.cellsCaptions[$index].isFolded;

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

                scope.rightClickStatus = function () {
                    if (scope.entityType !== 'audit-transaction' && scope.entityType !== 'audit-instrument') {
                        return true
                    }
                    return false;
                };

                scope.checkReportColumnCaption = function (cellsCaptions, column, $columnIndex) {

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

                        if (scope.isReport == true) {

                            console.log('entityFieldsArray', entityFieldsArray);
                            //console.log('scope.columns[i]', scope.columns);

                        } else {

                            for (i = 0; i < scope.columns.length; i = i + 1) {
                                var attributeExist = false;
                                //console.log('12312312312312312', scope.columns[i]);
                                if (scope.columns[i]['value_type'] == 'field') {
                                    promises.push(bindCellService.findEntities(scope.columns[i].key, {entityType: entityType}));
                                }
                                if (scope.columns[i]['value_type'] == 30) {
                                    //console.log('scope.columns[i]', scope.columns[i]);

                                    if (!promisesAttributeTypesAlreadyAdded[entityType]) {
                                        promisesAttributeTypesAlreadyAdded[entityType] = [];
                                    }

                                    promisesAttributeTypesAlreadyAdded[entityType].forEach(function (attribute) {
                                        if (attribute == scope.columns[i].id) {
                                            attributeExist = true;
                                        }
                                    });

                                    if (!attributeExist) {
                                        promisesAttributeTypesAlreadyAdded[entityType].push(scope.columns[i].id);
                                        promises.push(attributeTypeService.getByKey(entityType, scope.columns[i].id));
                                    }

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

                            console.log('attributeTypesReady')

                            scope.readyStatus.attributeTypesReady = true;

                            resolve({status: 'attribute types ready'});

                        })

                    });

                };

                if (scope.grouping && scope.grouping.length) {
                    syncGroupsAndColumns();
                }

                function findGroupsClassifiers() {

                    return new Promise(function (resolve, reject) {

                        var i, g;
                        var promisesClassifiers = [];


                        var items = scope.items;
                        var classifierExist = false;
                        var entityExist = false;

                        //console.log('ITEMS', scope.items);

                        if (scope.items) {
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

                                    }
                                }

                            }
                        }

                        scope.readyStatus.classifiersReady = false;

                        Promise.all(promisesClassifiers).then(function (data) {

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

                            console.log('classifiersReady')

                            scope.readyStatus.classifiersReady = true;

                            resolve({status: "groups ready"});

                        })

                    })
                }

                function findGroupsEntities() {

                    return new Promise(function (resolve, reject) {


                        var i, g;
                        var promisesEntityFields = [];


                        var items = scope.items;
                        var entityExist = false;

                        //console.log('ITEMS', scope.items);

                        if (scope.items) {
                            for (i = 0; i < scope.items.length; i = i + 1) {
                                //console.log('scope.items[i].groups', scope.items[i].groups);
                                if (scope.items[i].hasOwnProperty('groups')) {
                                    for (g = 0; g < scope.items[i].groups.length; g = g + 1) {

                                        entityExist = false;

                                        if (scope.items[i].groups[g]['value_type'] === 'field') {

                                            if (scope.items[i].groups[g].value !== null) {

                                                promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                                    if (entity == scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value) {
                                                        entityExist = true;
                                                    }
                                                });

                                                if (!entityExist) {
                                                    promisesEntityFieldsAlreadyAdded.push(scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value);
                                                    promisesEntityFields.push(bindCellService.getByKey(scope.items[i].groups[g].key, scope.items[i].groups[g].value, {entityType: scope.entityType}))
                                                }
                                            }
                                        }
                                    }
                                }

                            }
                        }

                        scope.readyStatus.cellsFirstReady = false;

                        Promise.all(promisesEntityFields).then(function (data) {

                            if (data.length) {
                                var i;

                                //console.log('data1111111111111111111111111', data);

                                for (i = 0; i < data.length; i = i + 1) {

                                    if (entityFieldsArray[data[i].key] == undefined) {
                                        entityFieldsArray[data[i].key] = [];
                                    }
                                    entityFieldsArray[data[i].key].push(data[i].data);
                                }
                            }

                            scope.readyStatus.cellsFirstReady = true;
                            console.log('cells first ready');
                            resolve({status: "groups ready"});

                        })

                    })
                }

                scope.reportItemsProjection = function () {
                    return scope.reportItems;
                };

                scope.isSubtotalHided = function (column) {
                    if (column.hasOwnProperty('report_settings') && column.report_settings) {

                        //console.log('colum222222222222222n', column);
                        if (column.report_settings.subtotal_formula_id) {
                            if (column.report_settings.hide_subtotal == true) {
                                return false;
                            }
                            return true;
                        } else {
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

                    var promises = [];

                    promises.push(getFieldDisplayNamesArray());
                    promises.push(findGroupsClassifiers());
                    promises.push(findGroupsEntities());

                    console.log('promises', promises);

                    Promise.all(promises).then(function () {

                        console.log('All promises??');

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);
                        scope.$apply();

                    })
                }

                function findEntityFields() {

                    return new Promise(function (resolve, reject) {
                        var i, g, e;
                        var promises = [];

                        if (scope.items) {
                            for (i = 0; i < scope.items.length; i = i + 1) {

                                if (scope.items[i].hasOwnProperty('groups')) {
                                    for (g = 0; g < scope.items[i].groups.length; g = g + 1) {

                                        if (scope.items[i].groups[g]['value_type'] === 'field' && scope.items[i].groups[g].value !== null) {
                                            var entityExist = false;

                                            promisesEntityFieldsAlreadyAdded.forEach(function (entity) {
                                                if (entity == scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value) {
                                                    entityExist = true;
                                                }
                                            });

                                            if (!entityExist) {
                                                promisesEntityFieldsAlreadyAdded.push(scope.items[i].groups[g].key + '_' + scope.items[i].groups[g].value);
                                                promises.push(bindCellService.getByKey(scope.items[i].groups[g].key, scope.items[i].groups[g].value))
                                            }

                                        }
                                    }
                                }
                            }
                        }

                        scope.readyStatus.cellsSecondReady = false;

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
                            console.log('cellsSecondReady');

                            resolve({status: "entity field ready"});

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

                    if (item.simpleSelect === true) {
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

                    // if (scope.options.reportProcessing == true) {
                    //     return false;
                    // }

                    if (!scope.items) {
                        return true;
                    }

                    if (scope.readyStatus.cellsFirstReady &&
                        scope.readyStatus.cellsSecondReady &&
                        scope.readyStatus.classifiersReady &&
                        scope.evDataService.getStatusData() === 'loaded' &&
                        scope.readyStatus.attributeTypesReady) {

                        return true;
                    }

                    return false;
                };

                scope.bindGroupValue = function (group) {

                    //console.log('group', group);

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


                    //console.log('group', group);

                    if (group.value_type === 'field') {

                        if (group.hasOwnProperty(group.key + '_object') && group.value !== "") {
                            return group[group.key + '_object'].user_code;
                        }

                        //console.log('entityFieldsArray', entityFieldsArray);

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

                    if (group.value_type == 'float') {

                        result = '';
                        if (group.value) {
                            result = numberWithCommas(parseFloat(group.value).toFixed(2) + '');
                        }
                    }

                    if (group.value_type == '10'
                        || group.value_type == '40'
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

                            var format_round = 0;
                            var format_negative = 0;
                            var format_zero = 0;

                            if (column.report_settings.hasOwnProperty('round_format_id')) {
                                format_round = column.report_settings.round_format_id;
                            }

                            if (column.report_settings.hasOwnProperty('negative_format_id')) {
                                format_negative = column.report_settings.negative_format_id;
                            }

                            if (column.report_settings.hasOwnProperty('zero_format_id')) {
                                format_zero = column.report_settings.zero_format_id;
                            }


                            if (result == 0) {
                                return numberWithCommas(
                                    numberWithZeroFormat(result, format_zero, format_round)
                                );
                            } else {
                                return numberWithCommas(
                                    numberWihNegativeFormat(
                                        numberWithRoundFormat(result, format_round),
                                        format_negative
                                    ));
                            }


                        } else {
                            return result;
                        }
                    }

                };

                function numberWithCommas(number) {

                    //console.log('numberWithCommas number', number);

                    //return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
                    if (number) {
                        return number.toString().replace(/\B(?=(\d{3})+(?=\.))/g, "'");
                    }
                }

                function numberWithRoundFormat(number, formatId) {

                    //console.log('numberWithRoundFormat', formatId);

                    if (formatId == 0) {
                        return number;
                    }

                    if (formatId == 1) {
                        return parseFloat(number).toFixed(0);
                    }

                    if (formatId == 2) {
                        return parseFloat(number).toFixed(2);
                    }

                }

                function numberWihNegativeFormat(number, formatId) {


                    if (number < 0) {

                        if (formatId == 0) {
                            return number;
                        }

                        if (formatId == 1) {

                            number = number + '';

                            number = '(' + number.slice(1, number.length) + ')';

                            return number;
                        }


                    }

                    return number

                }

                function numberWithZeroFormat(number, formatId, roudingFormatId) {

                    if (formatId == 0) {
                        return numberWithRoundFormat(number, roudingFormatId)
                    }

                    if (formatId == 1) {
                        return '-'
                    }

                    if (formatId == 2) {
                        return '';
                    }

                }

                scope.bindCell = function (groupedItem, column, options) {

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

                    if (column.hasOwnProperty('id')) {
                        if (column['value_type'] === 30) {
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
                        } else {

                            if (column.hasOwnProperty('columnType') && column.columnType == 'custom-field') {

                                var result = '';

                                groupedItem.custom_fields.forEach(function (customField) {

                                    if (customField.custom_field == column.id) {
                                        result = customField.value;
                                    }

                                });

                                return result

                            } else {

                                if (groupedItem.hasOwnProperty(column.name)) {
                                    return groupedItem[column.name];
                                } else {
                                    return groupTableBodyHelper.findGroupedItemAttribute(groupedItem, column.id);
                                }
                            }
                        }
                    } else {

                        var c;

                        var format_round = 0;
                        var format_negative = 0;
                        var format_zero = 0;

                        for (c = 0; c < scope.columns.length; c = c + 1) {

                            if (scope.columns[c].key == column.key) {

                                if (column.value_type == 'float' || column.value_type == 20) {

                                    if (column.hasOwnProperty('report_settings')) {
                                        if (column.report_settings.hasOwnProperty('round_format_id')) {
                                            format_round = column.report_settings.round_format_id;
                                        }

                                        if (column.report_settings.hasOwnProperty('negative_format_id')) {
                                            format_negative = column.report_settings.negative_format_id;
                                        }

                                        if (column.report_settings.hasOwnProperty('zero_format_id')) {
                                            format_zero = column.report_settings.zero_format_id;
                                        }
                                    }

                                    //console.log('column', column);
                                    //console.log('format', format);

                                    if (groupedItem.hasOwnProperty(column.key)) {

                                        if (options && options.hasOwnProperty('reportItem')) {
                                            if (options.reportItem.isFirstOfFolded && options.reportItem.isFirstOfFolded == true) {
                                                //console.log(options);

                                                return numberWithCommas(
                                                    numberWihNegativeFormat(
                                                        numberWithRoundFormat(options.reportItem.subTotal[column.key], format_round),
                                                        format_negative
                                                    ));
                                            } else {
                                                return numberWithCommas(
                                                    numberWihNegativeFormat(
                                                        numberWithRoundFormat(groupedItem[column.key], format_round),
                                                        format_negative
                                                    ));
                                            }
                                        } else {

                                            return numberWithCommas(
                                                numberWihNegativeFormat(
                                                    numberWithRoundFormat(groupedItem[column.key], format_round),
                                                    format_negative
                                                ));


                                        }
                                    }
                                }

                                if (groupedItem.hasOwnProperty(column.key)) {

                                    if (options && options.hasOwnProperty('reportItem')) {
                                        if (options.reportItem.isFirstOfFolded && options.reportItem.isFirstOfFolded == true) {
                                            return '';
                                        }
                                    }
                                }

                                if (column.value_type == 10 || column.value_type == 40) {


                                    if (entityType == 'complex-transaction') {
                                        if (column.key == 'status') {
                                            if (groupedItem[column.key] == 1) {
                                                return 'Production';
                                            }
                                            if (groupedItem[column.key] == 2) {
                                                return 'Pending';
                                            }
                                        }
                                    }

                                    if (groupedItem.hasOwnProperty(column.key)) {
                                        return groupedItem[column.key];
                                    }
                                }

                                if (column.value_type == 'boolean') {
                                    if (groupedItem.hasOwnProperty(column.key)) {
                                        if (groupedItem[column.key] == 1) {
                                            return 'True'
                                        } else {
                                            return 'False'
                                        }
                                    }
                                }

                                if (column.value_type == 'mc_field') {


                                    if (column.key == 'object_permissions_user') {

                                        if (groupedItem[column.key].length) {

                                            //console.log('scope.options.permission_selected_entity', scope.options.permission_selected_entity);

                                            if (scope.options.permission_selected_entity == 'user') {

                                                var resultPermission = [];

                                                groupedItem[column.key].forEach(function (permission) {

                                                    if (permission.member == scope.options.permission_selected_id) {
                                                        if (permission.permission.indexOf('change') == 0) {
                                                            resultPermission.push('Change');
                                                        }
                                                        if (permission.permission.indexOf('manage') == 0) {
                                                            resultPermission.push('Manage');
                                                        }
                                                    }
                                                });

                                                return resultPermission.join(', ');

                                            }
                                        }
                                    }

                                    if (column.key == 'object_permissions_group') {

                                        if (scope.options.permission_selected_entity == 'group') {

                                            var resultPermission = [];

                                            groupedItem[column.key].forEach(function (permission) {
                                                if (permission.group == scope.options.permission_selected_id) {
                                                    if (permission.permission.indexOf('change') == 0) {
                                                        resultPermission.push('Change');
                                                    }
                                                    if (permission.permission.indexOf('manage') == 0) {
                                                        resultPermission.push('Manage');
                                                    }
                                                }
                                            });

                                            return resultPermission.join(', ');
                                        }
                                    }


                                    return scope.bindCellTitle(groupedItem, column);
                                }

                                if (groupedItem[column.key + '_object']) {

                                    if (column.key == 'instrument_type_object_instrument_class') {
                                        return groupedItem[column.key + '_object'].name;
                                    } else {
                                        if (groupedItem[column.key + '_object'].user_code) {
                                            return groupedItem[column.key + '_object'].user_code;
                                        } else {
                                            return groupedItem[column.key + '_object'].name;
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

                    console.log('rowCallback', item);

                    scope.evDataService.setEditorEntityId(item.id);
                    var itemHasSimpleSelect = false;
                    if (item.simpleSelect) {
                        itemHasSimpleSelect = JSON.parse(JSON.stringify(item.simpleSelect));
                    }

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
                        scope.evDataService.setEditorEntityId(null);
                    }

                    if (!scope.options.isReport) {

                        scope.evEventService.dispatchEvent(evEvents.ADDITIONS_EDITOR_ENTITY_ID_CHANGE);
                        // scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
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
                            entity: entity,
                            entityType: scope.entityType
                        }
                    }).then(function (res) {
                        if (res.status === 'agree') {
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
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
                            entityType: scope.entityType,
                            entityId: entity.id
                        }
                    }).then(function (res) {
                        if (res && res.res === 'agree') {
                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                        }
                    });
                };

                scope.changePage = function (page) {

                    scope.pagination = Object.assign({}, scope.pagination, {current_page: page});

                    scope.evDataService.setPagination(scope.pagination);
                    scope.evEventService.dispatchEvent(evEvents.PAGE_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                };


                scope.evEventService.addEventListener(evEvents.REDRAW_TABLE, function () {

                    syncGroupsAndColumns();

                });

                scope.triggerResizeColumns = function () {

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_COLUMNS_SIZE);

                }


                // scope.$watchCollection('options.lastUpdate', function () {
                //
                //     scope.externalCallback = scope.options.externalCallback;
                //     scope.grouping = scope.options.grouping;
                //     scope.columns = scope.options.columns;
                //     scope.entityType = scope.options.entityType;
                //     scope.reportIsReady = scope.options.reportIsReady;
                //     scope.isReport = scope.options.isReport;
                //
                //     syncGroupsAndColumns();
                //
                //     if (scope.isReport == true && scope.items) {
                //         //console.log('scope.reportItems', scope.reportItems);
                //
                //         scope.reportItems = groupTableReportService.transformItems(scope.items);
                //     }
                // });


            }
        }
    }


}());