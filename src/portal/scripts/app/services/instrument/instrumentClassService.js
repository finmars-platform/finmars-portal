/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentClassRepository = require('../../repositories/instrument/instrumentClassRepository');

    var getList = function (options) {
        return instrumentClassRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentClassRepository.getByKey(id);
    };

    var create = function(account) {
        return instrumentClassRepository.create(account);
    };

    var update = function(id, account) {
        return instrumentClassRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return instrumentClassRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());