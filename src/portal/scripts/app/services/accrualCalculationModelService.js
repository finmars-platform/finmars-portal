/**
 * Created by szhitenev on 26.08.2016.
 */
(function () {

    'use strict';

    var accrualCalculationModelRepository = require('../repositories/accrualCalculationModelRepository');

    var getList = function (options) {
        return accrualCalculationModelRepository.getList(options);
    };

    module.exports = {
        getList: getList
    }

}());