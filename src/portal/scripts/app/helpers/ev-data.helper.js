(function () {

    var stringHelper = require('./stringHelper');
    var utilsHelper = require('./utils.helper');
    var evRvCommonHelper = require('./ev-rv-common.helper');
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

        // console.log('groupData', groupData);

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

        return result.___group_name

    };

    var getGroupIdentifierFromParent = function (id, parentId, evDataService) {

        var parent = evDataService.getData(parentId);

        var result = parent.results.find(function (item) {

            return item.___id === id;

        });

        return result.___group_identifier

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

        var result = null;

        if (parent) {

            parent.results.forEach(function (item) {

                if (item.___id === objectId) {
                    result = item;
                }

            });

        }

        return result

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

        var parentsCount = evRvCommonHelper.getParents(parentId, evDataService).length;

        var groupsCount;

        if (groups.length > parentsCount) {
            groupsCount = parentsCount + 1;
        } else {
            groupsCount = parentsCount;
        }

        for (var i = 0; i < groupsCount; i = i + 1) {

            if (groups[i].key) {
                result.push(groups[i])
            }

        }

        return result;

    };

    var getGroupsValues = function (id, parentId, evDataService) {

        var parents = evRvCommonHelper.getParents(parentId, evDataService).reverse();

        var result = [];

        for (var i = 0; i < parents.length; i = i + 1) {

            if (parents[i].___parentId !== null) {

                result.push(parents[i].___group_identifier)

            }

        }

        var currentValue = getGroupIdentifierFromParent(id, parentId, evDataService);

        result.push(currentValue);

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

        // console.log('getFlatStructure.tree', tree);

        var list = utilsHelper.convertTreeToList(tree);

        // console.log('getFlatStructure.list', list);

        list = removeItemsFromFoldedGroups(list);

        // console.log('list', list);

        return list;

    };

    var calculateProjection = function (flatList, evDataService) {

        console.time('Creating projection');

        var rowHeight = evDataService.getRowHeight();
        var offsetPx = evDataService.getVirtualScrollOffsetPx();
        var from = Math.ceil(offsetPx / rowHeight);
        var step = evDataService.getVirtualScrollStep();

        var to = from + step;

        console.timeEnd('Creating projection');

        return flatList.slice(from, to);

    };

    var isGroupSelected = function (groupId, parentGroupId, evDataService) {

        if (isSelected(evDataService)) {
            return true
        }

        var parentGroup = evDataService.getData(parentGroupId);

        var selected = false;

        parentGroup.results.forEach(function (item) {

            if (item.___id === groupId) {
                selected = item.___is_activated;
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

    var updateColumnsIds = function (evDataService) {

        var columns = evDataService.getColumns();

        columns.forEach(function (item) {

            item.___column_id = getColumnId(item);

        });

        evDataService.setColumns(columns);

    };

    var setDefaultObjects = function (entityViewerDataService, entityViewerEventService, requestParameters, page) {

        var obj;
        var step = requestParameters.pagination.items_per_page;
        var event = requestParameters.event;
        var pageAsIndex = parseInt(page, 10) - 1;
        var i;

        if (!event.___id) {

            var rootGroupData = entityViewerDataService.getRootGroupData();

            obj = Object.assign({}, rootGroupData);

        } else {
            var groupData = entityViewerDataService.getData(event.___id);

            if (groupData) {
                obj = Object.assign({}, groupData);
            } else {
                obj = {
                    results: []
                }
            }
        }

        for (i = 0; i < step; i = i + 1) {
            if (pageAsIndex * step + i < obj.count) {

                if (!obj.results[pageAsIndex * step + i]) {

                    obj.results[pageAsIndex * step + i] = {
                        id: '___placeholder_object_' + (pageAsIndex * step + i),
                        ___type: 'placeholder_object',
                        ___parentId: obj.___id
                    };

                    obj.results[pageAsIndex * step + i].___id = evRvCommonHelper.getId(obj.results[pageAsIndex * step + i]);

                }

            }
        }

        obj.results = obj.results.filter(function (item) {
            return item.___type !== 'control'
        });

        var controlObj = {
            ___parentId: obj.___id,
            ___type: 'control',
            ___level: obj.___level + 1
        };

        controlObj.___id = evRvCommonHelper.getId(controlObj);

        obj.results.push(controlObj);

        entityViewerDataService.setData(obj);

    };

    var setDefaultGroups = function (entityViewerDataService, entityViewerEventService, requestParameters, page) {

        var obj;
        var step = requestParameters.pagination.items_per_page;
        var event = requestParameters.event;
        var pageAsIndex = parseInt(page, 10) - 1;
        var i;

        if (!event.___id) {

            var rootGroupData = entityViewerDataService.getRootGroupData();

            obj = Object.assign({}, rootGroupData);

        } else {
            var groupData = entityViewerDataService.getData(event.___id);

            if (groupData) {
                obj = Object.assign({}, groupData);
            } else {
                obj = {
                    results: []
                }
            }
        }


        console.log('setDefaultGroups obj.count', obj.count);

        for (i = 0; i < step; i = i + 1) {
            if (pageAsIndex * step + i < obj.count) {

                if (!obj.results[pageAsIndex * step + i]) {

                    obj.results[pageAsIndex * step + i] = {
                        id: '___placeholder_group_' + (pageAsIndex * step + i),
                        ___type: 'placeholder_group',
                        ___parentId: obj.___id
                    };

                    obj.results[pageAsIndex * step + i].___id = evRvCommonHelper.getId(obj.results[pageAsIndex * step + i]);

                }

            }
        }

        console.log('SET DEFAULT GROUPS.results', obj.results);

        obj.results = obj.results.filter(function (item) {
            return item.___type !== 'control'
        });

        var controlObj = {
            ___parentId: obj.___id,
            ___type: 'control',
            ___level: obj.___level + 1
        };

        controlObj.___id = evRvCommonHelper.getId(controlObj);

        obj.results.push(controlObj);

        entityViewerDataService.setData(obj);

    };

    var calculatePageFromOffset = function (requestParameters, evDataService) {

        var group = evDataService.getGroup(requestParameters.id);
        var resultPage;

        if (!group) {
            resultPage = 1;
            return resultPage
        }

        console.log('group', group);

        var rowHeight = evDataService.getRowHeight();

        var previousOffsetPx = evDataService.getVirtualScrollPreviousOffsetPx();
        var offsetPx = evDataService.getVirtualScrollOffsetPx();
        var scrollDirection = evDataService.getVirtualScrollDirection();
        var offset = Math.floor(offsetPx / rowHeight);

        var pagination = evDataService.getPagination();
        var step = pagination.items_per_page;

        var maxPage = Math.ceil(group.count / step);

        resultPage = Math.ceil(offset / step);

        if (Math.abs(offsetPx - previousOffsetPx) < 100) {

            if (scrollDirection === 'top') {
                resultPage = Math.ceil(offset / step) - 1;
            }

            if (scrollDirection === 'bottom') {

                if (offset - resultPage * step < 5) {
                    resultPage = Math.ceil(offset / step) + 1
                }
            }

        }


        if (resultPage === 0 || resultPage < 0) {
            resultPage = 1;
        }

        if (resultPage > maxPage) {
            resultPage = maxPage;
        }

        // console.log('direction', scrollDirection);
        // console.log('offset px', offsetPx);
        // console.log('offset', offset);
        // console.log('page', resultPage);

        return resultPage;


    };

    var getGroupsTypesToLevel = function (level, evDataService) {

        var groups = evDataService.getGroups();
        var group_types = [];

        var to = level;

        if (level >= groups.length) {
            to = groups.length - 1;
        }

        for (var i = 0; i <= to; i = i + 1) {

            group_types.push(groups[i])

            // if (groups[i].hasOwnProperty('id')) {
            //     group_types.push(groups[i].id)
            // } else {
            //     group_types.push(groups[i].key)
            // }
        }

        return group_types;

    };

    var getGroupsValuesByItem = function (item, evDataService) {

        var parents = evRvCommonHelper.getParents(item.___parentId, evDataService);
        var groups_values = [];

        parents.forEach(function (parentItem) {

            if (parentItem.___parentId) {

                groups_values.push(parentItem.___group_identifier);

            }

        });

        return groups_values.reverse();

    };

    module.exports = {

        getGroupNameFromParent: getGroupNameFromParent,
        getGroupIdentifierFromParent: getGroupIdentifierFromParent,

        getAllChildrenGroups: getAllChildrenGroups,

        ifFirstRequestForRootGroup: ifFirstRequestForRootGroup,
        isFirstRequestForObjects: isFirstRequestForObjects,

        getFlatStructure: getFlatStructure,
        getUnfoldedGroups: getUnfoldedGroups,
        getUnfoldedGroupsByLevel: getUnfoldedGroupsByLevel,
        getGroupsByLevel: getGroupsByLevel,

        getObject: getObject,

        getNextPage: getNextPage,

        getGroupTypeId: getGroupTypeId,
        getColumnId: getColumnId,

        getGroupTypes: getGroupTypes,
        getGroupsValues: getGroupsValues,
        calculateProjection: calculateProjection,

        setColumnsDefaultWidth: setColumnsDefaultWidth,
        updateColumnsIds: updateColumnsIds,

        calculatePageFromOffset: calculatePageFromOffset,

        setDefaultGroups: setDefaultGroups,
        setDefaultObjects: setDefaultObjects,

        isGroupSelected: isGroupSelected,
        isSelected: isSelected,

        getGroupsTypesToLevel: getGroupsTypesToLevel,
        getGroupsValuesByItem: getGroupsValuesByItem
    }


}());