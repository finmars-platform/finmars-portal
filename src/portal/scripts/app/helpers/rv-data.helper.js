(function () {

    var stringHelper = require('./stringHelper');
    var utilsHelper = require('./utils.helper');
    var evRvCommonHelper = require('./ev-rv-common.helper');
    var metaService = require('../services/metaService');
    var rvSubtotalHelper = require('./rv-subtotal.service');

    var getGroupsByParent = function (parentId, evDataService) {

        var items = evDataService.getDataAsList();

        return items.filter(function (item) {
            return item.___parentId === parentId;
        })

    };

    var calculateItemSubtotal = function (item, evDataService) {

        var columns = evDataService.getColumns();
        var groups = evDataService.getGroups();
        var level = groups.length;

        if (item.___level === level) {

            item.subtotal = rvSubtotalHelper.calculate(item.results, columns);

            evDataService.setData(item);

        } else {

            var items = [];

            var childGroups = getGroupsByParent(item.___id, evDataService);

            childGroups.forEach(function (item) {

                items.push(item.subtotal)

            });

            item.subtotal = rvSubtotalHelper.calculate(items, columns);

            evDataService.setData(item);

        }

    };

    var calculateSubtotals = function (evDataService) {

        var dataList = evDataService.getDataAsList();

        var groups = evDataService.getGroups();
        var level = groups.length;

        // console.log('calculateSubtotals.level', level);

        for (var i = level; i >= 0; i = i - 1) {

            // console.log('calculateSubtotals.current_level', i);

            dataList.forEach(function (item) {

                if (item.___level === i) {
                    calculateItemSubtotal(item, evDataService);
                }

            });

        }

    };

    var insertSubtotalsToResults = function (data, evDataService) {

        var dataList = [];
        var groups = evDataService.getGroups();

        Object.keys(data).forEach(function (key) {
            dataList.push(data[key])
        });


        var subtotalObj;

        dataList.forEach(function (item) {

            if (item.results.length) {

                groups.forEach(function (group, index) {

                    if (item.___level === index + 1 && item.___level <= groups.length) {

                        subtotalObj = Object.assign({}, item.subtotal, {
                            group_name: item.group_name,
                            ___type: 'subtotal',
                            ___parentId: item.___id,
                            ___level: item.___level + 1
                        });

                        if (group.report_settings.subtotal_type === 'line') {

                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                            subtotalObj.___subtotal_type = 'line';

                            item.results.unshift(subtotalObj);

                        }

                        if (group.report_settings.subtotal_type === 'area') {

                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                            subtotalObj.___subtotal_type = 'area';

                            item.results.push(subtotalObj);

                        }

                        if (group.report_settings.subtotal_type === 'arealine') {

                            subtotalObj.___subtotal_type = 'arealine';

                            subtotalObj.___subtotal_subtype = 'line';
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                            // console.log('group.report_settings.subtotal_type before unshift', item.results.length);

                            item.results.unshift(JSON.parse(JSON.stringify(subtotalObj)));

                            subtotalObj.___subtotal_subtype = 'area';
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                            // console.log('group.report_settings.subtotal_type before pusn', item.results.length);

                            item.results.push(subtotalObj);

                            // console.log('group.report_settings.subtotal_type here?', item.results);

                        }


                    }

                })

            }

        });

        // console.log('insertSubtotalsToResults.data', data);

        return data;

    };

    var insertBlankLinesToResults = function (data, evDataService) {

        var dataList = [];
        var groups = evDataService.getGroups();

        Object.keys(data).forEach(function (key) {
            dataList.push(data[key])
        });

        var subtotalObj;

        dataList.forEach(function (item) {

            if (item.results.length) {

                groups.forEach(function (group, index) {

                    if (item.___level === index + 1 && item.___level <= groups.length) {

                        subtotalObj = Object.assign({}, {
                            group_name: item.group_name,
                            ___type: 'blankline',
                            ___parentId: item.___id,
                            ___level: item.___level + 1
                        });


                        if (group.report_settings.blankline_type === 'area') {

                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                            subtotalObj.___blankline_type = 'area';

                            item.results.push(subtotalObj);

                        }

                    }

                })

            }

        });

        return data;

    };

    var removeItemsFromFoldedGroups = function (list, evDataService) {

        var _list = list.concat();

        var foldedGroupsIds = [];

        var groups = evDataService.getGroups();

        _list = _list.filter(function (item) {

            if (item.___type === 'group' && !item.___is_open && item.___parentId) {
                foldedGroupsIds.push(item.___id);
            }

            if (foldedGroupsIds.indexOf(item.___parentId) !== -1) {

                var parentGroup = evDataService.getData(item.___parentId);

                console.log('item', item);
                console.log('parentGroup', parentGroup);

                if (item.___type === 'subtotal') {

                    var linesBeforeExist = false;

                    groups.forEach(function (group, index) {

                        if (index < item.___level - 2 && group.report_settings.subtotal_type === 'line' || group.report_settings.subtotal_type === 'arealine') {
                            linesBeforeExist = true
                        }

                    });

                    if (parentGroup.___parentId && foldedGroupsIds.indexOf(parentGroup.___parentId) !== -1) {

                        if (linesBeforeExist === false) {
                            return true
                        }

                        return false;
                    }

                }

                if (item.___type === 'subtotal' && item.___subtotal_type === 'line') {
                    return true;
                }

                if (item.___type === 'subtotal' && item.___subtotal_type === 'arealine') {
                    if (item.___subtotal_subtype === 'line') {
                        return true;
                    }
                }

                if (item.___type === 'object' && groups[item.___level - 2].report_settings.subtotal_type === 'area') {

                    console.log('parentGroup.results[0].___id', parentGroup.results[0].___id);
                    console.log('item.___id', item.___id);

                    if (parentGroup.results[0].___id === item.___id) {
                        return true;
                    }

                }

                return false;

            }

            return true;

        });

        return _list;

    };

    var getFlatStructure = function (evDataService) {

        var groups = evDataService.getGroups();

        var data;

        // console.log('getFLatStructure.groups', groups);

        if (groups.length) {

            console.time("Calculating subtotals");

            calculateSubtotals(evDataService);

            data = JSON.parse(JSON.stringify(evDataService.getData()));

            data = insertSubtotalsToResults(data, evDataService);

            console.timeEnd("Calculating subtotals");

            console.time("Calculating blankline");

            data = insertBlankLinesToResults(data, evDataService);

            console.timeEnd("Calculating blankline");

            // console.log('data', data);

        } else {
            data = JSON.parse(JSON.stringify(evDataService.getData()));
        }

        var rootGroup = JSON.parse(JSON.stringify(evDataService.getRootGroupData()));

        var tree = utilsHelper.convertToTree(data, rootGroup);

        console.log('getFlatStructure.tree', tree);

        var list = utilsHelper.convertTreeToList(tree);

        console.log('getFlatStructure.list', list);

        list = removeItemsFromFoldedGroups(list, evDataService);

        return list;

    };

    module.exports = {
        getFlatStructure: getFlatStructure
    }


}());