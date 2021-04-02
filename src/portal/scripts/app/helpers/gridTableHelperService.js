(function () {
    'use strict';

	const metaHelper = require('../helpers/meta.helper');

    module.exports = function (multitypeFieldService) {

        const onGridTableCellChange = function (originalItems, gtDataService, rowOrder, colOrder) {

            const column = gtDataService.getCell(rowOrder, colOrder);
            let oItem = originalItems[rowOrder];

            if (column.objPath) {
                metaHelper.setObjectNestedPropVal(oItem, column.objPath, column.settings.value);

            } else if (column.objPaths) {

                column.objPaths.forEach(function (objPath, index) {
                    metaHelper.setObjectNestedPropVal(oItem, objPath, column.settings.value[index]);
                });

            }

        };

		const getCellFromRowByKey = function (row, colKey) {

			for (var i = 0; i < row.columns.length; i++) {
                if (row.columns[i].key === colKey) return row.columns[i];
            }

        };

		const setMultitypeFieldDataForCell = function (fieldTypesList, column, value, valueType) {

			const multitypeFieldData = multitypeFieldService.setActiveTypeByValueType(fieldTypesList, value, valueType);

			let cellValue = value;

			if (column.hasOwnProperty("objPaths")) {

				const activeType = multitypeFieldData.find(type => type.isActive) || {value_type: null};
				cellValue = [value, activeType.value_type];

			}

			column.settings = {
				value: cellValue,
				fieldTypesData: multitypeFieldData
			}

		};

        return {
            onGridTableCellChange: onGridTableCellChange,
            getCellFromRowByKey: getCellFromRowByKey,

			setMultitypeFieldDataForCell: setMultitypeFieldDataForCell
        }

    }

}());