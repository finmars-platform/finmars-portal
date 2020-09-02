(function () {

    'use strict';

    module.exports = function () {

        var data = {
            tableData: null
        };

        function setTableData (tableData) {
            data.tableData = tableData
            console.log("grid table setTableData", tableData);
        }

        function getTableData () {
            return data.tableData;
        }

        function getRow (rowOrder) {

            if (rowOrder === 'newRow') {
                return data.tableData.newRow;

            } else {
                return data.tableData.body[rowOrder];

            }

        }

        function getCell (rowOrder, cellOrder) {

            if (rowOrder === 'newRow') {
                return data.tableData.newRow.columns[cellOrder];

            } else {
                return data.tableData.body[rowOrder].columns[cellOrder];

            }

        }

        function getCellByKey (rowOrder, colKey) {
            console.log("grid table getCellByKey", rowOrder, colKey);
            var row = getRow(rowOrder);
            console.log("grid table getCellByKey", row);
            for (var i = 0; i < row.columns.length; i++) {

                if (row.columns[i].key === colKey) {
                    return row.columns[i];
                }

            }

        }

        return {
            setTableData: setTableData,
            getTableData: getTableData,

            getRow: getRow,
            getCell: getCell,
            getCellByKey: getCellByKey
        }

    };

}());