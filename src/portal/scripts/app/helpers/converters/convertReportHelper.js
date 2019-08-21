(function() {

    'use strict';

    var utilsHelper = require('../utils.helper');

    var convertToExcel = function () {

        /*var rows = document.querySelectorAll('.ev-content .g-row');

        var table = '<table>';

        var columns = document.querySelectorAll('.g-columns-holder .g-cell');

        table = table + '<thead>';
        table = table + '<tr>';

        for (var hc = 0; hc < columns.length; hc = hc + 1) {

            table = table + '<th><b>' + columns[hc].querySelector('.g-cell-content').textContent + '</b></th>';
        }

        table = table + '</tr>';
        table = table + '</thead>';

        table = table + '<tbody>';

        var tr;
        var cells;
        var bg;
        for (var i = 0; i < rows.length; i = i + 1) {

            cells = rows[i].querySelectorAll('.g-cell');

            //console.log('cells', cells);

            tr = '<tr>';

            for (var c = 0; c < cells.length; c = c + 1) {

                bg = getComputedStyle(cells[c].parentElement).backgroundColor;

                if (cells[c].querySelector('b')) {
                    tr = tr + '<td bgcolor="' + bg + '"><b>' + cells[c].innerText + '</b></td>'
                } else {
                    tr = tr + '<td bgcolor="' + bg + '">' + cells[c].innerText + '</td>'
                }
            }

            tr = tr + '</tr>';

            table = table + tr;
        }

        table = table + "</tbody>";
        table = table + "</table>";

        return table;*/

    };

    var convertFlatListToExcel = function (flatList, columns, isReport, numberOfGroups) {

        var table = '<table><thead><tr>';

        for (var hc = 0; hc < columns.length; hc++) {

            var hColumnText;

            if (columns[hc].layout_name) {
                hColumnText = columns[hc].layout_name;
            } else {
                hColumnText = columns[hc].name;
            };

            table = table + '<th>' + hColumnText + '</th>';

        };

        table = table + '</tr></thead>';

        table = table + '<tbody>';

        var reportViewerGetTdElements = function () {

            var td = '';

            var c;
            for (c = 0; c < columns.length; c++) {

                var columnKey = columns[c].key;
                var cellText = '';

                if (flatList[r].___type === 'subtotal') {

                    var columnWithGroupName = flatList[r].___level - 2; // group level count starts from 1 and we omit root group

                    if (columnWithGroupName < 0 && c === 0) { // to show grand total

                        cellText = 'Grand Total'

                    } else if (c === columnWithGroupName) {

                        cellText = String(flatList[r].___group_name);

                    } else if ((flatList[r][columnKey] || flatList[r][columnKey] === 0) && c >= numberOfGroups) {

                        cellText = String(flatList[r][columnKey]);

                    }

                } else {

                    if (proxylineGroupData.level && c === proxylineGroupData.level - 2) {

                        cellText = proxylineGroupData.group_name;
                        proxylineGroupData = {}; // resetting after group name got rendered in row that goes after proxyline

                    } else if ((flatList[r][columnKey]) && c >= numberOfGroups) {

                        cellText = String(flatList[r][columnKey]);

                    }

                }

                td = td + '<td>' + cellText + '</td>';

            };

            return td;

        };

        var entityViewerGetTdElements = function () {

            var td = '';

            var c;
            for (c = 0; c < columns.length; c++) {

                var columnKey = columns[c].key;
                var cellText = '';

                if (flatList[r].___type === 'group') {


                    var columnWithGroupName = flatList[r].___level - 1; // group level count starts from 1 and we omit root group

                    if (c === 0) {

                        if (columnWithGroupName > 0) {
                            cellText = '&nbsp;&nbsp;'.repeat(columnWithGroupName) + String(flatList[r].___group_name); // distinguish group level by spaces
                        } else {
                            cellText = String(flatList[r].___group_name);
                        }

                    }

                } else if (flatList[r][columnKey]) {

                    cellText = String(flatList[r][columnKey]);

                };

                td = td + '<td>' + cellText + '</td>';

            };

            return td;

        };

        var tr;
        var proxylineGroupData = {};

        var r;
        for (r = 0; r < flatList.length; r++) {

            tr = '';

            if (isReport) {

                if (flatList[r].___type === 'subtotal') {

                    if (flatList[r].___subtotal_type === 'proxyline') {

                        proxylineGroupData.group_name = String(flatList[r].___group_name);
                        proxylineGroupData.level = flatList[r].___level;

                    } else {

                        tr = tr + '<tr>' + reportViewerGetTdElements() + '</tr>';
                        table = table + tr;

                    }

                } else {

                    tr = tr + '<tr>' + reportViewerGetTdElements() + '</tr>';
                    table = table + tr;

                };

            } else {

                if (flatList[r].___type !== 'control') {

                    entityViewerGetTdElements();

                    tr = tr + '<tr>' + entityViewerGetTdElements() + '</tr>';
                    table = table + tr;

                }

            }

        };

        table = table + '</tbody></table>';

        return table;

    };

    var convertFlatListToCSV = function (flatList, columns, isReport, numberOfGroups) {

        var csv = [];

        // creating row with names of columns
        csv[0] = [];
        for (var hc = 0; hc < columns.length; hc++) {

            var hColumnText;

            if (columns[hc].layout_name) {
                hColumnText = columns[hc].layout_name;
            } else {
                hColumnText = columns[hc].name;
            };

            // Escaping double quotes and commas
            if (hColumnText.indexOf('"') !== -1) {
                hColumnText = hColumnText.replace(/"/g, '""');
            };
            hColumnText = '"' + hColumnText + '"';

            csv[0].push(hColumnText);

        };

        if (csv[0].length > 0) {
            csv[0] = csv[0].join(',');
        }

        // < creating row with names of columns >

        var reportViewerAddCellsToCSVRow = function (csvRowOrder) {

            var c;
            for (c = 0; c < columns.length; c++) {

                var columnKey = columns[c].key;
                var cellText = '';

                if (flatList[r].___type === 'subtotal') {

                    var columnWithGroupName = flatList[r].___level - 2; // group level count starts from 1 and we omit root group

                    if (columnWithGroupName < 0 && c === 0) { // to show grand total

                        cellText = 'Grand Total'

                    } else if (c === columnWithGroupName) {

                        cellText = String(flatList[r].___group_name);

                    } else if ((flatList[r][columnKey] || flatList[r][columnKey] === 0) && c >= numberOfGroups) {

                        cellText = String(flatList[r][columnKey]);

                    }

                } else {

                    if (proxylineGroupData.level && c === proxylineGroupData.level - 2) {

                        cellText = proxylineGroupData.group_name;
                        proxylineGroupData = {}; // resetting after group name got rendered in row that goes after proxyline

                    } else if ((flatList[r][columnKey]) && c >= numberOfGroups) {

                        cellText = String(flatList[r][columnKey]);

                    }

                }

                // Escaping double quotes and commas
                if (cellText.indexOf('"') !== -1) {
                    cellText = cellText.replace(/"/g, '""');
                };
                cellText = '"' + cellText + '"';

                csv[csvRowOrder].push(cellText);

            };

        };

        var entityViewerAddCellsToCSVRow = function (csvRowOrder) {

            var c;
            for (c = 0; c < columns.length; c++) {

                var columnKey = columns[c].key;
                var cellText = '';

                if (flatList[r].___type === 'group') {

                    var columnWithGroupName = flatList[r].___level - 1; // group level count starts from 1 and we omit root group

                    if (c === 0) {

                        if (columnWithGroupName > 0) {
                            cellText = '  '.repeat(columnWithGroupName) + String(flatList[r].___group_name); // distinguish group level by spaces
                        } else {
                            cellText = String(flatList[r].___group_name);
                        }

                    }

                } else if (flatList[r][columnKey]) {

                    cellText = String(flatList[r][columnKey]);

                }

                // Escaping double quotes and commas
                if (cellText.indexOf('"') !== -1) {
                    cellText = cellText.replace(/"/g, '""');
                };
                cellText = '"' + cellText + '"';

                csv[csvRowOrder].push(cellText);

            };

        };

        var proxylineGroupData = {};

        var r;
        for (r = 0; r < flatList.length; r++) {

            var csvRowOrder = r + 1; // there is already row with index 0

            csv[csvRowOrder] = [];

            if (isReport) {

                if (flatList[r].___type === 'subtotal') {

                    if (flatList[r].___subtotal_type === 'proxyline') {

                        proxylineGroupData.group_name = String(flatList[r].___group_name);
                        proxylineGroupData.level = flatList[r].___level;

                    } else {
                        reportViewerAddCellsToCSVRow(csvRowOrder);

                        csv[csvRowOrder] = csv[csvRowOrder].join(',');
                    }

                } else {

                    reportViewerAddCellsToCSVRow(csvRowOrder);

                    csv[csvRowOrder] = csv[csvRowOrder].join(',');

                };

            } else {

                if (flatList[r].___type !== 'control') {

                    entityViewerAddCellsToCSVRow(csvRowOrder);

                    csv[csvRowOrder] = csv[csvRowOrder].join(',');
                }

            }

        };

        csv = csv.filter(function (row) { // filter proxyline rows
            return row.length > 0;
        });

        csv = csv.join('\n');

        return csv;

    };

    module.exports = {
        convertToExcel: convertToExcel,
        convertFlatListToExcel: convertFlatListToExcel,
        convertFlatListToCSV: convertFlatListToCSV
    }

}());