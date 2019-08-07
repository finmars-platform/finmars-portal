(function () {

    'use strict';

    var convertReportHelper = require('./converters/convertReportHelper');

    /*var copy = function () {

        var table = convertReportHelper.convertToExcel();

        var listener = function (e) {

            console.log('table', table);

            e.clipboardData.setData('text/html', table);

            e.preventDefault();
        };

        document.addEventListener('copy', listener, false);

        document.execCommand("copy");

        document.removeEventListener('copy', listener, false);


    };*/

    var copy = function (evDataService, isReport, copyType) {

        /*var rows = document.querySelectorAll('.ev-content .g-row.selected');
        var columns = document.querySelectorAll('.g-columns-holder .g-cell');*/

        var flatList = evDataService.getFlatList();
        // console.log("conversion falt list", flatList);

        /*flatList.forEach(function(item){

            if (item.___type === 'subtotal') {
                var parentGroup = evDataService.getData(item.___parentId)
                console.log("conversion parentGroup", parentGroup);
            }

        });*/

        if (copyType === 'selected') {
            flatList = flatList.filter(function (row) {
                return row.___is_activated;
            });
        }

        if (flatList.length) {
            var columns = evDataService.getColumns();
            var groups  = evDataService.getGroups();

            var table = convertReportHelper.convertFlatListToExcel(flatList, columns, isReport, groups.length);

            var listener = function (e) {

                // console.log('covert copy selected csv', csv);

                e.clipboardData.setData('text/plain', table);

                e.preventDefault();

            };

            document.addEventListener('copy', listener, false);

            document.execCommand("copy");

            document.removeEventListener('copy', listener, false);
        }

    };

    module.exports = {
        copy: copy
    }

}());