import instrumentPaymentSizeDetailRepository from '../../repositories/instrument/instrumentPaymentSizeDetailRepository';

var getList = function (options) {
    return instrumentPaymentSizeDetailRepository.getList(options);
};

export default {
    getList: getList
};