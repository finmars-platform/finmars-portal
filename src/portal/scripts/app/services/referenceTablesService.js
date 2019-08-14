/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var referenceTablesRepository = require('../repositories/referenceTablesRepository');

    var getList = function (options) {
        return referenceTablesRepository.getList(options);
    };

    var getByKey = function (id) {
        return referenceTablesRepository.getByKey(id);
    };

    var create = function(account) {
        return referenceTablesRepository.create(account);
    };

    var update = function(id, account) {
        return referenceTablesRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return referenceTablesRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());