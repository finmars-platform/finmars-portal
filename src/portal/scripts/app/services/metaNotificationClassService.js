/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaNotificationClassRepository = require('../repositories/metaNotificationClassRepository');

    var getList = function(options){
        return metaNotificationClassRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }

}());