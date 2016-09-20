/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentAttributeTypeRepository = require('../../repositories/instrument/instrumentAttributeTypeRepository');

    var getList = function (options) {
        return instrumentAttributeTypeRepository.getList(options);
    };

    var getListByAttributeType = function (value_types) {
        return instrumentAttributeTypeRepository.getListByAttributeType(value_types);
    };

    var getByKey = function (id) {
        return instrumentAttributeTypeRepository.getByKey(id);
    };

    var create = function (account) {
        return instrumentAttributeTypeRepository.create(account);
    };

    var update = function (id, account) {
        return instrumentAttributeTypeRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return instrumentAttributeTypeRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getListByAttributeType: getListByAttributeType,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());