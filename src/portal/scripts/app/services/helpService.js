/**
 * Created by szhitenev on 13.01.2017.
 */
(function () {

    'use strict';

    var helpRepository = require('../repositories/helpRepository');

    var getFunctionsHelp = function(){
        return helpRepository.getFunctionsHelp();
    };

    module.exports = {
        getFunctionsHelp: getFunctionsHelp
    }

}());