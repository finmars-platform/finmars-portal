(function () {

    'use strict';

    var tableParts = {
        addEntityBtn: true
    };
    var setTablePartsSettings = function (entityType) {
        if (["transaction"].indexOf(entityType) !== -1 &&
            ["audit"].indexOf(entityType) !== -1) {
            tableParts.addEntityBtn = false;
        };
        return tableParts;
    };

    module.exports = {
        setTablePartsSettings: setTablePartsSettings
    }

}());