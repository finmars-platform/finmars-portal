(function () {

    'use strict';

    module.exports = function () {

        var data = {
            tableData: null,
            sortingSettings: {
                columns: null,
                reverse: false
            }
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

        function deleteRows (rows) {

            if (Array.isArray(rows)) {

                rows.forEach(function (row) {
                    data.tableData.body.splice(row.order, 1);
                });

            } else {
                data.tableData.body.splice(rows.order, 1);

            }

            data.tableData.body.forEach(function (row, index) {
                row.order = index;
            });
            console.log("grid table rows after deletion", data.tableData.body);
        }

        function getSelectedRows () {
            var rows = data.tableData.body.filter(function (row) {
                return row.isActive;
            });

            return rows;
        }

        function getCell (rowOrder, cellOrder) {

            if (rowOrder === 'newRow') {
                return data.tableData.newRow.columns[cellOrder];

            } else {
                return data.tableData.body[rowOrder].columns[cellOrder];

            }

        }

        function getCellByKey (rowOrder, colKey) {

            var row = getRow(rowOrder);

            for (var i = 0; i < row.columns.length; i++) {

                if (row.columns[i].key === colKey) {
                    return row.columns[i];
                }

            }

        }

        function setSortingSettings (colOrder) {

            if (data.sortingSettings.column === colOrder) {
                data.sortingSettings.reverse = !data.sortingSettings.reverse

            } else {
                data.sortingSettings.column = colOrder
                data.sortingSettings.reverse = false
            }


        }

        function getSortingSettings () {
            return data.sortingSettings;
        }

        return {
            setTableData: setTableData,
            getTableData: getTableData,

            getRow: getRow,
            getSelectedRows: getSelectedRows,
            deleteRows: deleteRows,

            getCell: getCell,
            getCellByKey: getCellByKey,

            setSortingSettings: setSortingSettings,
            getSortingSettings: getSortingSettings
        }

    };

}());