(function () {
    'use strict';

    var metaHelper = require('../helpers/meta.helper');

    module.exports = function () {

        var onGridTableCellChange = function (originalItems, gtDataService, rowOrder, colOrder) {

            var column = gtDataService.getCell(rowOrder, colOrder);
            var oItem = originalItems[rowOrder];

            if (column.objPath) {
                metaHelper.setObjectNestedPropVal(oItem, column.objPath, column.settings.value);

            } else if (column.objPaths) {

                column.objPaths.forEach(function (objPath, index) {
                    metaHelper.setObjectNestedPropVal(oItem, objPath, column.settings.value[index]);
                });

            }

        };

        var getCellFromRowByKey = function (row, colKey) {

            for (var i = 0; i < row.columns.length; i++) {

                if (row.columns[i].key === colKey) {
                    return row.columns[i];
                }

            }

        };

        return {
            onGridTableCellChange: onGridTableCellChange,
            getCellFromRowByKey: getCellFromRowByKey
        }

    }

}());