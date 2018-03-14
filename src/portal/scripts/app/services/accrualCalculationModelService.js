/**
 * Created by szhitenev on 26.08.2016.
 */
(function () {

    'use strict';

    var accrualCalculationModelRepository = require('../repositories/accrualCalculationModelRepository');

    var getList = function () {
        return accrualCalculationModelRepository.getList();
    };

    module.exports = {
        getList: getList
    }

}());