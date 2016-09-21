/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentPaymentSizeDetailRepository = require('../../repositories/instrument/instrumentPaymentSizeDetailRepository');

    var getList = function (options) {
        return instrumentPaymentSizeDetailRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }


}());