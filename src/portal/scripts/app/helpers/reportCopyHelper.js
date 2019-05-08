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

    module.exports = {
        copy: copy
    }

}());