/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    var metaService = require('../metaService');

    'use strict';

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

        console.log('GROUPING SERVICE groups', groups);

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

        function returnValue(attribute) {
            if (attribute['classifier'] !== null) {
                return attribute['classifier']
            } else {
                if (attribute['value_date'] !== null) {
                    return attribute['value_date'];
                } else {
                    if (attribute['value_float'] !== null) {
                        return attribute['value_float'];
                    } else {
                        return attribute['value_string'];
                    }
                }
            }

        }

        function returnValueType(attribute) {
            if (attribute['classifier'] !== null) {
                return 'classifier'
            } else {
                if (attribute['value_date'] !== null) {
                    return 'value_date';
                } else {
                    if (attribute['value_float'] !== null) {
                        return 'value_float';
                    } else {
                        return 'value_string';
                    }
                }
            }
        }

        function fingGroupsForResult(group, item, attribute) {
            if (group.hasOwnProperty('id')) {
                //console.log('group', group);
                //console.log('attribute[k]', attribute);
                if (group.id === attribute['attribute_type']) {
                    if (returnValue(attribute) !== null) {
                        groupsForResult.push({
                            comparePattern: '&[' + attribute['attribute_type'] + '}-{' + returnValue(attribute) + ']',
                            key: attribute['attribute_name'].replace(' ', '_'),
                            value: returnValue(attribute),
                            value_type: returnValueType(attribute)
                        });
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
                            if (groupsForResult[n].comparePattern.indexOf('&[' + keywords[k].key + '}-{' + item[keywords[k].key] + ']') !== -1) {
                                nExist = true;
                            }
                        }
                        if (!nExist) {
                            groupsForResult.push({
                                comparePattern: '&[' + keywords[k].key + '}-{' + item[keywords[k].key] + ']',
                                key: keywords[k].key.replace(' ', '_'),
                                value: item[keywords[k].key],
                                value_type: keywords[k].value_type
                            });
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
                        fingGroupsForResult(group, item);
                        var keys = Object.keys(items[i]);
                        for (a = 0; a < keys.length; a = a + 1) {
                            if (groupName.indexOf('&[' + group.key + '}-{' + item[group.key] + ']') === -1) {
                                groupName = groupName + '&[' + group.key + '}-{' + item[group.key] + ']';
                            }
                        }
                    } else {
                        if (item.hasOwnProperty('attributes')) {
                            //console.log('item.attributes', item.attributes);
                            for (a = 0; a < item.attributes.length; a = a + 1) {
                                fingGroupsForResult(group, item, item['attributes'][a]);
                                if (item[group.name] !== null) {
                                    if (groupName.indexOf('&[' + group.name + '}-{' + item[group.name] + ']') === -1) {
                                        groupName = groupName + '&[' + group.name + '}-{' + item[group.name] + ']';
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

            console.log('Items grouped', itemsGroupedArray);
            return itemsGroupedArray;
        } else {
            //console.log('items', items);
            return items;
        }
    };

    module.exports = {
        setGroups: setGroups
    }

}());