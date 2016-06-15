/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var portfolioRepository = require('../repositories/portfolioRepository');

    var getClassifierNodeList = function () {
        return portfolioRepository.getClassifierNodeList();
    };

    var getClassifierNodeByKey = function (id) {
        return portfolioRepository.getClassifierNodeByKey(id);
    };

    var getClassifierList = function () {
        return portfolioRepository.getClassifierList();
    };

    var getClassifierByKey = function (id) {
        return portfolioRepository.getClassifierByKey(id);
    };

    var getList = function () {
        return portfolioRepository.getList();
    };

    var getByKey = function (id) {
        return portfolioRepository.getByKey(id);
    };

    var create = function(portfolio) {
        return portfolioRepository.create(portfolio);
    };

    var update = function(id, portfolio) {
        return portfolioRepository.update(id, portfolio);
    };

    var deleteByKey = function (id) {
        return portfolioRepository.deleteByKey(id);
    };


    module.exports = {
        getClassifierNodeList: getClassifierNodeList,
        getClassifierNodeByKey: getClassifierNodeByKey,

        getClassifierList: getClassifierList,
        getClassifierByKey: getClassifierByKey,

        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());