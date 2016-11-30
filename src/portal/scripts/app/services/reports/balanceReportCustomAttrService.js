/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var balanceReportCustomAttrRepository = require('../../repositories/reports/balanceReportCustomAttrRepository');

    var getList = function (options) {
        return balanceReportCustomAttrRepository.getList(options);
    };

    var getByKey = function (id) {
        return balanceReportCustomAttrRepository.getByKey(id);
    };

    var create = function(account) {
        return balanceReportCustomAttrRepository.create(account);
    };

    var update = function(id, account) {
        return balanceReportCustomAttrRepository.update(id, account);
    };

    var deleteByKey = function (id) {
        return balanceReportCustomAttrRepository.deleteByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey,
        create: create,
        update: update,
        deleteByKey: deleteByKey
    }


}());