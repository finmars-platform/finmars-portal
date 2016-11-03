/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    function Row(options) {
        this.type = options.type || 'normal'; // header row, subtotal row, normal row, breadcrumbs, init, preinit
        this.cellsCaptions = options.cellsCaptions || []; // captions for groups
        this.value = options.value; // casual val, or subtotal
        this.isRootBootGroup = options.isRootBootGroup || false;
    };

    function findSubTotals(bootGroupItem, $bootGroupIndex, initGroupItem) {
        var g;

        var subTotalRows = {area: [], line: []};

        var groupsLength = bootGroupItem.groups.length - 1;
        var currentIndex = 0;

        for (g = groupsLength; g >= 0; g = g - 1) {

            var cellCaptions = [];
            var options;
            currentIndex = currentIndex + 1;

            for (var i = 0; i < bootGroupItem.groups.length; i = i + 1) {
                cellCaptions.push('');
            }

            if (bootGroupItem.groups[g].hasOwnProperty('report_settings') && bootGroupItem.groups[g].report_settings.subtotal_type == 'area') {

                cellCaptions[g] = 'Subtotal';

                if (g > 0) {
                    options = {
                        type: 'subtotal',
                        cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row

                        value: bootGroupItem.subTotal
                    };
                    subTotalRows.area.push(new Row(options));
                } else {
                    if ($bootGroupIndex == initGroupItem.bootGroup.length - 1 && g == 0) {

                        options = {
                            type: 'subtotal',
                            cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                            isRootBootGroup: true,
                            value: initGroupItem.subTotal
                        };
                        subTotalRows.area.push(new Row(options));
                    }
                }
            } else {
                if (bootGroupItem.groups[g].hasOwnProperty('report_settings') && bootGroupItem.groups[g].report_settings.subtotal_type == 'line') {
                    cellCaptions[g] = 'Test';

                    if (g > 0) {
                        options = {
                            type: 'subtotal-line',
                            cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                            value: bootGroupItem.subTotal
                        };
                        subTotalRows.line.unshift(new Row(options));
                    } else {
                        if ($bootGroupIndex == initGroupItem.bootGroup.length - 1 && g == 0) {

                            options = {
                                type: 'subtotal-line',
                                cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                                isRootBootGroup: true,
                                value: initGroupItem.subTotal
                            };
                            subTotalRows.line.unshift(new Row(options));
                        }
                    }
                }
            }

        }

        //console.log('subTotalRows', subTotalRows);

        return subTotalRows;
    }

    var transformItems = function (items) {

        var result = [];

        items.forEach(function (rootItem) {

            if (rootItem.hasOwnProperty('groups') && rootItem.groups.length) {

                var options = {
                    type: 'preinit',
                    cellsCaptions: [],
                    value: rootItem.groups
                };
                result.push(new Row(options));
            }

            if (rootItem.hasOwnProperty('initGroup') && rootItem.initGroup.length) {

                rootItem.initGroup.forEach(function (initGroupItem) {

                    var options = {
                        type: 'init',
                        cellsCaptions: [],
                        value: initGroupItem.groups
                    };

                    result.push(new Row(options));

                    if (initGroupItem.hasOwnProperty('bootGroup') && initGroupItem.hasOwnProperty('bootGroup')) {

                        var bootGroupResult = [];
                        var bootGroupResultRooted = [];

                        initGroupItem.bootGroup.forEach(function (bootGroupItem, $bootGroupIndex) {

                            var localBootGroupResult = [];
                            bootGroupResultRooted = [];

                            if (bootGroupItem.hasOwnProperty('lineGroup') && bootGroupItem.lineGroup.length) {

                                if (bootGroupItem.lineGroup[0].hasOwnProperty('groups')) {

                                } else {

                                    //console.log('bootGroupItem', bootGroupItem);

                                    bootGroupItem.items.forEach(function (item, $index) {

                                        var options = {};
                                        if ($index == 0) {

                                            var cellCaptionsGroups = JSON.parse(JSON.stringify(bootGroupItem.groups));

                                            if ($bootGroupIndex !== 0) {
                                                cellCaptionsGroups[0] = '';
                                            }

                                            options = {
                                                type: 'header',
                                                cellsCaptions: [''].concat(cellCaptionsGroups), // first cell is forInit row
                                                value: item
                                            };
                                        } else {

                                            var cellCaptions = [];

                                            bootGroupItem.groups.forEach(function () {
                                                cellCaptions.push('');
                                            });

                                            options = {
                                                type: 'normal',
                                                cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                                                value: item
                                            };
                                        }

                                        localBootGroupResult.push(new Row(options));

                                    });

                                    var subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex, initGroupItem);

                                    localBootGroupResult = localBootGroupResult.concat(subTotalRows.area);
                                    localBootGroupResult = subTotalRows.line.concat(localBootGroupResult);
                                }

                            }

                            bootGroupResult = bootGroupResult.concat(localBootGroupResult);

                            bootGroupResult.forEach(function (bootGroupResultItem) {

                                if (bootGroupResultItem.hasOwnProperty('isRootBootGroup')
                                    && bootGroupResultItem.isRootBootGroup == true
                                    && bootGroupResultItem.type == 'subtotal-line') {
                                    bootGroupResultRooted.unshift(bootGroupResultItem);
                                } else {
                                    bootGroupResultRooted.push(bootGroupResultItem);
                                }

                            });

                        });

                        result = result.concat(bootGroupResultRooted);

                    } else {
                        options = {
                            type: 'normal',
                            cellsCaptions: [],
                            value: initGroupItem.items
                        };
                        result.push(new Row(options));
                    }


                })

            } else {
                options = {
                    type: 'normal',
                    cellsCaptions: [],
                    value: rootItem.items
                };
                result.push(new Row(options));
            }

        });


        return result;
    };

    module.exports = {
        transformItems: transformItems
    }

}());