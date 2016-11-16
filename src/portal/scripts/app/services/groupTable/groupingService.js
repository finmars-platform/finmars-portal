/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    var metaService = require('../metaService');

    'use strict';

    function returnValue(attribute) {

        if (attribute['attribute_type_object'].value_type == 30) {
            return attribute['classifier']
        } else {
            if (attribute['attribute_type_object'].value_type == 40) {
                return attribute['value_date'];
            } else {
                if (attribute['attribute_type_object'].value_type == 20) {
                    return attribute['value_float'];
                } else {
                    if (attribute['attribute_type_object'].value_type == 10 && attribute['value_string'] !== '') {
                        return attribute['value_string'];
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    function returnValueType(attribute) {

        if (attribute['attribute_type_object'].value_type == 30) {
            return 'classifier'
        } else {
            if (attribute['attribute_type_object'].value_type == 40) {
                return 'value_date';
            } else {
                if (attribute['attribute_type_object'].value_type == 20) {
                    return 'value_float';
                } else {
                    if (attribute['attribute_type_object'].value_type == 10) {
                        return 'value_string';
                    } else {
                        return null;
                    }
                }
            }
        }
    }

    var transformToArray = function (groupedObject) {

        //console.log('groupedObject', groupedObject);
        var items = [];
        var i;
        var keys = Object.keys(groupedObject);
        for (i = 0; i < keys.length; i = i + 1) {
            items.push(groupedObject[keys[i]]);
        }
        //console.log('grooouping', items);
        return items;
    };

    var setGroups = function (items, groups, entityType) {

        //console.log('GROUPING SERVICE groups', groups);

        //console.log("items", items);

        var itemsGrouped = [];
        var itemsGroupedArray = [];
        var i, c, a, k;

        var baseAttrs = [];
        var entityAttrs = [];
        if (metaService) {
            if (metaService.getEntitiesWithoutBaseAttrsList().indexOf(entityType) === -1) {
                baseAttrs = metaService.getBaseAttrs();
            }
            entityAttrs = metaService.getEntityAttrs(entityType);
        }
        var keywords = [];
        keywords = keywords.concat(baseAttrs);
        keywords = keywords.concat(entityAttrs);


        var hasGroups = true;
        var groupName = '';
        var groupsForResult = [];

        function checkEntityForGroupExist(item, groups) {
            return true;
            var g, a;
            for (g = 0; g < groups.length; g = g + 1) {
                for (a = 0; a < item.attributes.length; i = i + 1) {
                    if (groups.id === item.attributes['attribute_type']
                        || groups.name === item.attributes['attribute_name']) {
                        return true;
                    }
                }
            }
            return false;
        }


        function checkIfEmptyString(item) {
            if (item == '') {
                return null
            }
            return item;
        }

        function findGroupsForResult(group, item, attribute) {

            var resGroupItem;
            if (group.hasOwnProperty('id')) {
                //console.log('group', group);
                //console.log('attribute[k]', attribute);
                if (group.id === attribute['attribute_type']) {
                    if (returnValue(attribute) !== null) {
                        resGroupItem = {
                            comparePattern: '&[' + attribute['attribute_type'] + '}-{' + returnValue(attribute) + ']',
                            key: attribute['attribute_name'].replace(' ', '_'),
                            value: returnValue(attribute),
                            value_type: returnValueType(attribute)
                        };

                        if (group.hasOwnProperty('report_settings')) {
                            resGroupItem.report_settings = group.report_settings;
                        }


                        groupsForResult.push(resGroupItem);
                    }
                }
            } else {
                //console.log('keywords', keywords);
                for (k = 0; k < keywords.length; k = k + 1) {
                    var n, nExist = false;
                    if (group.key === keywords[k].key) {

                        //console.log('groupsForResult', groupsForResult);
                        for (n = 0; n < groupsForResult.length; n = n + 1) {
                            //console.log('groupsForResult[n]', groupsForResult[n]);
                            if (groupsForResult[n].comparePattern.indexOf('&[' + keywords[k].key + '}-{' + checkIfEmptyString(item[keywords[k].key]) + ']') !== -1) {
                                nExist = true;
                            }
                        }
                        if (!nExist) {

                            resGroupItem = {
                                comparePattern: '&[' + keywords[k].key + '}-{' + checkIfEmptyString(item[keywords[k].key]) + ']',
                                key: keywords[k].key.replace(' ', '_'),
                                value: checkIfEmptyString(item[keywords[k].key]),
                                value_type: keywords[k].value_type
                            };

                            if (group.hasOwnProperty('report_settings')) {
                                resGroupItem.report_settings = group.report_settings;
                            }

                            groupsForResult.push(resGroupItem);
                        }
                    }
                }
            }
        }

        if (groups.length) {
            var group, item;
            for (i = 0; i < items.length; i = i + 1) {
                item = items[i];
                groupsForResult = [];
                groupName = ''; // create groupName of each item
                //console.log('groups111111111111111111111111', groups);
                for (c = 0; c < groups.length; c = c + 1) {
                    //console.log('items[i]', items[i]);
                    group = groups[c];
                    if (group.hasOwnProperty('key')) {
                        findGroupsForResult(group, item);
                        var keys = Object.keys(items[i]);
                        for (a = 0; a < keys.length; a = a + 1) {
                            if (groupName.indexOf('&[' + checkIfEmptyString(group.key) + '}-{' + checkIfEmptyString(item[group.key]) + ']') === -1) {
                                groupName = groupName + '&[' + checkIfEmptyString(group.key) + '}-{' + checkIfEmptyString(item[group.key]) + ']';
                            }
                        }
                    } else {
                        if (item.hasOwnProperty('attributes')) {
                            //console.log('item.attributes', item.attributes);
                            for (a = 0; a < item.attributes.length; a = a + 1) {
                                findGroupsForResult(group, item, item['attributes'][a]);
                                if (item[group.name] !== null) {
                                    if (groupName.indexOf('&[' + checkIfEmptyString(group.name) + '}-{' + checkIfEmptyString(item[group.name]) + ']') === -1) {
                                        groupName = groupName + '&[' + checkIfEmptyString(group.name) + '}-{' + checkIfEmptyString(item[group.name]) + ']';
                                    }
                                }
                            }
                        }
                    }

                }
                //console.log('groupName', groupName);

                if (!itemsGrouped[groupName]) {
                    itemsGrouped[groupName] = {
                        groups: groupsForResult,
                        items: []
                    }
                }
                itemsGrouped[groupName].items.push(item);
                //console.log('itemsGrouped[groupName]', itemsGrouped[groupName]);
                //console.log('itemsGrouped', itemsGrouped);
                itemsGroupedArray = transformToArray(itemsGrouped);
            }

            //console.log('------------------------');

            //console.log('Items grouped', itemsGroupedArray);

            itemsGroupedArray.forEach(function (group) {
                calcColumnSubTotal(group);
            });


            return itemsGroupedArray;
        } else {
            //console.log('items', items);
            return items;
        }
    };

    function isInt(value) {
        if (isNaN(value)) {
            return false;
        }
        var x = parseFloat(value);
        return (x | 0) === x;
    }

    function calcColumnSubTotal(group) {

        var calculatedColumns = {};

        group.items.forEach(function (groupedItem) {

            var keys = Object.keys(groupedItem);


            keys.forEach(function (groupedItemKey) {

                if (isInt(groupedItem[groupedItemKey]) && groupedItemKey !== 'id') {
                    if (!calculatedColumns[groupedItemKey]) {
                        calculatedColumns[groupedItemKey] = 0;
                    }

                    calculatedColumns[groupedItemKey] = calculatedColumns[groupedItemKey] + parseFloat(groupedItem[groupedItemKey]);

                }

            });


        });


        group.subTotal = calculatedColumns;
    }

    function isAdded(needle, stack, property) {

        var exist = false;

        stack.forEach(function (item) {
            if (item[property] == needle[property]) {
                exist = true;
            }
        });

        return exist;
    }

    var setGroupsWithColumns = function (items, groups, columns, entityType) {

        var preInitGroups = [];
        var initLineGroup = [];
        var bootsGroup = [];
        var linesGroup = [];


        var initLineIndex = null;
        var bootsGroupIndex = null;

        var groupsInUse = [];

        //console.log('groups', groups);
        //console.log('columns', columns);

        function findPreInitGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {
                    if (initLineGroup.length) {
                        if ($groupIndex < initLineIndex) {
                            if ($groupIndex == $columnIndex) {
                                if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                                    if (group.id !== column.id) {
                                        preInitGroups.push(group);
                                    }
                                } else {
                                    if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                                        if (group.key !== column.key) {
                                            preInitGroups.push(group);
                                        }
                                    } else {
                                        preInitGroups.push(group);
                                    }
                                }
                            }
                        }
                    } else {
                        // nice copypaste
                        if ($groupIndex == $columnIndex) {
                            if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                                if (group.id !== column.id) {
                                    preInitGroups.push(group);
                                }
                            } else {
                                if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                                    if (group.key !== column.key) {
                                        preInitGroups.push(group);
                                    }
                                } else {
                                    preInitGroups.push(group);
                                }
                            }
                        }
                    }

                })
            });
        }

        function findInitLineGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {
                    if (!initLineGroup.length) {
                        if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                            if (group.id == column.id) {
                                initLineGroup.push(group);
                                initLineIndex = $groupIndex;
                            }
                        } else {
                            if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                                if (group.key == column.key) {
                                    initLineGroup.push(group);
                                    initLineIndex = $groupIndex;
                                }
                            }
                        }
                    }

                })
            });
        }

        function findBootsGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {

                    if ($groupIndex > initLineIndex) {
                        if ($groupIndex - initLineIndex == $columnIndex) {
                            if (group.hasOwnProperty('id') && column.hasOwnProperty('id')) {
                                if (group.id == column.id) {
                                    bootsGroupIndex = $groupIndex;
                                    bootsGroup.push(group);
                                }
                            } else {
                                if (group.hasOwnProperty('key') && column.hasOwnProperty('key')) {
                                    if (group.key == column.key) {
                                        bootsGroupIndex = $groupIndex;
                                        bootsGroup.push(group);
                                    }
                                }
                            }
                        }
                    }

                })
            });
        }

        function findLinesGroup() {
            groups.forEach(function (group, $groupIndex) {
                columns.forEach(function (column, $columnIndex) {
                    if (bootsGroupIndex) {
                        if ($groupIndex > bootsGroupIndex) {
                            if (group.hasOwnProperty('id')) {
                                if (!isAdded(group, linesGroup, 'id')) {
                                    linesGroup.push(group);
                                }
                            } else {
                                if (!isAdded(group, linesGroup, 'key')) {
                                    linesGroup.push(group);
                                }
                            }
                        }
                    }

                })
            });
        }

        if(groups.length) {

            findInitLineGroup();
            findPreInitGroup();
            findBootsGroup();
            findLinesGroup();


            //console.log('preInitGroups', preInitGroups);
            //console.log('initLineGroup', initLineGroup);
            //console.log('bootsGroup', bootsGroup);
            //console.log('linesGroup', linesGroup);


            var results = setGroups(items, preInitGroups, entityType);

            //console.log('123', results);

            if (results[0].items && results[0].items.length) {

                results.forEach(function (preInitGroupsItem) {

                    preInitGroupsItem.initGroup = setGroups(preInitGroupsItem.items, initLineGroup, entityType);

                    if (preInitGroupsItem.initGroup && preInitGroupsItem.initGroup[0].hasOwnProperty('items')) {

                        preInitGroupsItem.initGroup.forEach(function (initGroupItem) {

                            initGroupItem.bootGroup = setGroups(initGroupItem.items, bootsGroup, entityType);

                            if (initGroupItem.bootGroup && initGroupItem.bootGroup[0].hasOwnProperty('items')) {

                                initGroupItem.bootGroup.forEach(function (bootGroupItem) {

                                    bootGroupItem.lineGroup = setGroups(bootGroupItem.items, linesGroup, entityType);
                                })
                            }

                        })
                    }

                });
            } else {
                preInitGroups = [];
                results = setGroups(items, initLineGroup, entityType);

                results.forEach(function (initGroupItem) {

                    initGroupItem.bootGroup = setGroups(initGroupItem.items, bootsGroup, entityType);

                    if (initGroupItem.bootGroup && initGroupItem.bootGroup[0].hasOwnProperty('items')) {

                        initGroupItem.bootGroup.forEach(function (bootGroupItem) {

                            bootGroupItem.lineGroup = setGroups(bootGroupItem.items, linesGroup, entityType);
                        })
                    }

                });

            }


            //console.log('results', results);

            return results;


        } else {
            return items;
        }

    };


    module.exports = {
        setGroups: setGroups,
        setGroupsWithColumns: setGroupsWithColumns
    }

}());


