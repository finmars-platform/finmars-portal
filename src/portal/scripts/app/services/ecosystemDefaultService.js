/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var ecosystemDefaultRepository = require('../repositories/ecosystemDefaultRepository');

    var getList = function (options) {
        return ecosystemDefaultRepository.getList(options);
    };

    var getByKey = function (id) {
        return ecosystemDefaultRepository.getByKey(id);
    };

    var create = function (account) {
        return ecosystemDefaultRepository.create(account);
    };

    var update = function (id, account) {
        return ecosystemDefaultRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return ecosystemDefaultRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());