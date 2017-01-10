/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentRepository = require('../repositories/instrumentRepository');

    var getList = function (options) {
        return instrumentRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentRepository.getByKey(id);
    };

    var create = function(instrument) {
        return instrumentRepository.create(instrument);
    };

    var update = function(id, instrument) {
        return instrumentRepository.update(id, instrument);
    };

    var deleteByKey = function (id) {
        return instrumentRepository.deleteByKey(id);
    };

    var updateBulk = function(instruments) {
        return instrumentRepository.updateBulk(instruments);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

        updateBulk: updateBulk
    }


}());