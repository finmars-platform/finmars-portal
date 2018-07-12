(function () {

    var stringHelper = require('./stringHelper');
    var utilsHelper = require('./utils.helper');
    var metaService = require('../services/metaService');

    var getNextPage = function (options, event, entityViewerDataService) {

        var _options = Object.assign({}, options);

        var groupData;

        if (!event.___id) {
            groupData = entityViewerDataService.getRootGroupData();
        } else {
            groupData = entityViewerDataService.getData(event.___id);
        }

        if (!groupData) {
            return _options.page;
        }

        console.log('groupData', groupData);

        if (groupData.___parentId === null && groupData.next === null && groupData.results.length === 0) {
            _options.page = _options.page + 1;
        } else {

            console.log('NOT ROOT GROUP', groupData.next);

            if (groupData.next) {

                console.log('INCREMENT PAGE');

                _options.page = _options.page + 1;
            }
        }

        console.log('getNextPage._options.page', _options.page);

        return _options.page;

    };

    var ifFirstRequestForRootGroup = function (event, evDataService) {

        var groupData;

        if (!event.___id) {
            groupData = evDataService.getRootGroupData();
        } else {
            groupData = evDataService.getData(event.___id);
        }

        if (!groupData) {
            return false;
        }

        return !groupData.___parentId && !groupData.results.length;

    };

    var isFirstRequestForObjects = function (event, evDataService) {

        var groupData;

        if (!event.___id) {
            groupData = evDataService.getRootGroupData();
        } else {
            groupData = evDataService.getData(event.___id);
        }

        if (!groupData) {
            return true;
        }

        return false;

    };

    var getGroupNameFromParent = function (id, parentId, evDataService) {

        var parent = evDataService.getData(parentId);

        var result = parent.results.find(function (item) {

            return item.___id === id;

        });

        return result.group_name

    };

    var getGroupIdFromParent = function (id, parentId, evDataService) {

        var parent = evDataService.getData(parentId);

        var result = parent.results.find(function (item) {

            return item.___id === id;

        });

        if (result.group_id) return result.group_id;

        return null;

    };

    var _getParent = function (parentId, evDataService, results) {

        var item = evDataService.getData(parentId);

        results.push(item);

        if (item.___parentId !== null) {

            _getParent(item.___parentId, evDataService, results);

        }

        return results;

    };

    var getParents = function (parentId, evDataService) {

        var results = [];

        results = _getParent(parentId, evDataService, results);

        return results;

    };

    var _getChildrenGroups = function (parentGroupId, evDataService, results) {

        var item = evDataService.getData(parentGroupId);

        if (item && item.___type === 'group' && item.results) {

            item.results.forEach(function (child) {

                results.push(child);

                _getChildrenGroups(child.___id, evDataService, results);

            })

        }


    };

    var getAllChildrenGroups = function (parentGroupId, evDataService) {

        var results = [];

        _getChildrenGroups(parentGroupId, evDataService, results);

        return results

    };

    var getObject = function (objectId, parentGroupHashId, evDataService) {

        var parent = evDataService.getData(parentGroupHashId);

        var result;

        parent.results.forEach(function (item) {

            if (item.___id === objectId) {
                result = item;
            }

        });

        return result

    };

    var getEvId = function (item) {

        var pattern;

        if (item.___type === 'group') {

            pattern = [item.___parentId, stringHelper.toHash(item.group_name)].join('');

        }

        if (item.___type === 'object') {

            pattern = [item.___parentId, stringHelper.toHash(item.id)].join('');

        }

        return stringHelper.toHash(pattern)

    };

    var getGroupTypeId = function (groupType) {

        var pattern;

        if (groupType.hasOwnProperty('key')) {

            pattern = [groupType.name, stringHelper.toHash(groupType.key)].join('');

        }

        if (groupType.hasOwnProperty('id')) {

            pattern = [groupType.name, stringHelper.toHash(groupType.id)].join('');

        }

        return stringHelper.toHash(pattern)

    };

    var getColumnId = function (column) {

        var pattern;

        if (column.hasOwnProperty('key')) {

            pattern = [column.name, stringHelper.toHash(column.key)].join('');

        }

        if (column.hasOwnProperty('id')) {

            pattern = [column.name, stringHelper.toHash(column.id)].join('');

        }

        return stringHelper.toHash(pattern)

    };


    var getGroupTypes = function (id, parentId, evDataService) {

        var result = [];

        var groups = evDataService.getGroups();

        var parentsCount = getParents(parentId, evDataService).length;

        var groupsCount;

        if (groups.length > parentsCount) {
            groupsCount = parentsCount + 1;
        } else {
            groupsCount = parentsCount;
        }

        for (var i = 0; i < groupsCount; i = i + 1) {

            if (groups[i].key) {
                result.push(groups[i].key)
            }

            if (groups[i].id) {
                result.push(groups[i].id)
            }
        }

        return result;

    };

    var getGroupValues = function (id, parentId, evDataService) {

        var parents = getParents(parentId, evDataService).reverse();

        var result = [];

        for (var i = 0; i < parents.length; i = i + 1) {

            if (parents[i].___parentId !== null) {

                if (parents[i].group_id) {
                    result.push(parents[i].group_id)
                } else {
                    result.push(parents[i].group_name)
                }

            }

        }

        var activatedGroupId = getGroupIdFromParent(id, parentId, evDataService);

        if (activatedGroupId) {

            result.push(activatedGroupId);

        } else {

            var activatedGroupName = getGroupNameFromParent(id, parentId, evDataService);

            result.push(activatedGroupName);

        }

        return result;

    };

    var getUnfoldedGroups = function (evDataService) {

        var data = evDataService.getData();

        var keys = Object.keys(data);

        var items = [];

        keys.forEach(function (key) {
            items.push(data[key])
        });

        return items.filter(function (item) {
            return item.___is_open
        })

    };

    var getUnfoldedGroupsByLevel = function (level, evDataService) {

        var unfoldedGroups = getUnfoldedGroups(evDataService);

        return unfoldedGroups.filter(function (group) {
            return group.___level === level;
        })

    };

    var getGroupsByLevel = function (level, evDataService) {

        var data = evDataService.getData();

        var keys = Object.keys(data);

        var items = [];

        keys.forEach(function (key) {
            items.push(data[key])
        });

        return items.filter(function (group) {
            return group.___level === level;
        })

    };

    var removeItemsFromFoldedGroups = function (list) {

        var _list = list.concat();

        var foldedGroupsIds = [];

        _list = _list.filter(function (item) {

            if (item.___type === 'group' && !item.___is_open) {
                foldedGroupsIds.push(item.___id);
            }

            if (foldedGroupsIds.indexOf(item.___parentId) !== -1) {
                return false
            }

            return true;

        });

        return _list;

    };

    var getFlatStructure = function (evDataService) {

        var data = JSON.parse(JSON.stringify(evDataService.getData()));

        var rootGroup = JSON.parse(JSON.stringify(evDataService.getRootGroupData()));

        var tree = utilsHelper.convertToTree(data, rootGroup);

        console.log('getFlatStructure.tree', tree);

        var list = utilsHelper.convertTreeToList(tree);

        console.log('getFlatStructure.list', list);

        list = removeItemsFromFoldedGroups(list);

        console.log('list', list);

        return list;

    };

    var getProjection = function (evDataService) {

        console.time('Creating projection');

        var flatList = getFlatStructure(evDataService);
        flatList.shift(); // remove root group

        var reserveTop = evDataService.getVirtualScrollReserveTop();
        var reserveBottom = evDataService.getVirtualScrollReserveBottom();

        var offset = evDataService.getVirtualScrollOffset();
        var step = evDataService.getVirtualScrollStep();

        var from = offset;
        var to = offset + step;

        if (from > reserveTop) {
            from = from - reserveTop;
        }

        if (flatList.length >= to) {
            to = to + reserveBottom;
        }

        evDataService.setVirtualScrollLimit(flatList);

        var items = flatList.slice(from, to);

        console.timeEnd('Creating projection');

        return items;

    };

    var isGroupSelected = function (groupId, parentGroupId, evDataService) {

        if (isSelected(evDataService)) {
            return true
        }

        var parentGroup = evDataService.getData(parentGroupId);

        var selected = false;

        parentGroup.results.forEach(function (item) {

            if (item.___id === groupId) {
                selected = item.___is_selected;
            }

        });

        return selected;

    };

    var isSelected = function (evDataService) {

        return evDataService.getSelectAllRowsState();

    };

    var setColumnsDefaultWidth = function (evDataService) {

        var columns = evDataService.getColumns();

        var groupsWidth = metaService.columnsWidthGroups();

        var defaultWidth = 100;

        columns.forEach(function (column) {

            if (!column.style) {
                column.style = {}
            }

            if (!column.style.width) {


                if (column.hasOwnProperty('key')) {
                    column.style.width = defaultWidth + 'px';
                }

                if (column.hasOwnProperty('id')) {

                    switch (column.value_type) {
                        case 10:
                            column.style.width = groupsWidth.groupThree;
                            break;
                        case 20:
                            column.style.width = defaultWidth + 'px';
                            break;
                        case 40:
                            column.style.width = groupsWidth.groupFive;
                            break;
                        case 30:
                            column.style.width = groupsWidth.groupFive;
                            break;
                    }

                }

            }

        });

        evDataService.setColumns(columns);

    };

    module.exports = {

        getParents: getParents,
        getGroupNameFromParent: getGroupNameFromParent,
        getGroupIdFromParent: getGroupIdFromParent,

        getAllChildrenGroups: getAllChildrenGroups,

        ifFirstRequestForRootGroup: ifFirstRequestForRootGroup,
        isFirstRequestForObjects: isFirstRequestForObjects,

        getFlatStructure: getFlatStructure,
        getUnfoldedGroups: getUnfoldedGroups,
        getUnfoldedGroupsByLevel: getUnfoldedGroupsByLevel,
        getGroupsByLevel: getGroupsByLevel,

        getObject: getObject,

        getNextPage: getNextPage,

        getEvId: getEvId,
        getGroupTypeId: getGroupTypeId,
        getColumnId: getColumnId,

        getGroupTypes: getGroupTypes,
        getGroupValues: getGroupValues,
        getProjection: getProjection,

        setColumnsDefaultWidth: setColumnsDefaultWidth,

        isGroupSelected: isGroupSelected,
        isSelected: isSelected
    }


}());