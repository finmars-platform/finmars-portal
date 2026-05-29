'use strict';

var getEntitiesWithDisabledPermissions = function () {
    return ["transaction", "price-history", "currency-history",
        'complex-transaction',
        'counterparty-group', 'responsible-group'];
};

export default {
    getEntitiesWithDisabledPermissions: getEntitiesWithDisabledPermissions
};