/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var transformToArray = function (groupedObject) {

        var items = [];
        var i;
        var keys = Object.keys(groupedObject);
        for (i = 0; i < keys.length; i = i + 1) {
            items.push(groupedObject[keys[i]]);
        }
        return items;
    };

    var setGroups = function (items, groups) {

        var itemsGrouped = [];
        var itemsGroupedArray = [];
        var i, g, c;

        var hasGroups = true;
        var groupName = '';
        var groupsForResult = [];

        for (i = 0; i < items.length; i = i + 1) {
            for (g = 0; g < groups.length; g = g + 1) {
                if (!items[i].hasOwnProperty(groups[g])) {
                    hasGroups = false;
                }
            }
            if (hasGroups) {
                groupName = '';
                groupsForResult = [];
                for (c = 0; c < groups.length; c = c + 1) {
                    groupsForResult.push(items[i][groups[c]]);
                    if (c == groups.length - 1) {
                        groupName = groupName + items[i][groups[c]];
                    } else {
                        groupName = groupName + items[i][groups[c]] + '_';
                    }
                }
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