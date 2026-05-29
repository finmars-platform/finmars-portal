'use strict';

import instrumentRecalculateAccruedPriceRepository from '../../repositories/instrument/instrumentRecalculateAccruedPriceRepository';

var recalculate = function (dateFrom, dateTo) {
    return instrumentRecalculateAccruedPriceRepository.recalculate(dateFrom, dateTo);
};

export default {
    recalculate: recalculate
};