/**
 * Created by szhitenev on 05.09.2024.
 */
(function () {

    var plReportInstanceRepository = require('../repositories/plReportInstanceRepository');

    var getList = function (options) {
        return plReportInstanceRepository.getList(options);
    };

    var getByKey = function (id) {
        return plReportInstanceRepository.getByKey(id);
    };

    var create = function (account) {
        return plReportInstanceRepository.create(account);
    };

    var update = function (id, account) {
        return plReportInstanceRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return plReportInstanceRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

    }


}());