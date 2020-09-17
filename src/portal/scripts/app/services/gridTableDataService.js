(function () {

    'use strict';

    module.exports = function () {

        var defaultSortingSettings = {
            columns: null,
            valueOrder: null, // value number from multiple values to use in sorting
            reverse: false
        }

        var data = {
            tableData: null,
            sortingSettings: Object.assign({}, defaultSortingSettings)
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
                return data.tableData.templateRow;

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
            })
        }

        function getSelectedRows () {
            var rows = data.tableData.body.filter(function (row) {
                return row.isActive;
            });

            return rows;
        }

        function getCell (rowOrder, cellOrder) {

            if (rowOrder === 'newRow') {
                return data.tableData.templateRow.columns[cellOrder];

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

        function setSortingSettings (colOrder, options) {

            if (data.sortingSettings.column === colOrder) {
                data.sortingSettings.reverse = !data.sortingSettings.reverse

            } else {

                data.sortingSettings = Object.assign({}, defaultSortingSettings) // reset sorting settings on column change
                data.sortingSettings.column = colOrder

            }

            if (options) {

                Object.keys(options).forEach(function (sortOnsProp) {
                    data.sortingSettings[sortOnsProp] = options[sortOnsProp]
                })

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