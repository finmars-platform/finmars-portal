/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

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

    var setGroups = function (items, groups) {

        var itemsGrouped = [];
        var itemsGroupedArray = [];
        var i, c, a, k;
        var keywords = [{
            "key": "name",
            "caption": "Name"
        },
            {
                "key": "short_name",
                "caption": "Short name"
            },
            {
                "key": "notes",
                "caption": "Notes"
            }];

        var hasGroups = true;
        var groupName = '';
        var groupsForResult = [];

        function checkEntityForGroupExist(item, groups) {
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
            if (attribute['classifier']) {
                return attribute['classifier']
            } else {
                if (attribute['value_date']) {
                    return attribute['value_date'];
                } else {
                    if (attribute['value_float']) {
                        return attribute['value_float'];
                    } else {
                        return attribute['value_string'];
                    }
                }
            }

        }

        function fingGroupsForResult(group, item, attribute) {
            if (group.hasOwnProperty('id')) {
                console.log('group', group);
                console.log('attribute[k]', attribute);
                if (group.id === attribute['attribute_type']) {
                    groupsForResult.push({
                        key: attribute['attribute_name'],
                        value: returnValue(attribute)
                    });
                }
            } else {
                for (k = 0; k < keywords.length; k = k + 1) {
                    var n, nExist = false;
                    if (group.key === keywords[k].key) {

                        for (n = 0; n < groupsForResult.length; n = n + 1) {
                            if (groupsForResult[n].value.indexOf(item[keywords[k].key]) !== -1) {
                                nExist = true;
                            }
                        }
                        if (!nExist) {
                            groupsForResult.push({
                                key: keywords[k].key,
                                value: item[keywords[k].key]
                            });
                        }
                    }
                }
            }
        }

        function createGroupName() {

        }

        if (groups.length) {
            for (i = 0; i < items.length; i = i + 1) {
                hasGroups = checkEntityForGroupExist(items[i], groups);
                groupName = '';
                groupsForResult = [];

                groupName = '';
                groupsForResult = [];
                //console.log('groups', groups);
                for (c = 0; c < groups.length; c = c + 1) {
                    for (a = 0; a < items[i].attributes.length; a = a + 1) {

                        fingGroupsForResult(groups[c], items[i], items[i].attributes[a]);
                        console.log('groupsForResult', groupsForResult);

                        if (c == groups.length - 1) {
                            if (groups[c].hasOwnProperty('id')) {
                                if (groups[c].id === items[i].attributes[a]['attribute_type']) {
                                    groupName = groupName + returnValue(items[i].attributes[a]);
                                    console.log('groupName', groupName);
                                }
                            } else {
                                for (k = 0; k < keywords.length; k = k + 1) {
                                    if (c == groups.length - 1) {
                                        console.log('groups[c]', groups[c]);
                                        if (groups[c].key === keywords[k].key) {
                                            groupName = groupName + keywords[k].key;
                                        }
                                    }
                                }
                            }
                        } else {
                            if (groups[c].hasOwnProperty('id')) {
                                if (groups[c].id === items[i].attributes[a]['attribute_type']) {
                                    groupName = groupName + returnValue(items[i].attributes[a]) + '_';
                                }
                            } else {
                                for (k = 0; k < keywords.length; k = k + 1) {

                                    if (groups[c].key === keywords[k].key) {
                                        groupName = groupName + keywords[k].key + '_';
                                    }
                                }
                            }
                        }
                    }


                }

                if (!itemsGrouped[groupName]) {
                    itemsGrouped[groupName] = {
                        groups: groupsForResult,
                        items: []
                    }
                }
                itemsGrouped[groupName].items.push(items[i]);
                console.log('itemsGrouped', itemsGrouped);
                itemsGroupedArray = transformToArray(itemsGrouped);

            }

            //console.log('Items grouped', itemsGroupedArray);
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