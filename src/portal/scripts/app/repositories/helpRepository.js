/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';

    var getFunctionsHelp = function () {
        return window.fetch('portal/content/json/functions_help.json').then(function(data){
            return data.json();
        })
    };

    module.exports = {
        getFunctionsHelp: getFunctionsHelp
    }

}());