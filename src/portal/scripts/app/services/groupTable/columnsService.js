/**
 * Created by szhitenev on 06.05.2016.
 */
(function () {

    'use strict';

    var reservedProps = ['id', 'url', 'tags', 'user_code'];

    var setColumns = function (items, columns) {
        // console.log('items in set columns is ', items);
        //var itemsColumned = items.map(function(item){
        //    var i, x, z;
        //    var keys = Object.keys(item);
        //    var saved;
        //    for(i = 0; i < keys.length; i = i + 1) {
        //        saved = false;
        //        for(x = 0; x < columns.length; x = x + 1) {
        //            for(z = 0; z < reservedProps.length; z = z + 1) {
        //                if(keys[i] === columns[x] || keys[i] == reservedProps[z]) {
        //                    saved = true
        //                }
        //            }
        //        }
        //        if(!saved) {
        //            delete item[keys[i]];
        //        }
        //    }
        //    return item;
        //});
        //return itemsColumned;
        return items;
    };

    module.exports = {
        setColumns: setColumns
    }

}());