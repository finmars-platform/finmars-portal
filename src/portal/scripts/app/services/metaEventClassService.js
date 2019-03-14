/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaEventClassRepository = require('../repositories/metaEventClassRepository');

    var getList = function(options){
        return metaEventClassRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }

}());