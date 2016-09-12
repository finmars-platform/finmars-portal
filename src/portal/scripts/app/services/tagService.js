/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var tagRepository = require('../repositories/tagRepository');

    var getList = function (entity) {
        return tagRepository.getList(entity);
    };

    var getByKey = function (id) {
        return tagRepository.getByKey(id);
    };

    var create = function(tag) {
        return tagRepository.create(tag);
    };

    var update = function(id, tag) {
        return tagRepository.update(id, tag);
    };

    var deleteByKey = function (id) {
        return tagRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());