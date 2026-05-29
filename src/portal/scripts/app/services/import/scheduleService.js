'use strict';

import scheduleRepository from '../../repositories/import/scheduleRepository';

var getAccrualScheduleDownloadMethodList = function () {
    return scheduleRepository.getAccrualScheduleDownloadMethodList();
};

var getFactorScheduleDownloadMethodList = function () {
    return scheduleRepository.getFactorScheduleDownloadMethodList();
};

export default {
    getAccrualScheduleDownloadMethodList: getAccrualScheduleDownloadMethodList,
    getFactorScheduleDownloadMethodList: getFactorScheduleDownloadMethodList
};