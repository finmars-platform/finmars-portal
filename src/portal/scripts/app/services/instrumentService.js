/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentRepository = require('../repositories/instrumentRepository');

    var getList = function () {
        return instrumentRepository.getList();
    };

    var getByKey = function (id) {
        return instrumentRepository.getByKey(id);
    };

    var create = function(account) {
        return instrumentRepository.create(account);
    };

    var update = function(id, account) {
        return instrumentRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return instrumentRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());