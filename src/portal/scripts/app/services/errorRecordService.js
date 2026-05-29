import errorRecordRepository from '../repositories/errorRecordRepository';

var getList = function (options) {
    return errorRecordRepository.getList(options);
};

export default {
    getList: getList,

};