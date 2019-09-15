(function () {


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

    function getMatrix(itemList, rows, columns, rowsKey, columnsKey, valueKey) {

        var result = [];

        var data = {};

        itemList.forEach(function (item) {

            rows.forEach(function (row) {

                columns.forEach(function (column) {

                    if (!data.hasOwnProperty(row + ':' + column)) {
                        data[row + ':' + column] = 0
                    }

                    if (item[columnsKey] === column && item[rowsKey] === row) {

                        data[row + ':' + column] = data[row + ':' + column] + item[valueKey]

                    }
                })

            })

        });

        var pieces;
        var row;
        var column;

        console.log('data', data);

        var rowsAsKeys = {};

        Object.keys(data).forEach(function (dataKey) {

            pieces = dataKey.split(':');

            row = pieces[0];
            column = pieces[1];

            if (!rowsAsKeys.hasOwnProperty(row)) {
                rowsAsKeys[row] = {
                    row_name: row,
                    items: []
                }
            }

            rowsAsKeys[row].items.push({
                column_name: column,
                data: {
                    value: data[dataKey]
                }
            })

        });

        Object.keys(rowsAsKeys).forEach(function (rowKey, index) {

            rowsAsKeys[rowKey].index = index;

            rowsAsKeys[rowKey].items = rowsAsKeys[rowKey].items.map(function (item, index) {
                item.index = index;
                return item;
            });

            result.push(rowsAsKeys[rowKey])
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