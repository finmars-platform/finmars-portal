/**
 * Created by szhitenev on 30.05.2016.
 */

(function () {

    'use strict';

    var range = function (count) {
        var i;
        var numbers = [];
        for (i = 1; i <= count; i = i + 1) {
            numbers.push(i);
        }
        return numbers;
    };

    module.exports = {
        range: range
    }

}());