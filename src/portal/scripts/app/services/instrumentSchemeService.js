/**
 * Created by szhitenev on 17.08.2016.
 */
(function(){

    'use strict';

    var instrumentSchemeRepository = require('../repositories/instrumentSchemeRepository');

    var getList = function(){
        return instrumentSchemeRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());