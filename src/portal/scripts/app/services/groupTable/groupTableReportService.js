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
        this.value_options = options.value_options || {};
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

                var groupItem = bootGroupItem.groups[i];

                var groupObject = JSON.parse(JSON.stringify(groupItem));

                if (groupItem.hasOwnProperty('report_settings')) {
                    groupObject.level = i;
                    groupObject.type = groupItem.report_settings.subtotal_type;
                }

                groupObject.value = '';

                cellCaptions.push(groupObject);
            }

            if (bootGroupItem.groups[g].hasOwnProperty('report_settings') && bootGroupItem.groups[g].report_settings.subtotal_type == 'area') {

                cellCaptions[g] = {
                    value: 'Subtotal',
                    type: bootGroupItem.groups[g].report_settings.subtotal_type,
                    level: g
                };

                cellCaptions.forEach(function (cellCaption, $index) {

                    console.log('cellCaption', cellCaption);


                    if (cellCaption.level >= g || $index >= g) {
                        cellCaption.type = bootGroupItem.groups[g].report_settings.subtotal_type;
                        cellCaption.level = g;
                    }

                });

                if (g > 0) {
                    options = {
                        type: 'subtotal',
                        cellsCaptions: [{value: ''}].concat(cellCaptions), // first cell is forInit row
                        value_options: {
                            type: bootGroupItem.groups[g].report_settings.subtotal_type,
                            level: g
                        },
                        value: bootGroupItem.subTotal
                    };


                    subTotalRows.area.push(new Row(options));
                } else {
                    if ($bootGroupIndex == initGroupItem.bootGroup.length - 1 && g == 0) {

                        options = {
                            type: 'subtotal',
                            cellsCaptions: [{value: ''}].concat(cellCaptions), // first cell is forInit row
                            isRootBootGroup: true,
                            value_options: {
                                type: bootGroupItem.groups[g].report_settings.subtotal_type,
                                level: g
                            },
                            value: initGroupItem.subTotal
                        };

                        subTotalRows.area.push(new Row(options));
                    }
                }


            } else {
                if (bootGroupItem.groups[g].hasOwnProperty('report_settings') && bootGroupItem.groups[g].report_settings.subtotal_type == 'line') {

                    cellCaptions[g] = {
                        value: 'Subtotal',
                        type: bootGroupItem.groups[g].report_settings.subtotal_type,
                        level: g
                    };

                    cellCaptions.forEach(function (cellCaption, $index) {

                        console.log(cellCaption);

                        if (cellCaption.hasOwnProperty('level')) {
                            if (cellCaption.level >= g) {
                                cellCaption.type = bootGroupItem.groups[g].report_settings.subtotal_type;
                                cellCaption.level = g;
                            } else {
                                if (cellCaption.level < g) {
                                    cellCaption.type = 'empty';
                                    cellCaption.level = null;
                                }
                            }
                        } else {
                            if ($index > g) {
                                cellCaption.type = bootGroupItem.groups[g].report_settings.subtotal_type;
                                cellCaption.level = g;
                            }
                        }
                    });

                    if (g > 0) {
                        options = {
                            type: 'subtotal-line',
                            cellsCaptions: [{value: ''}].concat(cellCaptions), // first cell is forInit row
                            value_options: {
                                type: bootGroupItem.groups[g].report_settings.subtotal_type,
                                level: g
                            },
                            value: bootGroupItem.subTotal
                        };
                        subTotalRows.line.unshift(new Row(options));
                    } else {
                        if ($bootGroupIndex == initGroupItem.bootGroup.length - 1 && g == 0) {

                            options = {
                                type: 'subtotal-line',
                                cellsCaptions: [{value: ''}].concat(cellCaptions), // first cell is forInit row
                                isRootBootGroup: true,
                                value_options: {
                                    type: bootGroupItem.groups[g].report_settings.subtotal_type,
                                    level: g
                                },
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

                                            var cellCaptionsGroups = [];

                                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                                //console.log('groupItem', groupItem);

                                                var groupObject = JSON.parse(JSON.stringify(groupItem));

                                                if (groupItem.hasOwnProperty('report_settings')) {
                                                    groupObject.level = $index;
                                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                                }

                                                cellCaptionsGroups.push(groupObject);
                                            });

                                            if ($bootGroupIndex !== 0) {
                                                cellCaptionsGroups[0] = {value: ''};
                                            }


                                            options = {
                                                type: 'header',
                                                cellsCaptions: [{value: ''}].concat(cellCaptionsGroups), // first cell is forInit row
                                                value: item
                                            };
                                        } else {

                                            var cellCaptions = [];

                                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                                //console.log('groupItem', groupItem);

                                                var groupObject = {value: ''};

                                                if (groupItem.hasOwnProperty('report_settings')) {
                                                    groupObject.level = $index;
                                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                                }

                                                cellCaptions.push(groupObject);
                                            });

                                            options = {
                                                type: 'normal',
                                                cellsCaptions: [{value: ''}].concat(cellCaptions), // first cell is forInit row
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