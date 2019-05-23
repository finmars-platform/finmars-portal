/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var customFieldRepository = require('../../repositories/reports/customFieldRepository');

    var getList = function (entityType, options) {
        return customFieldRepository.getList(entityType, options);
    };

    var getByKey = function (entityType, id) {
        return customFieldRepository.getByKey(entityType, id);
    };

    var create = function (entityType, data) {
        return customFieldRepository.create(entityType, data);
    };

    var update = function (entityType, id, data) {
        return customFieldRepository.update(entityType, id, data);
    };

    var deleteByKey = function (entityType, id) {
        return customFieldRepository.deleteByKey(entityType, id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());