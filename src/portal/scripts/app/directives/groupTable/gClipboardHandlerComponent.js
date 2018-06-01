/**
 * Created by szhitenev on 30.06.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    module.exports = function () {
        return {
            restrict: 'A',
            scope: {
                items: '=',
                columns: '='
            },
            link: function (scope, elem, attrs) {

                var handler = function (e) {

                    if (e) {

                        var copiedItems = [];

                        scope.items.forEach(function (item) {
                            //console.log('item', item);
                            if (item.hasOwnProperty('groups')) {
                                if (item.selectedRow === true) {
                                    copiedItems.push({type: 'group', data: item.groups});
                                }
                                item.items.forEach(function (row) {
                                    //console.log('row', row);
                                    if (row.selectedRow === true) {
                                        copiedItems.push(row);
                                    }
                                })
                            } else {
                                if (item.selectedRow === true) {
                                    copiedItems.push(item);
                                }
                            }
                        });

                        if (copiedItems.length) {
                            //console.log(copiedItems);

                            var result = '<table>';
                            copiedItems.forEach(function (item) {
                                var row = '<tr>';

                                if (item.hasOwnProperty('type')) {
                                    row = row + '<td>' + item.data.map(function (item) {
                                            return item.value
                                        }).join(' ') + '</td>';
                                } else {
                                    scope.columns.forEach(function (column) {
                                        if (column.hasOwnProperty('key')) {
                                            row = row + '<td>' + item[column.key] + '</td>';
                                        } else {
                                            row = row + '<td>' + item[column.name] + '</td>';
                                        }
                                    });
                                }


                                row = row + '</tr>';
                                result = result + row;
                            });
                            result = result + '</table';

                            console.log('result', result);
                            if (e.clipboardData) {
                                e.clipboardData.setData('text/html', result);
                            }
                            console.log('e', e);
                            e.preventDefault(); // We want our data, not data from any selection, to be written to the clipboard
                        }
                    }
                };

                document.addEventListener('copy', handler);

                $(document).bind('copy', handler);

                scope.$on("destroy", function () {
                    $(document).unbind('copy');
                    document.removeEventListener('copy');
                })
            }
        }

    }

}());