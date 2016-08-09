/**
 * Created by szhitenev on 09.08.2016.
 */
(function () {

    'use strict';

    var getEntitiesWithDisabledPermissions = function () {
        return ["transaction", "price-history", "currency-history"];
    };

    module.exports = {
        getEntitiesWithDisabledPermissions: getEntitiesWithDisabledPermissions
    }

}());