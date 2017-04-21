/**
 * Created by szhitenev on 02.11.2016.
 */
(function () {

    'use strict';

    function Row(options) {
        this.type = options.type || 'normal'; // header row, subtotal row, normal row, breadcrumbs, init, preinit
        this.cellsCaptions = options.cellsCaptions || []; // captions for groups
        this.value = options.value; // casual val, or subtotal
        this.subTotal = options.subTotal || {};
        this.isRootBootGroup = options.isRootBootGroup || false;
        this.value_options = options.value_options || {};
    }

    function findPreviousGroupsByAncestor(item) {

        var groups = [];

        function findDataInAncestor(ancestorItem) {

            groups.push({
                groups: ancestorItem.groups,
                items: ancestorItem.items,
                level: ancestorItem.level
            });

            if (ancestorItem.hasOwnProperty('_ancestor')) {
                findDataInAncestor(ancestorItem._ancestor);
            }

        }

        if (item.hasOwnProperty('_ancestor')) {
            findDataInAncestor(item._ancestor);
        }

        return groups;

    }

    function findCellCaptions(item, level, type, options) {

        var rowType = type || 'normal';

        var cellCaptions = [];
        var i;
        var cellObj;
        var previousGroups = [];

        if (rowType == 'subtotal') {

            if (options.reportSettingsType == 'area') {

                previousGroups = findPreviousGroupsByAncestor(item);


                //console.log('previousGroups', previousGroups);
                //console.log('item', item);
                if (item.groups.length) {

                    var cellObjType = 'area';

                    if (item.groups.length && item.groups[0].report_settings.subtotal_type) {
                        cellObjType = item.groups[0].report_settings.subtotal_type;
                    }


                    for (i = 0; i < level; i = i + 1) {

                        if (i == level - 1) {
                            cellObj = JSON.parse(JSON.stringify(item.groups[0]));
                            //cellObj._group = item.groups[0];
                            cellObj.comparePattern = item.groups[0].comparePattern;
                            cellObj.type = cellObjType;
                            cellObj.level = level;
                            cellObj.value = '<b>Subtotal</b>';
                        } else {
                            for (g = 0; g < previousGroups.length; g = g + 1) {

                                if (previousGroups[g].level == i) {

                                    cellObj = {};

                                    //console.log('previousGroups[g].items[0]', previousGroups[g].items[0]);
                                    //console.log('item.', item);

                                    if (previousGroups[g].items[0]._lid == item.items[0]._lid) {
                                        cellObj = JSON.parse(JSON.stringify(previousGroups[g].groups[0]));
                                    }


                                    //cellObj._group = previousGroups[g].groups[0];
                                    cellObj.comparePattern = previousGroups[g].groups[0].comparePattern;
                                    cellObj.type = cellObjType;
                                    cellObj.level = i + 1;
                                    cellObj.value = '';
                                }
                            }

                        }

                        cellCaptions.push(cellObj);

                    }

                }

                //for (i = 1; i <= level; i = i + 1) {
                //
                //
                //    cellObj = {
                //        value: '',
                //        //_group: item.groups[0],
                //        comparePattern: item.groups[0].comparePattern,
                //        type: item.groups[0].report_settings.subtotal_type,
                //        level: i
                //    };
                //
                //
                //    if (i == level) {
                //        cellObj.value = 'Subtotal';
                //        cellObj.level = level;
                //    }
                //
                //
                //    cellCaptions.push(cellObj);
                //
                //}
            } else {

                if (options.reportSettingsType == 'line') {
                    level = level - 1;

                    if (level > 0) {
                        for (i = 0; i <= level; i = i + 1) {

                            cellObj = {
                                value: '',
                                //_group: item.groups[0],
                                comparePattern: item.groups[0].comparePattern,
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

        }

        if (rowType == 'breadcrumb') {


            previousGroups = findPreviousGroupsByAncestor(item);

            //console.log('BREACRUMB', item);

            var g;

            for (i = 0; i < level; i = i + 1) {

                if (i == level - 1) {
                    cellObj = item.groups[0];
                    cellObj.comparePattern = item.groups[0].comparePattern;
                    cellObj.type = 'area';
                    if (item.groups[0].report_settings) {
                        cellObj.type = item.groups[0].report_settings.subtotal_type;
                    }
                    cellObj.level = level;
                } else {
                    if (previousGroups.length) {
                        for (g = 0; g < previousGroups.length; g = g + 1) {

                            if (previousGroups[g].level == i) {
                                cellObj = previousGroups[g].groups[0];
                                cellObj.comparePattern = previousGroups[g].groups[0].comparePattern;
                                cellObj.type = previousGroups[g].groups[0].report_settings.subtotal_type;
                                cellObj.level = i + 1;
                            }
                        }
                    }

                }


                cellCaptions.push(cellObj);

                //console.log('cellCaptions', cellCaptions);

            }
        }

        if (rowType == 'normal') {

            //console.log('item', item);

            if (item.hasOwnProperty('breadcrumbs_level_0') && item.breadcrumbs_level_0.length && item.breadcrumbs_level_0[0].hasOwnProperty('groups')) {

                for (i = 1; i <= level; i = i + 1) {

                    var type = 'area';

                    if (item.groups[0].report_settings) {
                        type = item.groups[0].report_settings.subtotal_type;
                    }

                    cellObj = {
                        value: '',
                        comparePattern: item.groups[0].comparePattern,
                        //_group: item.groups[0],
                        subTotal: item.subTotal,
                        type: type,
                        level: i
                    };


                    if (i == level) {
                        cellObj.level = level;
                    }


                    cellCaptions.push(cellObj);

                }

            } else {

                previousGroups = findPreviousGroupsByAncestor(item);

                //console.log('previousGroups', previousGroups);
                //console.log('item', item);
                //console.log('options', options);
                if (item.groups.length) {

                    var cellObjType = 'area';

                    if (item.groups.length && item.groups[0].report_settings && item.groups[0].report_settings.subtotal_type) {
                        cellObjType = item.groups[0].report_settings.subtotal_type;
                    }


                    for (i = 0; i < level; i = i + 1) {

                        if (i == level - 1) {
                            cellObj = JSON.parse(JSON.stringify(item.groups[0]));
                            //cellObj._group = item.groups[0];
                            cellObj.comparePattern = item.groups[0].comparePattern;
                            cellObj.type = cellObjType;
                            cellObj.subTotal = item.groups[0].subTotal;
                            cellObj.level = level;
                            if (options.itemIndex != 0) {
                                cellObj.value = '';
                            }
                        } else {
                            for (g = 0; g < previousGroups.length; g = g + 1) {

                                if (previousGroups[g].level == i) {

                                    cellObj = {};

                                    //console.log('previousGroups[g].items[0]', previousGroups[g].items[0]);
                                    //console.log('item.', item);

                                    if (previousGroups[g].items[0]._lid == item.items[0]._lid) {
                                        cellObj = JSON.parse(JSON.stringify(previousGroups[g].groups[0]));
                                    }

                                    //console.log('previousGroups[g]', previousGroups[g]);

                                    //cellObj._group = previousGroups[g].groups[0];
                                    cellObj.comparePattern = previousGroups[g].groups[0].comparePattern;
                                    cellObj.type = cellObjType;
                                    cellObj.subTotal = previousGroups[g].groups[0].subTotal;
                                    cellObj.level = i + 1;
                                    //cellObj.itemIndex = options.itemIndex;

                                    if (options.itemIndex != 0) {
                                        cellObj.value = '';
                                    }
                                }
                            }

                        }

                        cellCaptions.push(cellObj);

                    }

                }
            }
        }

        return cellCaptions;

    }

    function findItemRecursive(items, level, resultItems) {

        //console.log('items', items);

        items.forEach(function (item) {

            var cellCaptions, obj;


            // If we don't have boot_level_0, so we are on the boot_level_0
            // and we don't have preInit breadcrumbs

            if (!item.hasOwnProperty('boot_level_' + level)) {
                if (level == 0) {
                    level = level + 1;
                }
            }

            // if item have top-line group subtotal start,

            if (item.hasOwnProperty('groups') && item.groups.length) {
                if (item.groups[0].report_settings && item.groups[0].report_settings.subtotal_type == 'line' && level !== 0) {

                    cellCaptions = findCellCaptions(item, level, 'subtotal', {reportSettingsType: 'line'});

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
            }


            // if item have top-line group subtotal start end


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

            // if we have preInit groups end

            // go deeper

            if (item.hasOwnProperty('boot_level_' + level)) {

                findItemRecursive(item['boot_level_' + level], level + 1, resultItems);

            } else {

                // or if bootGroups.length == 1, bring just breadcrumbs lines

                //console.log('item', item);

                // TODO refactor breadcrumbs level?

                if (item.hasOwnProperty('breadcrumbs_level_0') && item['breadcrumbs_level_0'][0].items) {

                    //console.log("item['breadcrumbs_level_0']", item['breadcrumbs_level_0']);

                    item['breadcrumbs_level_0'].forEach(function (breadCrumbItem, breadcrumbIndex) {

                        var cellCaptions = findCellCaptions(item, level, 'breadcrumb', {inGroupIndex: breadcrumbIndex});

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

                            var cellCaptions = findCellCaptions(item, level, 'normal');

                            var obj = {
                                cellsCaptions: cellCaptions,
                                value: rowItem,
                                subTotal: item.subTotal,
                                value_options: {
                                    level: level
                                }
                            };

                            resultItems.push(new Row(obj));

                        });
                    })

                } else {

                    if (item.hasOwnProperty('items') && item.items.length) {

                        item.items.forEach(function (rowItem, $itemIndex) {

                            var cellCaptions = findCellCaptions(item, level, 'normal', {itemIndex: $itemIndex});

                            var obj = {
                                cellsCaptions: cellCaptions,
                                value: rowItem,
                                subTotal: item.subTotal,
                                value_options: {
                                    level: level
                                }
                            };

                            resultItems.push(new Row(obj));

                        });
                    }
                }
            }

            // if group have area subtotal, do it, start

            //console.log('-------------------------------------------------------', item.groups[0]);

            if (item.hasOwnProperty('groups') && item.groups.length) {
                if (item.groups[0].report_settings && item.groups[0].report_settings.subtotal_type == 'area' && level !== 0) {

                    cellCaptions = findCellCaptions(item, level, 'subtotal', {reportSettingsType: 'area'});

                    obj = {
                        cellsCaptions: cellCaptions,
                        value: item.subTotal,
                        type: 'subtotal',
                        value_options: {
                            type: item.groups[0].report_settings.subtotal_type,
                            level: level
                        }
                    };

                    //console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', obj);

                    resultItems.push(new Row(obj));
                }
            }

            // if group have area subtotal, do it, end

        })

    }

    var transformItems = function (items) {

        //console.trace();

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