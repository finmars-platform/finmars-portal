/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var responsibleGroupRepository = require('../repositories/responsibleGroupRepository');

    var getList = function (options) {
        return responsibleGroupRepository.getList(options);
    };

    var getByKey = function (id) {
        return responsibleGroupRepository.getByKey(id);
    };

    var create = function(responsible) {
        return responsibleGroupRepository.create(responsible);
    };

    var update = function(id, responsible) {
        return responsibleGroupRepository.update(id, responsible);
    };

    var deleteByKey = function (id) {
        return responsibleGroupRepository.deleteByKey(id);
    };

    var deleteBulk = function(data) {
        return responsibleGroupRepository.deleteBulk(data);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,

        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk
    }


}());