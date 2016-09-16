/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var usersGroupRepository = require('../repositories/usersGroupRepository');

    var getList = function (options) {
        return usersGroupRepository.getList(options);
    };

    var getByKey = function (id) {
        return usersGroupRepository.getByKey(id);
    };

    var create = function (group) {
        return usersGroupRepository.create(group);
    };

    var update = function (id, group) {
        return usersGroupRepository.update(id, group);
    };

    var deleteByKey = function (id) {
        return usersGroupRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());