/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var processesRepository = require('../repositories/processesRepository');

    var getList = function (options) {
        return processesRepository.getList(options);
    };

    var deleteByKey = function (id) {
        return processesRepository.deleteByKey(id);
    };

    var getStatus = function (id, celery_task_id) {
        return processesRepository.getStatus(id, celery_task_id);
    }


    module.exports = {
        getList: getList,
        deleteByKey: deleteByKey,
        getStatus: getStatus
    }


}());