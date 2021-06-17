(function () {
    'use strict';

	const metaHelper = require('../helpers/meta.helper');
	const md5Helper = require('../helpers/md5.helper');
	const MultitypeFieldService = require('../services/multitypeFieldService');

    module.exports = function () {

    	const multitypeFieldService = new MultitypeFieldService();

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

		const getCellFromRowByKey = (row, colKey) => {

			for (var i = 0; i < row.columns.length; i++) {
                if (row.columns[i].key === colKey) return row.columns[i];
            }

        };

		const setCellInsideRow = function (row, cellData) {
			var columnIndex = row.columns.findIndex(cell => cell.key === cellData.key);
			row.columns[columnIndex] = cellData;
		};

		/**
		 *
		 * @param fieldTypesList {Array.<Object>} - array of objects with data for multitype field types
		 * @param cell {Object} - grid table cell data
		 * @param value {*} - multitype field value
		 * @param valueType {Number} - multitype field value type. Will be changed to default if it is not set.
		 *
		 * @return {{cell: Object, value_type: Number}} - returns changed cell data and current value_type of multitype field in case it does not set
		 */
		const getMultitypeFieldDataForCell = function (fieldTypesList, cell, value, valueType) {

			fieldTypesList = JSON.parse(JSON.stringify(fieldTypesList));
			valueType = multitypeFieldService.setActiveTypeByValueType(fieldTypesList, value, valueType);

			let cellValue = value;
			const activeType = fieldTypesList.find(type => type.isActive);

			if (cell.hasOwnProperty("objPaths")) {
				cellValue = [value, valueType];
			}

			cell.settings = {
				value: cellValue,
				fieldTypesData: fieldTypesList
			}

			if (activeType.fieldType === 'dropdownSelect') {

				const selOption = activeType.fieldData.menuOptions.find(option => option.id === value);
				cell.settings.cellText = selOption.name;

			}

			return {cell: cell, value_type: valueType};

		};

		const getNewRowUniqueKey = function (gridTableDataService) {

			let newRowIndex = 0;

			const gtData = gridTableDataService.getTableData();
			const newRowIndexesList = gtData.body.filter(row => row.newRow).map(newRow => newRow.key.slice(0, 1));

			while (newRowIndexesList.includes('' + newRowIndex)) {
				newRowIndex++;
			}

			return newRowIndex + md5Helper.md5('newGridTableRow', newRowIndex);

		}

        return {
            onGridTableCellChange: onGridTableCellChange,
            getCellFromRowByKey: getCellFromRowByKey,
			setCellInsideRow: setCellInsideRow,

			getMultitypeFieldDataForCell: getMultitypeFieldDataForCell,

			getNewRowUniqueKey: getNewRowUniqueKey
        }

    }

}());