/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    var instrumentDailyPricingModelRepository = require('../../repositories/instrument/instrumentDailyPricingModelRepository');

    var getList = function (options) {
        return instrumentDailyPricingModelRepository.getList(options);
    };

    var getByKey = function (id) {
        return instrumentDailyPricingModelRepository.getByKey(id);
    };


    module.exports = {
        getList: getList,
        getByKey: getByKey
    }


}());