(function() {

    'use strict';

    var convertToExcel = function () {

        var rows = document.querySelectorAll('.ev-content .g-row');

        var table = '<table>';

        var columns = document.querySelectorAll('.g-columns-holder .g-cell');

        table = table + '<thead>';
        table = table + '<tr>';

        for (var hc = 0; hc < columns.length; hc = hc + 1) {

            table = table + '<th><b>' + columns[hc].querySelector('.caption').textContent + '</b></th>';
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

        return table;
    };

    var convertToCSV = function (rows, columns) {

        var csv = [];

        csv[0] = [];
        for (var hc = 0; hc < columns.length; hc++) {
            var hColumnText = columns[hc].querySelector('.caption .column-name-span').textContent;

            // Escaping double quotes and commas
            if (hColumnText.indexOf('"') !== -1) {
                hColumnText = hColumnText.replace(/"/g, '""');
            }

            hColumnText = '"' + hColumnText + '"';

            csv[0].push(hColumnText);

        }

        for (var r = 0; r < rows.length; r++) {
            var cells = rows[r].querySelectorAll('.g-cell');
            var rowOrder = r + 1; // there is already row with index 0
            csv[rowOrder] = [];

            for (var c = 0; c < cells.length; c++) {

                var cellText = cells[c].innerText;
                // Removing line break
                if (cellText.match(/\r|\n/)) {
                    cellText = cellText.replace(/\r|\n/g, ' ');
                }
                // Escaping double quotes and commas
                if (cellText.indexOf('"') !== -1) {
                    cellText = cellText.replace(/"/g, '""');
                }
                cellText = '"' + cellText + '"';
                csv[rowOrder].push(cellText);

            }

            csv[rowOrder] = csv[rowOrder].join(',');
        }

        csv = csv.join('\n');

        return csv;

    };

    module.exports = {
        convertToExcel: convertToExcel,
        convertToCSV: convertToCSV
    }

}());