/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaEventClassRepository = require('../repositories/metaEventClassRepository');

    var getList = function(){
        return metaEventClassRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());