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
    }

    function findSubTotals(bootGroupItem, $bootGroupIndex) {
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

                    //console.log('cellCaption', cellCaption);


                    if (cellCaption.level >= g || $index >= g) {
                        cellCaption.type = bootGroupItem.groups[g].report_settings.subtotal_type;
                        cellCaption.level = g;
                    }

                });

                var isRootBootGroup = false;

                if ($bootGroupIndex == 0) {
                    isRootBootGroup = true;
                }


                options = {
                    type: 'subtotal',
                    cellsCaptions: cellCaptions,
                    isRootBootGroup: isRootBootGroup,
                    value_options: {
                        type: bootGroupItem.groups[g].report_settings.subtotal_type,
                        level: g
                    },
                    value: bootGroupItem.subTotal
                };

                subTotalRows.area.push(new Row(options));


            } else {
                if (bootGroupItem.groups[g].hasOwnProperty('report_settings') && bootGroupItem.groups[g].report_settings.subtotal_type == 'line') {

                    cellCaptions[g] = {
                        value: 'Subtotal',
                        type: bootGroupItem.groups[g].report_settings.subtotal_type,
                        level: g
                    };

                    cellCaptions.forEach(function (cellCaption, $index) {

                        //console.log(cellCaption);

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


                    options = {
                        type: 'subtotal-line',
                        cellsCaptions: cellCaptions,
                        value_options: {
                            type: bootGroupItem.groups[g].report_settings.subtotal_type,
                            level: g
                        },
                        value: bootGroupItem.subTotal
                    };
                    subTotalRows.line.unshift(new Row(options));

                }
            }

        }

        //console.log('subTotalRows', subTotalRows);

        return subTotalRows;
    }

    var transformItems = function (items) {

        var result = [];


        if (items[0].hasOwnProperty('bootGroup')) {

            var bootGroupResultRooted = [];

            items.forEach(function (preInitGroupItem) {

                var options = {
                    type: 'preinit',
                    cellsCaptions: [],
                    value: preInitGroupItem.groups
                };

                result.push(new Row(options));

                if (preInitGroupItem.hasOwnProperty('bootGroup') && preInitGroupItem.hasOwnProperty('bootGroup')) {


                    if (preInitGroupItem.bootGroup[0].hasOwnProperty('groups')) {

                        var bootGroupResult = [];
                        var bootGroupResultRooted = [];

                        preInitGroupItem.bootGroup.forEach(function (bootGroupItem, $bootGroupIndex) {

                            var localBootGroupResult = [];
                            var subTotalRows;
                            bootGroupResultRooted = [];

                            if (bootGroupItem.hasOwnProperty('lineGroup') && bootGroupItem.lineGroup.length) {

                                if (bootGroupItem.lineGroup[0].hasOwnProperty('groups')) {

                                    bootGroupItem.lineGroup.forEach(function (lineGroupItem, $lineGroupIndex) {

                                        //console.log('lineGroupItem.items', lineGroupItem.items);

                                        var cellCaptions = [];

                                        bootGroupItem.groups.forEach(function (groupItem, $index) {

                                            var groupObject = {value: ''};

                                            //if ($index == 0 && $lineGroupIndex == 0) {
                                            //    groupObject = groupItem;
                                            //}

                                            if (groupItem.hasOwnProperty('report_settings')) {
                                                groupObject.level = $index;
                                                groupObject.type = groupItem.report_settings.subtotal_type;
                                            }

                                            cellCaptions.push(groupObject);
                                        });

                                        var options = {
                                            type: 'breadcrumbs',
                                            cellsCaptions: cellCaptions,
                                            value: lineGroupItem.groups
                                        };

                                        bootGroupResult.push(new Row(options));

                                        lineGroupItem.items.forEach(function (item, $index) {

                                            var itemCellCaptions = [];
                                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                                var groupObject = {value: ''};

                                                if (groupItem.hasOwnProperty('report_settings')) {
                                                    groupObject.level = $index;
                                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                                }

                                                itemCellCaptions.push(groupObject);
                                            });

                                            options = {
                                                type: 'normal',
                                                cellsCaptions: itemCellCaptions,
                                                value: item
                                            };

                                            bootGroupResult.push(new Row(options));


                                        });

                                    });

                                    subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex);

                                    localBootGroupResult = localBootGroupResult.concat(subTotalRows.area);
                                    localBootGroupResult = subTotalRows.line.concat(localBootGroupResult);

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

                                } else {


                                    bootGroupItem.items.forEach(function (item, $index) {

                                        var options = {};
                                        if ($index == 0) {

                                            var cellCaptionsGroups = [];

                                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                                //console.log('groupItem', groupItem);

                                                var groupObject = JSON.parse(JSON.stringify(groupItem));

                                                if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                                    groupObject.level = $index;
                                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                                }

                                                cellCaptionsGroups.push(groupObject);
                                            });

                                            //if ($bootGroupIndex !== 0) {
                                            //    cellCaptionsGroups[0] = {value: ''};
                                            //}


                                            options = {
                                                type: 'header',
                                                cellsCaptions: cellCaptionsGroups,
                                                value: item
                                            };
                                        } else {

                                            var cellCaptions = [];

                                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                                //console.log('groupItem', groupItem);

                                                var groupObject = {value: ''};

                                                if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                                    groupObject.level = $index;
                                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                                }

                                                cellCaptions.push(groupObject);
                                            });

                                            options = {
                                                type: 'normal',
                                                cellsCaptions: cellCaptions,
                                                value: item
                                            };
                                        }

                                        localBootGroupResult.push(new Row(options));

                                    });

                                    subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex);

                                    localBootGroupResult = localBootGroupResult.concat(subTotalRows.area);
                                    localBootGroupResult = subTotalRows.line.concat(localBootGroupResult);

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

                                    //console.log('bootGroupResultRooted', bootGroupResultRooted);

                                }
                                //result = result.concat(bootGroupResultRooted);

                            }
                        });

                        result = result.concat(bootGroupResultRooted);
                    }

                }
            });


        } else {

            var bootGroupResultRooted = [];

            items.forEach(function (bootGroupItem, $bootGroupIndex) {

                var localBootGroupResult = [];
                var subTotalRows;
                var bootGroupResult = [];

                if (bootGroupItem.hasOwnProperty('lineGroup') && bootGroupItem.lineGroup.length) {

                    if (bootGroupItem.lineGroup[0].hasOwnProperty('groups')) {

                        bootGroupItem.lineGroup.forEach(function (lineGroupItem, $lineGroupIndex) {

                            //console.log('lineGroupItem.items', lineGroupItem.items);

                            var cellCaptions = [];

                            bootGroupItem.groups.forEach(function (groupItem, $index) {

                                var groupObject = {value: ''};

                                if ($index == 0 && $lineGroupIndex == 0) {
                                    groupObject = groupItem;
                                }

                                //console.log('groupItem', groupItem);

                                if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                    groupObject.level = $index;
                                    groupObject.type = groupItem.report_settings.subtotal_type;
                                }

                                cellCaptions.push(groupObject);
                            });

                            var options = {
                                type: 'breadcrumbs',
                                cellsCaptions: cellCaptions,
                                value: lineGroupItem.groups
                            };

                            bootGroupResult.push(new Row(options));

                            lineGroupItem.items.forEach(function (item, $index) {

                                var itemCellCaptions = [];
                                bootGroupItem.groups.forEach(function (groupItem, $index) {

                                    var groupObject = {value: ''};

                                    if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                        groupObject.level = $index;
                                        groupObject.type = groupItem.report_settings.subtotal_type;
                                    }

                                    itemCellCaptions.push(groupObject);
                                });

                                options = {
                                    type: 'normal',
                                    cellsCaptions: itemCellCaptions,
                                    value: item
                                };

                                bootGroupResult.push(new Row(options));

                            });

                        });

                        subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex);

                        //console.log('subTotalRows', subTotalRows);

                        localBootGroupResult = localBootGroupResult.concat(subTotalRows.area);
                        localBootGroupResult = subTotalRows.line.concat(localBootGroupResult);

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

                    } else {

                        bootGroupItem.items.forEach(function (item, $index) {

                            var options = {};
                            if ($index == 0) {

                                var cellCaptionsGroups = [];

                                bootGroupItem.groups.forEach(function (groupItem, $groupIndex) {

                                    //console.log('groupItem', groupItem);

                                    var groupObject = JSON.parse(JSON.stringify(groupItem));

                                    if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                        groupObject.level = $groupIndex;
                                        groupObject.type = groupItem.report_settings.subtotal_type;
                                    }

                                    cellCaptionsGroups.push(groupObject);
                                });

                                options = {
                                    type: 'header',
                                    cellsCaptions: cellCaptionsGroups,
                                    value: item
                                };
                            } else {

                                var cellCaptions = [];

                                bootGroupItem.groups.forEach(function (groupItem, $groupIndex) {

                                    var groupObject = JSON.parse(JSON.stringify(groupItem));

                                    if (groupItem && groupItem.hasOwnProperty('report_settings')) {
                                        groupObject.level = $groupIndex;
                                        groupObject.type = groupItem.report_settings.subtotal_type;
                                    }

                                    cellCaptions.push(groupObject);
                                });

                                options = {
                                    type: 'normal',
                                    cellsCaptions: cellCaptions,
                                    value: item
                                };
                            }

                            localBootGroupResult.push(new Row(options));

                        });

                        subTotalRows = findSubTotals(bootGroupItem, $bootGroupIndex);

                        //console.log('subTotalRows', subTotalRows);

                        localBootGroupResult = localBootGroupResult.concat(subTotalRows.area);
                        localBootGroupResult = subTotalRows.line.concat(localBootGroupResult);

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

                    }

                }

            });

            result = result.concat(bootGroupResultRooted);
        }

        //console.log('result transformed', result);

        return result;
    };

    module.exports = {
        transformItems: transformItems
    }

}());