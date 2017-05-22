/**
 * Created by szhitenev on 14.06.2016.
 */
(function(){

    'use strict';

    var notificationsRepository = require('../repositories/notificationsRepository');

    var getList = function(page, type) {
        return notificationsRepository.getList(page, type);
    };

    var markAsReaded = function (url, data) {
    	return notificationsRepository.markAsReaded(url, data);
    };

    var markAllAsReaded = function () {
    	return notificationsRepository.markAllAsReaded();
    };

    module.exports = {
        getList: getList,
        markAsReaded: markAsReaded, 
        markAllAsReaded: markAllAsReaded
    }

}());