/**
 * Created by szhitenev on 30.07.2023.
 */
(function () {

    var mappingTableRepository = require('../repositories/mappingTableRepository');

    var getList = function (options) {
        return mappingTableRepository.getList(options);
    };
    var getByKey = function (id) {
        return mappingTableRepository.getByKey(id);
    };

    var create = function(account) {
        return mappingTableRepository.create(account);
    };

    var update = function(id, account) {
        return mappingTableRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return mappingTableRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }

}());