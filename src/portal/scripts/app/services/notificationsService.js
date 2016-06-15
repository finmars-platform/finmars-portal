/**
 * Created by szhitenev on 14.06.2016.
 */
(function(){

    'use strict';

    var notificationsRepository = require('../repositories/notificationsRepository');

    var getList = function() {
        return notificationsRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());