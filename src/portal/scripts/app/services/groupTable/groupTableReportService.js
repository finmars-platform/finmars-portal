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


        //console.log('bootGroupItem', bootGroupItem);

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

                if ($bootGroupIndex == 0 && currentIndex == 0) {
                    //isRootBootGroup = true;
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

    function findCellCaptions(item, level, type, reportSettingsType) {

        var rowType = type || 'normal';

        var cellCaptions = [];
        var i;
        var cellObj;

        if (rowType == 'subtotal') {

            if (reportSettingsType == 'area') {

                for (i = 1; i <= level; i = i + 1) {

                    cellObj = {
                        value: '',
                        type: item.groups[0].report_settings.subtotal_type,
                        level: i
                    };


                    if (i == level) {
                        cellObj.value = 'Subtotal';
                        cellObj.level = level;
                    }


                    cellCaptions.push(cellObj);

                }

            } else {

                level = level - 1;

                console.log('level1231312321', level);
                if (level > 0) {
                    for (i = 0; i <= level; i = i + 1) {

                        cellObj = {
                            value: '',
                            type: item.groups[0].report_settings.subtotal_type
                        };

                        if (i == level) {
                            cellObj.level = level + 1;
                        }

                        cellCaptions.push(cellObj);

                    }
                }
            }

        }

        if (rowType == 'normal') {
            for (i = 1; i <= level; i = i + 1) {

                cellObj = {
                    value: '',
                    type: item.groups[0].report_settings.subtotal_type,
                    level: i
                };


                if (i == level) {
                    cellObj.level = level;
                }


                cellCaptions.push(cellObj);

            }
        }

        return cellCaptions;

    }

    function findItemRecursive(items, level, resultItems) {

        //console.log('items', items);

        items.forEach(function (item) {

            var cellCaptions, obj;

            if (!item.hasOwnProperty('boot_level_' + level)) {
                if (level == 0) {
                    level = level + 1;
                }
            }

            if (item.groups[0].report_settings.subtotal_type == 'line' && level !== 0) {

                cellCaptions = findCellCaptions(item, level, 'subtotal', 'line');

                obj = {
                    cellsCaptions: cellCaptions,
                    value: item.subTotal,
                    type: 'subtotal-line',
                    value_options: {
                        type: item.groups[0].report_settings.subtotal_type,
                        level: level
                    }
                };

                resultItems.push(new Row(obj));
            }

            if (level == 0) {
                cellCaptions = findCellCaptions(item, level);

                obj = {
                    cellsCaptions: cellCaptions,
                    value: item.groups,
                    type: 'preinit',
                    value_options: {
                        level: level
                    }
                };

                resultItems.push(new Row(obj));
            }

            if (item.hasOwnProperty('boot_level_' + level)) {

                findItemRecursive(item['boot_level_' + level], level + 1, resultItems);

            } else {

                //console.log('item', item);

                item.items.forEach(function (rowItem) {

                    var cellCaptions = findCellCaptions(item, level);

                    var obj = {
                        cellsCaptions: cellCaptions,
                        value: rowItem,
                        value_options: {
                            level: level
                        }
                    };

                    resultItems.push(new Row(obj));

                });
            }

            if (item.groups[0].report_settings.subtotal_type == 'area' && level !== 0) {

                cellCaptions = findCellCaptions(item, level, 'subtotal', 'area');

                obj = {
                    cellsCaptions: cellCaptions,
                    value: item.subTotal,
                    type: 'subtotal',
                    value_options: {
                        type: item.groups[0].report_settings.subtotal_type,
                        level: level
                    }
                };

                resultItems.push(new Row(obj));
            }

        })

    }

    var transformItems = function (items) {

        var level = 0;
        var resultItems = [];

        findItemRecursive(items, level, resultItems);

        console.log('result transformed', resultItems);

        return resultItems;
    };

    module.exports = {
        transformItems: transformItems
    }

}());