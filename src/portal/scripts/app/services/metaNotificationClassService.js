/**
 * Created by szhitenev on 09.08.2016.
 */
(function(){

    'use strict';

    var metaNotificationClassRepository = require('../repositories/metaNotificationClassRepository');

    var getList = function(){
        return metaNotificationClassRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());