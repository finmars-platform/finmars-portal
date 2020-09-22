/**
 * Created by szhitenev on 25.08.2016.
 */
(function(){

    'use strict';

    var scheduleRepository = require('../repositories/scheduleRepository');

    var getList = function (options) {
        return scheduleRepository.getList(options);
    };

    var getByKey = function (id) {
        return scheduleRepository.getByKey(id);
    };

    var create = function(account) {
        return scheduleRepository.create(account);
    };

    var update = function(id, account) {
        return scheduleRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return scheduleRepository.deleteByKey(id);
    };

    module.exports = {

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());