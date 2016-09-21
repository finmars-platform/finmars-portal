/**
 * Created by szhitenev on 20.09.2016.
 */
(function () {

    'use strict';

    var instrumentRecalculateAccruedPriceRepository = require('../../repositories/instrument/instrumentRecalculateAccruedPriceRepository');

    var recalculate = function (dateFrom, dateTo) {
        return instrumentRecalculateAccruedPriceRepository.recalculate(dateFrom, dateTo);
    };

    module.exports = {
        recalculate: recalculate
    }

}());