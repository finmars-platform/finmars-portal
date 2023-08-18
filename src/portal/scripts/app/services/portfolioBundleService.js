/**
 * Created by szhitenev on 03.08.2023.
 */
(function () {

    var portfolioBundleRepository = require('../repositories/portfolioBundleRepository');


    var getList = function (options) {
        return portfolioBundleRepository.getList(options);
    };

    var getByKey = function (id) {
        return portfolioBundleRepository.getByKey(id);
    };

    var create = function (portfolio) {
        return portfolioBundleRepository.create(portfolio);
    };

    var update = function (id, portfolio) {
        return portfolioBundleRepository.update(id, portfolio);
    };

    var deleteByKey = function (id) {
        return portfolioBundleRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());