/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var shareConfigurationFileRepository = require('../repositories/shareConfigurationFileRepository');

    var getList = function (options) {
        return shareConfigurationFileRepository.getList(options);
    };

    var getByKey = function (id) {
        return shareConfigurationFileRepository.getByKey(id);
    };

    var create = function(item) {
        return shareConfigurationFileRepository.create(item);
    };

    var update = function(id, item) {
        return shareConfigurationFileRepository.update(id, item);
    };

    var deleteByKey = function (id) {
        return shareConfigurationFileRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());