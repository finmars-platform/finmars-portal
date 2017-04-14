(function () {

    'use strict';

    var copy = function (event) {

        var rows = document.querySelectorAll('.g-table-body-component group-bind-report-row');

        var table = '<table>';

        var columns = document.querySelectorAll('.g-scroll-wrapper .g-cell');

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

                bg = getComputedStyle(cells[c]).backgroundColor;

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

        var listener = function (e) {

            console.log('table', table);

            e.clipboardData.setData('text/html', table);

            e.preventDefault();
        };

        document.addEventListener('copy', listener, false);

        document.execCommand("copy");

        document.removeEventListener('copy', listener, false);


    };

    module.exports = {
        copy: copy
    }

}());