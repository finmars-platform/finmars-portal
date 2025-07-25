/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var currencyRepository = require('../repositories/currencyRepository');

    var getList = function (options) {
        return currencyRepository.getList(options);
    };

    var getListLight = function (options) {
        return currencyRepository.getListLight(options);
    };

    var getByKey = function (id) {
        return currencyRepository.getByKey(id);
    };

    var create = function(account) {
        return currencyRepository.create(account);
    };

    var update = function(id, account) {
        return currencyRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return currencyRepository.deleteByKey(id);
    };

    var deleteBulk = function(data){
        return currencyRepository.deleteBulk(data);
    };

    var restoreBulk = function(data){
        return currencyRepository.restoreBulk(data);
    };

    module.exports = {
        getList: getList,
        getListLight: getListLight,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,
        deleteBulk: deleteBulk,
        restoreBulk: restoreBulk
    }


}());