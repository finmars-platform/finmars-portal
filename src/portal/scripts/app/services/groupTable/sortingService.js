/**
 * Created by szhitenev on 06.05.2016.
 */
(function(){

    'use strict';

    /*
     sort: {
        column: "name",
        direction: "DESC"
     }
     */

    var groupSort = function(items, sort) {
        var itemsGroupSorted = items;
        return itemsGroupSorted;
    };

    /*
        sort: {
            column: "name",
            direction: "DESC"
        }

     */

    var columnSort = function(items, sort) {
        var itemsColumnSorted = items;
        return itemsColumnSorted;
    };

    module.exports = {
        group: {
            sort: groupSort
        },
        column: {
            sort: columnSort
        }
    }

}());