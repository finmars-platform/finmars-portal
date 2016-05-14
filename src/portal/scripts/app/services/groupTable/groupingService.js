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

        for (i = 0; i < items.length; i = i + 1) {
            hasGroups = checkEntityForGroupExist(items[i], groups);
            if (hasGroups) {
                groupName = '';
                groupsForResult = [];
                console.log('groups', groups);
                for (c = 0; c < groups.length; c = c + 1) {
                    for (a = 0; a < items[i].attributes.length; a = a + 1) {
                        if (groups[c].hasOwnProperty('id')) {
                            if (groups[c].id === items[i].attributes[a]['attribute_type']) {
                                groupsForResult.push(returnValue(items[i].attributes[a]));
                            }
                        } else {
                            for (k = 0; k < keywords.length; k = k + 1) {
                                if (groups[c].name === keywords[k].caption) {
                                    if (groupsForResult.indexOf(items[i][keywords[k].key]) === -1) {
                                        groupsForResult.push(items[i][keywords[k].key]);
                                    }
                                }
                            }
                        }
                        if (c == groups.length - 1) {
                            if (groups[c].hasOwnProperty('id')) {
                                if (groups[c].id === items[i].attributes[a]['attribute_type']) {
                                    groupName = groupName + returnValue(items[i].attributes[a]);
                                }
                            } else {
                                for (k = 0; k < keywords.length; k = k + 1) {
                                    if (c == groups.length - 1) {
                                        if (groups[c].name === keywords[k].caption) {
                                            groupName = groupName + keywords[k].caption;
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
                                    if (groups[c].name === keywords[k].caption) {
                                        groupName = groupName + keywords[k].caption + '_';
                                    }
                                }
                            }
                        }
                    }


                }
                //console.log('groupsForResult', groupsForResult);
                if (!itemsGrouped[groupName]) {
                    itemsGrouped[groupName] = {
                        groups: groupsForResult,
                        items: []
                    }
                }
                itemsGrouped[groupName].items.push(items[i]);
            }
        }

        itemsGroupedArray = transformToArray(itemsGrouped);
        console.log('Items grouped', itemsGroupedArray);
        return itemsGroupedArray;
    };

    module.exports = {
        setGroups: setGroups
    }

}());