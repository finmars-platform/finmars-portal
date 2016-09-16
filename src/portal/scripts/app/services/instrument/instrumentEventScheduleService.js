/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentEventScheduleRepository = require('../../repositories/instrument/instrumentEventScheduleRepository');

    var getList = function (options) {
        return instrumentEventScheduleRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentEventScheduleRepository.getByKey(id);
    };

    var create = function(account) {
        return instrumentEventScheduleRepository.create(account);
    };

    var update = function(id, account) {
        return instrumentEventScheduleRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return instrumentEventScheduleRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());