/**
 * Created by szhitenev on 08.06.2016.
 */
(function () {

    'use strict';

    var setFolds = function (items, folding) {
        var i;
        for (i = 0; i < items.length; i = i + 1) {
            items[i].isFolded = folding;
        }
        //console.log('FOLDED', items);
        return items;
    };

    module.exports = {
        setFolds: setFolds
    }

}());