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

    function findCellCaptions(item, level, type, reportSettingsType) {

        //console.log('item', item);
        //console.log('type', type);

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

            if (item.groups[0].report_settings && item.groups[0].report_settings.subtotal_type == 'line' && level !== 0) {

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

                // TODO refactor breadcrumbs level?

                if (item.hasOwnProperty('breadcrumbs_level_0') && item['breadcrumbs_level_0'][0].items) {

                    item['breadcrumbs_level_0'].forEach(function (breadCrumbItem) {

                        var cellCaptions = findCellCaptions(item, level);

                        var breadcrumbObj = {
                            cellsCaptions: cellCaptions,
                            value: breadCrumbItem.groups,
                            type: 'breadcrumbs',
                            value_options: {
                                level: level
                            }
                        };

                        resultItems.push(new Row(breadcrumbObj));

                        breadCrumbItem.items.forEach(function (rowItem) {

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
                    })

                } else {

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
            }

            if (item.groups[0].report_settings && item.groups[0].report_settings.subtotal_type == 'area' && level !== 0) {

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

        console.log('transform?');

        var level = 0;
        var resultItems = [];

        findItemRecursive(items, level, resultItems);

        //console.log('result transformed', resultItems);

        return resultItems;
    };

    module.exports = {
        transformItems: transformItems
    }

}());