// CASE 1 the simplest

// GROUP1  | GROUP2      | GROUP3
// COLUMN1 | COLUMN2     | COLUMN3
// ______________________
//
// group1 full-width-line
//         | group2 boot | group3 boot | row1
//         |             |             | row2
//         |             |             | row3
//         |             |             group3 subtotal
//         |             group2 subtotal
//         | group2 boot | group3 boot | row4
//         |             |             | row5
//         |             |             | row6
//         |             |             group3 subtotal
//         |             | group3 boot | row7
//         |             |             | row8
//         |             |             | row9
//         |             |             group3 subtotal
//         |             group2 subtotal

// CASE 2

// GROUP1  | GROUP2      | GROUP3 | GROUP4
// COLUMN2 | COLUMN3
// ______________________
//
// group1  |
// group2 full-width-line
//         | group3 boot | group4 boot | row1
//         |             |             | row2
//         |             |             | row3
//         |             |             group4 subtotal
//         |             |             ∟ _ _ _ _ _ _  _
//         |             ∟ _ _ _ _ _ _ _ _ _ _ _ _ _ _
//         |             group3 subtotal
//         | group3 boot | group4 boot | row4
//         |             |             | row5
//         |             |             | row6
//         |             |             ∟ _ _ _ _ _ _  _
//         |             |             group4 subtotal
//         |             | group4 boot | row7
//         |             |             | row8
//         |             |             | row9
//         |             |             ∟ _ _ _ _ _ _  _
//         |             |             group4 subtotal
//         |             ∟ _ _ _ _ _ _ _ _ _ _ _ _ _ _
//         |             group3 subtotal


// CASE 3

// GROUP1  | GROUP2      | GROUP3      | GROUP 4
// COLUMN1 | COLUMN2     | COLUMN3     | COLUMN 5
// ______________________
//
// group1 full-width-line
//         | group2 boot | group3 boot | group 4 line |
//         |             |             | row2
//         |             |             | row3
//         |             |             group3 subtotal
//         |             group2 subtotal
//         | group2 boot | group3 boot | group 4 line |
//         |             |             | row5
//         |             |             | row6
//         |             |             group3 subtotal
//         |             | group3 boot | group 4 line |
//         |             |             | row8
//         |             |             | row9
//         |             |             group3 subtotal
//         |             group2 subtotal
