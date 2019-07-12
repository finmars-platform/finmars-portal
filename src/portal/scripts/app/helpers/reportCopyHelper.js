(function () {

    'use strict';

    var convertReportHelper = require('./converters/convertReportHelper');

    var copy = function () {

        var table = convertReportHelper.convertToExcel();

        var listener = function (e) {

            console.log('table', table);

            e.clipboardData.setData('text/html', table);

            e.preventDefault();
        };

        document.addEventListener('copy', listener, false);

        document.execCommand("copy");

        document.removeEventListener('copy', listener, false);


    };

    var copySelected = function () {

        var rows = document.querySelectorAll('.ev-content .g-row.selected');
        var columns = document.querySelectorAll('.g-columns-holder .g-cell');

        var csv = convertReportHelper.convertToCSV(rows, columns);

        var listener = function (e) {

            e.clipboardData.setData('text/plain', csv);

            e.preventDefault();

        };

        document.addEventListener('copy', listener, false);

        document.execCommand("copy");

        document.removeEventListener('copy', listener, false);
    };

    module.exports = {
        copy: copy,
        copySelected: copySelected
    }

}());