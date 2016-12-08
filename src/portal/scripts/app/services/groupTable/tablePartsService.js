(function () {

    'use strict';

    var tableParts = {
        addEntityBtn: true
    };
    var setTablePartsSettings = function (entityType) {
        if (["transaction"].indexOf(entityType) !== -1 ||
            entityType.indexOf("audit") !== -1) {
            tableParts.addEntityBtn = false;
        }
        else {
           tableParts.addEntityBtn = true; 
        };
        return tableParts;
    };

    module.exports = {
        setTablePartsSettings: setTablePartsSettings
    }

}());