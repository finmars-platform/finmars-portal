(function () {

    var utilsHelper = require('./utils.helper');
    var evRvCommonHelper = require('./ev-rv-common.helper');
    var rvSubtotalHelper = require('./rv-subtotal.service');
    var evDataHelper = require('./ev-data.helper');
    var metaHelper = require('./meta.helper');

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

        console.log('calculateItemSubtotal.item', item)

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
        var rootGroupOptions = evDataService.getRootGroupOptions();

        Object.keys(data).forEach(function (key) {
            dataList.push(data[key])
        });

        var subtotalObj;

        dataList.forEach(function (item) {

            if (item.results.length) {

                if (item.___level === 0 && rootGroupOptions.subtotal_type) {

                    subtotalObj = Object.assign({}, item.subtotal, {
                        ___group_name: item.___group_name,
                        ___type: 'subtotal',
                        ___parentId: item.___id,
                        ___level: 0
                    });

                    switch (rootGroupOptions.subtotal_type) {
                        case "line":
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);
                            subtotalObj.___subtotal_type = 'line';
                            item.results.unshift(subtotalObj);
                            break;
                        case "area":
                            subtotalObj.___subtotal_type = 'area';
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);
                            item.results.push(subtotalObj);
                            break;
                        case "arealine":
                            subtotalObj.___subtotal_type = 'arealine';

                            subtotalObj.___subtotal_subtype = 'line';
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);
                            item.results.unshift(JSON.parse(JSON.stringify(subtotalObj)));

                            subtotalObj.___subtotal_subtype = 'area';
                            subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);
                            item.results.push(subtotalObj);
                            break;
                    }

                } else {

                    groups.forEach(function (group, index) {

                        if (item.___level === index + 1 && item.___level <= groups.length) {

                            subtotalObj = Object.assign({}, item.subtotal, {
                                ___group_name: item.___group_name,
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

                                subtotalObj.___subtotal_type = 'proxyline';
                                subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                                item.results.unshift(JSON.parse(JSON.stringify(subtotalObj)));


                                subtotalObj.___subtotal_type = 'area';
                                subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);


                                item.results.push(subtotalObj);

                            }

                            if (group.report_settings.subtotal_type === 'arealine') {

                                subtotalObj.___subtotal_type = 'arealine';


                                subtotalObj.___subtotal_subtype = 'line';
                                subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                                item.results.unshift(JSON.parse(JSON.stringify(subtotalObj)));


                                subtotalObj.___subtotal_subtype = 'area';
                                subtotalObj.___id = evRvCommonHelper.getId(subtotalObj);

                                item.results.push(subtotalObj);


                            }


                        }

                    })

                }

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
                            ___group_name: item.___group_name,
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

    var getGroupsIdsToFold = function (list) {

        var result = [];

        list.forEach(function (item) {

            if (item.___type === 'group' && item.___parentId !== null && item.___is_open === false) {
                result.push(item.___id)
            }

        });

        return result;

    };

    var isItemInGroupsToFold = function (groupsIdsToFold, item) {

        return groupsIdsToFold.indexOf(item.___parentId) !== -1

    };

    var lookupProxyline = function (evDataService, list, i) {

        var result = false;

        var groupsToCheck = [];

        for (; i > 0; i = i - 1) {

            if (list[i].___type === 'subtotal' && list[i].___subtotal_type === 'proxyline') {
                groupsToCheck.push(list[i].___parentId);
            } else {
                if (list[i].___type !== 'group') {
                    break;
                }
            }


        }

        groupsToCheck.forEach(function (groupIp) {

            var item = evDataService.getData(groupIp);

            var parent = evDataService.getData(item.___parentId);

            if (parent.___is_open) {
                result = true;
            }

        });


        return result;

    };

    var getItemIndexFromList = function (item, list) {

        var itemIndex;

        for (var i = 0; i < list.length; i = i + 1) {

            if (list[i].___id === item.___id) {
                itemIndex = i;
                break;
            }

        }

        return itemIndex;

    };

    var handleFoldForObject = function (evDataService, item, list) {

        var result = true;

        var currentGroup = evDataService.getData(item.___parentId);

        var itemIndex = getItemIndexFromList(item, list);

        var itemParent;

        for (var x = itemIndex - 1; x > 0; x = x - 1) {

            itemParent = evDataService.getData(list[x].___parentId);

            if (list[x].___type === 'subtotal' && list[x].___subtotal_type === 'proxyline') {

                if (lookupProxyline(evDataService, list, x)) {
                    result = true;
                    break;
                }

            }

            if (list[x].___type === 'object') {
                result = false;
                break;
            }

            if (list[x].___type === 'subtotal' && list[x].___subtotal_type === 'line') {
                result = false;
                break;
            }

            if (itemParent.___is_open === false && list[x].___type === 'subtotal' && list[x].___subtotal_type === 'arealine' && list[x].___subtotal_subtype === 'line') {
                result = false;
                break;
            }

        }


        return result;
    };

    var handleFoldForSubtotal = function (evDataService, item, list) {

        var result = false;

        var currentGroup = evDataService.getData(item.___parentId);
        var parentGroup = evDataService.getData(currentGroup.___parentId);

        var itemIndex = getItemIndexFromList(item, list);

        if (item.___subtotal_type === 'line') {

            if (parentGroup.___is_open) {
                result = true;
            }

            if (lookupProxyline(evDataService, list, itemIndex - 1)) {
                result = true;

            }

        }

        if (item.___subtotal_type === 'arealine' && item.___subtotal_subtype === 'line') {

            if (parentGroup.___is_open) {
                result = true;
            }

            if (lookupProxyline(evDataService, list, itemIndex - 1)) {
                result = true;

            }
        }

        if (item.___subtotal_type === 'area') {
            result = false;
        }

        if (item.___subtotal_type === 'arealine' && item.___subtotal_subtype === 'area') {
            result = false;
        }

        if (item.___subtotal_type === 'proxyline') {
            result = true;
        }

        return result;

    };

    var removeItemsFromFoldedGroups = function (list, evDataService) {

        var result = list.concat();

        var groupsIdsToFold = getGroupsIdsToFold(list);

        result = result.filter(function (item) {

            if (isItemInGroupsToFold(groupsIdsToFold, item)) {

                if (item.___type === 'subtotal') {

                    return handleFoldForSubtotal(evDataService, item, list);

                }

                if (item.___type === 'object') {

                    return handleFoldForObject(evDataService, item, list);

                }

                return false;

            }

            return true;

        });

        return result;

    };

    var isPrimitive = function(value){

        var propertyType = typeof value;

        if (isNaN(value) && propertyType !== 'object' && !Array.isArray(value)) {
            return true
        }

        if (value === null) {
            return true
        }

        if (['string', 'number', 'boolean', 'undefined'].indexOf(propertyType) !== -1) {
            return true
        }


        return false;


    };

    var simpleObjectCopy = function (obj) {

        var result = {};
        var propertyType = {};

        Object.keys(obj).forEach(function (key) {

            propertyType = typeof obj[key];

            if (isPrimitive(obj[key])) {

                result[key] = obj[key]

            } else if (Array.isArray(obj[key])) {

                result[key] = [];

                obj[key].forEach(function (item) {
                    result[key].push(Object.assign({}, item))
                })

            } else if (!Array.isArray(obj[key]) && propertyType === 'object') { // if object

                result[key] = Object.assign({}, obj[key]) // WARNING, Nested objects is not supported

            }


        });

        return result

    };

    var getNewDataInstance = function (evDataService) {

        var sourceData = evDataService.getData();
        var result = {};

        // console.log('sourceData', evDataService.getData());
        // console.log('getNewDataInstance Object.keys(sourceData)', Object.keys(sourceData));

        Object.keys(sourceData).forEach(function (key) {

            result[key] = simpleObjectCopy(sourceData[key]);

        });

        return result;

    };

    var getFlatStructure = function (evDataService) {

        var rootGroupOptions = evDataService.getRootGroupOptions();

        var groups = evDataService.getGroups();

        console.log('getFlatStructure.rootGroupOptions', rootGroupOptions);
        console.log('getFlatStructure.groups', groups);

        var data;

        if (groups.length || rootGroupOptions.subtotal_type) {

            console.time("Calculating subtotals");

            calculateSubtotals(evDataService);

            console.timeEnd("Calculating subtotals");

            console.time("Copying data");

            data = getNewDataInstance(evDataService);

            console.log('data', data);

            console.timeEnd("Copying data");


            console.time("Inserting subtotals");

            data = insertSubtotalsToResults(data, evDataService);

            console.timeEnd("Inserting subtotals");


            console.time("Calculating blankline");

            data = insertBlankLinesToResults(data, evDataService);

            console.timeEnd("Calculating blankline");

            // console.log('data', data);

        } else {
            data = getNewDataInstance(evDataService)
            // data = JSON.parse(JSON.stringify(evDataService.getData()));
            // console.log("d3 service data2", data);
        }

        var rootGroup = simpleObjectCopy(evDataService.getRootGroupData());

        console.time("Converting to tree");

        var tree = utilsHelper.convertToTree(data, rootGroup);

        console.timeEnd("Converting to tree");

        // console.log('getFlatStructure.tree', tree);

        console.time("Converting tree to list");

        var list = utilsHelper.convertTreeToList(tree);

        console.timeEnd("Converting tree to list");

        // console.log('getFlatStructure.list', list);

        list = removeItemsFromFoldedGroups(list, evDataService);

        return list;

    };

    var syncLevelFold = function (evDataService) {

        // console.time('syncLevelFold');

        var groups = evDataService.getGroups();

        // console.log('syncLevelFold.groups', groups);

        if (groups.length) {

            for (var i = 0; i < groups.length; i = i + 1) {

                if (groups[i].report_settings) {

                    if (groups[i].report_settings.is_level_folded === true) {

                        var groupsContent = evDataHelper.getGroupsByLevel(i + 1, evDataService);

                        // console.log('syncLevelFold.groupsContent', groupsContent);

                        groupsContent.forEach(function (groupItem) {
                            groupItem.___is_open = false;

                            var childrens = evDataHelper.getAllChildrenGroups(groupItem.___id, evDataService);

                            // console.log('childrens', childrens);

                            childrens.forEach(function (children) {

                                if (children.___type === 'group') {

                                    var item = evDataService.getData(children.___id);

                                    if (item) {
                                        item.___is_open = false;
                                        evDataService.setData(item);
                                    } else {
                                        children.___is_open = false;
                                        evDataService.setData(children);
                                    }


                                }

                            })


                        });

                        break;

                    }

                }

            }

        }

        console.timeEnd('syncLevelFold');

    };

    var getFlatListFieldUniqueValues = function (flatList, key) {

        var result = [];

        flatList.forEach(function (item) {

            if (flatList.hasOwnProperty(key)) {

                if (result.indexOf(item[key]) === -1) {
                    if (item[key]) {
                        result.push(item[key])
                    }
                }

            }

        });

        return result;
    };

    module.exports = {
        syncLevelFold: syncLevelFold,
        getFlatStructure: getFlatStructure,
        getFlatListFieldUniqueValues: getFlatListFieldUniqueValues
    }


}());