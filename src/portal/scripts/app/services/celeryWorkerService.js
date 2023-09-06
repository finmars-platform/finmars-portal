/**
 * Created by szhitenev on 06.09.2023.
 */
(function () {

    var celeryWorkerRepository = require('../repositories/celeryWorkerRepository');

    var getList = function (options) {
        return celeryWorkerRepository.getList(options);
    };
    var getByKey = function (id) {
        return celeryWorkerRepository.getByKey(id);
    };

    var create = function(data) {
        return celeryWorkerRepository.create(data);
    };

    var update = function(id, data) {
        return celeryWorkerRepository.update(id, data);
    };

    var deleteByKey = function (id) {
        return celeryWorkerRepository.deleteByKey(id);
    };


    var start = function(id, data) {
        return celeryWorkerRepository.start(id, data);
    };

    var stop = function(id, data) {
        return celeryWorkerRepository.stop(id, data);
    };

    var restart = function(id, data) {
        return celeryWorkerRepository.restart(id, data);
    };

    var getStatus = function(id) {
        return celeryWorkerRepository.getStatus(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,


        start: start,
        stop: stop,
        restart: restart,
        getStatus: getStatus

    }

}());