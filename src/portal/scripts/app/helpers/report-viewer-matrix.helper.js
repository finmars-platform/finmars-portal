(function () {

    var rvSubtotalService = require('./rv-subtotal.service');

    function getMatrixUniqueValues(itemList, key) {

        var result = [];

        itemList.forEach(function (item) {

            if (result.indexOf(item[key]) === -1) {
                if (item[key]) {
                    result.push(item[key])
                }
            }

        });

        return result
    }

    function getMatrix(itemList, rows, columns, rowsKey, columnsKey, valueKey, subtotal_formula_id) {

        subtotal_formula_id = subtotal_formula_id || 1;

        var result = [];

        rows.forEach(function (rowName) { // creating data structure for matrix

            var matrixRowData = {
                index: result.length,
                row_name: rowName,
                items: []
            };

            columns.forEach(function (colName) {

                var matrixColumnData = {
                    index: matrixRowData.items.length,
                    column_name: colName,
                    data: {
                        flatListItems: [],
                        value: 0
                    }
                };

                matrixRowData.items.push(matrixColumnData);

            });

            result.push(matrixRowData);

        });

        itemList.forEach(function (item) { // find items for matrix cells

            var rowName = item[rowsKey];
            var colName = item[columnsKey];

            if (rowName && colName) {

                var r, c;
                rowsLoop: for (r = 0; r < result.length; r++) {
                    var row = result[r];

                    if (row.row_name === rowName) {

                        for (c = 0; c < row.items.length; c++) {
                            var column = row.items[c];

                            if (column.column_name === colName) {

                                column.data.flatListItems.push(item);
                                break rowsLoop;

                            }

                        }

                    }
                }

            }

        });

        result.forEach(function (row) { // calculating values of matrix's cells

            row.items.forEach(function (column) {

                if (column.data.flatListItems.length) {

                    var columnData = {
                        key: valueKey,
                        report_settings: {
                            subtotal_formula_id: subtotal_formula_id
                        }
                    };

                    var colValueObj = rvSubtotalService.calculateColumn(column.data.flatListItems, columnData);
                    column.data.value = colValueObj[valueKey];

                }

                delete column.data.flatListItems;

            });

        });

        return result

    }

    function getMatrixTotals(matrix) {

        var result = {
            rows: [],
            columns: [],
            total: 0
        };

        var rowTotal;

        matrix.forEach(function (rowItem) {

            rowTotal = 0;

            rowItem.items.forEach(function (columnItem, index) {

                rowTotal = rowTotal + columnItem.data.value;

                if (!result.columns[index]) {
                    result.columns[index] = {
                        column_name: columnItem.column_name,
                        total: 0
                    }
                }

                result.columns[index].total = result.columns[index].total + columnItem.data.value;

                result.total = result.total + columnItem.data.value

            });

            result.rows.push({
                row_name: rowItem.row_name,
                total: rowTotal
            })

        });

        return result

    }


    module.exports = {
        getMatrixUniqueValues: getMatrixUniqueValues,
        getMatrix: getMatrix,
        getMatrixTotals: getMatrixTotals
    }


}());