/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var counterpartyRepository = require('../repositories/counterpartyRepository');

    var getList = function (options) {
        return counterpartyRepository.getList(options);
    };

    var getByKey = function (id) {
        return counterpartyRepository.getByKey(id);
    };

    var create = function(counterparty) {
        return counterpartyRepository.create(counterparty);
    };

    var update = function(id, counterparty) {
        return counterpartyRepository.update(id, counterparty);
    };

    var deleteByKey = function (id) {
        return counterpartyRepository.deleteByKey(id);
    };

    var updateBulk = function(counterparties) {
        return counterpartyRepository.updateBulk(counterparties);
    };

    var deleteBulk = function(data) {
        return counterpartyRepository.deleteBulk(data)
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk,
        deleteBulk: deleteBulk
    }


}());