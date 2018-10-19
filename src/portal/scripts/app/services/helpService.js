/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';

    var getFunctionsItems = function () {
        return window.fetch('portal/content/json/functions_items.json').then(function (data) {
            return data.json();
        })
    };

    var getFunctionsGroups = function () {
        return window.fetch('portal/content/json/functions_groups.json').then(function (data) {
            return data.json();
        })
    };
    
    module.exports = {
        getFunctionsItems: getFunctionsItems,
        getFunctionsGroups: getFunctionsGroups
    }

}());