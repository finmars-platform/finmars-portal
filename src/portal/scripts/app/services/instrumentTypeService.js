/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentTypeRepository = require('../repositories/instrumentTypeRepository');

    var getList = function (options) {
        return instrumentTypeRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentTypeRepository.getByKey(id);
    };

    var create = function(account) {
        return instrumentTypeRepository.create(account);
    };

    var update = function(id, account) {
        return instrumentTypeRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return instrumentTypeRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());