/**
 * Created by szhitenev on 05.09.2024.
 */
(function () {

    var balanceReportInstanceRepository = require('../repositories/balanceReportInstanceRepository');

    var getList = function (options) {
        return balanceReportInstanceRepository.getList(options);
    };

    var getByKey = function (id) {
        return balanceReportInstanceRepository.getByKey(id);
    };

    var create = function(account) {
        return balanceReportInstanceRepository.create(account);
    };

    var update = function(id, account) {
        return balanceReportInstanceRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return balanceReportInstanceRepository.deleteByKey(id);
    };

    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey,

    }


}());