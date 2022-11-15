/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var processesRepository = require('../repositories/processesRepository');

    var getList = function (options) {
        return processesRepository.getList(options);
    };

    var getByKey = function (id) {
        return processesRepository.getByKey(id);
    };

    var deleteByKey = function (id) {
        return processesRepository.deleteByKey(id);
    };

    var getStatus = function (id, celery_task_id) {
        return processesRepository.getStatus(id, celery_task_id);
    }

    var cancelTask = function (id) {
        return processesRepository.cancelTask(id);
    }

    var abortTransactionImport = function (id) {
        return processesRepository.abortTransactionImport(id);
    }

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        deleteByKey: deleteByKey,
        getStatus: getStatus,
        cancelTask: cancelTask,
        abortTransactionImport: abortTransactionImport
    }


}());