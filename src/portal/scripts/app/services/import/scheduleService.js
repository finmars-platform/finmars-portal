/**
 * Created by szhitenev on 19.08.2016.
 */
(function () {

    'use strict';

    var scheduleRepository = require('../../repositories/import/scheduleRepository');

    var getAccrualScheduleDownloadMethodList = function () {
        return scheduleRepository.getAccrualScheduleDownloadMethodList();
    };

    var getFactorScheduleDownloadMethodList = function () {
        return scheduleRepository.getFactorScheduleDownloadMethodList();
    };

    module.exports = {
        getAccrualScheduleDownloadMethodList: getAccrualScheduleDownloadMethodList,
        getFactorScheduleDownloadMethodList: getFactorScheduleDownloadMethodList
    }

}());