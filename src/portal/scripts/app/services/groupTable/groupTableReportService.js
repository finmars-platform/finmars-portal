/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    function Row(options) {
        this.type = options.type || 'normal'; // header row, subtotal row, normal row, breadcrumbs, init, preinit
        this.cellsCaptions = options.cellsCaptions || []; // captions for groups
        this.value = options.value; // casual val, or subtotal
    };

    function findSubTotals(bootGroupItem, $bootGroupIndex, initGroupItem) {
        var g;

        var subTotalRows = [];

        for (g = bootGroupItem.groups.length - 1; g >= 0; g = g - 1) {

            var cellCaptions = [];

            for (var i = 0; i < bootGroupItem.groups.length; i = i + 1) {
                cellCaptions.push('');
            }

            //console.log('g', g);

            cellCaptions[g] = 'Subtotal';


            var options;

            if (g > 0) {
                options = {
                    type: 'subtotal',
                    cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                    value: bootGroupItem.subTotal
                };
                subTotalRows.push(new Row(options));
            } else {
                if ($bootGroupIndex == initGroupItem.bootGroup.length - 1 && g == 0) {

                    console.log('1111111111111111111111111111initGroupItem.subTotal', initGroupItem.subTotal);
                    options = {
                        type: 'subtotal',
                        cellsCaptions: [''].concat(cellCaptions), // first cell is forInit row
                        value: initGroupItem.subTotal
                    };
                    subTotalRows.push(new Row(options));
                }
            }


        }

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

                        initGroupItem.bootGroup.forEach(function (bootGroupItem, $bootGroupIndex) {

                            if (bootGroupItem.hasOwnProperty('lineGroup') && bootGroupItem.lineGroup.length) {

                                if (bootGroupItem.lineGroup[0].hasOwnProperty('groups')) {

                                } else {
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

                                        result.push(new Row(options));

                                    });

                                    var subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex, initGroupItem);

                                    result = result.concat(subTotalRows);
                                }

                            }
                        })

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