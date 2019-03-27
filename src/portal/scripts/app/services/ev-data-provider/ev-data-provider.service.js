(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('../ev-data-provider/groups.service');
    var objectsService = require('../ev-data-provider/objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');
    var entityViewerDataResolver = require('../entityViewerDataResolver');
    var stringHelper = require('../../helpers/stringHelper');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var detectLevelChange = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = JSON.parse(JSON.stringify(entityViewerDataService.getActiveRequestParameters()));

        // console.log('detectLevelChange.options.page', requestParameters.body.page);

        if (!requestParameters.body.page) {
            requestParameters.body.page = 1;
        }

        var groupData;

        if (!requestParameters.event.___id) {
            groupData = entityViewerDataService.getRootGroupData();
        } else {
            groupData = entityViewerDataService.getData(requestParameters.event.___id);
        }

        // console.log('detectLevelChange.groupData', groupData);
        // console.log('detectLevelChange.groupData', groupData && groupData.___parentId !== null && !groupData.next && groupData.results.lengt);

        if (groupData && groupData.___parentId !== null && !groupData.next && groupData.results && groupData.results.length) {

            var parent = entityViewerDataService.getData(groupData.___parentId);

            // console.log('parent', parent);

            requestParameters.body.page = Math.ceil(parent.results / 40); // TODO 40 - items per page, make configurable
            requestParameters.event.___id = parent.___id;
            requestParameters.event.groupName = parent.___group_name;
            requestParameters.event.groupId = parent.___group_identifier;
            requestParameters.event.parentGroupId = parent.___parentId;
            requestParameters.requestType = 'groups';

        }

        entityViewerDataService.setRequestParameters(requestParameters);
        entityViewerDataService.setActiveRequestParametersId(requestParameters.id);

    };

    var injectRegularFilters = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        // console.log('injectRegularFilters.requestParameters', requestParameters);

        var newRequestParametersBody = Object.assign({}, requestParameters.body);

        var filters = entityViewerDataService.getFilters();

        filters.forEach(function (item) {

            if (item.options && item.options.enabled) {

                if (item.options.query && item.options.enabled) {

                    var key = queryParamsHelper.entityPluralToSingular(item.key);

                    newRequestParametersBody[key] = item.options.query
                }

            }

        });

        requestParameters.body = newRequestParametersBody;

        entityViewerDataService.setRequestParameters(requestParameters);

        // console.log('injectRegularFilters.filters', filters);
        // console.log('injectRegularFilters.newRequestParameters', newRequestParametersBody);

    };

    var fromMemoryDecorator = function (callback, entityViewerDataService, entityViewerEventService) {

        var requestParameters = JSON.parse(JSON.stringify(entityViewerDataService.getActiveRequestParameters()));

        var options = requestParameters.body;
        var event = requestParameters.event;

        if (!requestParameters.requestedPages) {
            requestParameters.requestedPages = [];
        }

        var currentPage = evDataHelper.calculatePageFromOffset(requestParameters, entityViewerDataService);

        if (evDataHelper.ifFirstRequestForRootGroup(event, entityViewerDataService) || evDataHelper.isFirstRequestForObjects(event, entityViewerDataService)) {

            requestParameters.body = options;

            requestParameters.requestedPages = [1];

            entityViewerDataService.setRequestParameters(requestParameters);

            callback(entityViewerDataService, entityViewerEventService);

        } else {

            if (requestParameters.requestedPages.indexOf(currentPage) === -1) {

                options.page = currentPage;
                requestParameters.requestedPages.push(currentPage);

                requestParameters.body = options;

                entityViewerDataService.setRequestParameters(requestParameters);

                callback(entityViewerDataService, entityViewerEventService);

            } else {

                console.log('fromMemoryDecorator: From memory');

                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            }

        }


    };

    var getObjects = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();

            var options = requestParameters.body;
            var event = requestParameters.event;

            var page = new Number(options.page) - 1;
            // var pagination = entityViewerDataService.getPagination();
            var step = entityViewerDataService.getVirtualScrollStep();
            var i;

            objectsService.getList(entityType, options).then(function (data) {

                var groupData = entityViewerDataService.getData(event.___id);

                var obj;

                if (!event.___id) {

                    var rootGroupData = entityViewerDataService.getRootGroupData();

                    obj = Object.assign({}, rootGroupData);

                    obj.count = data.count;
                    obj.next = data.next;
                    obj.previous = data.previous;

                    for (i = 0; i < step; i = i + 1) {
                        if (page * step + i < obj.count) {
                            obj.results[page * step + i] = data.results[i];
                        }
                    }

                } else {

                    if (groupData) {

                        obj = Object.assign({}, groupData);

                        obj.___group_name = groupData.___group_name ? groupData.___group_name : '-';
                        obj.___group_identifier = groupData.___group_identifier ? groupData.___group_identifier : '-';

                        obj.count = data.count;
                        obj.next = data.next;
                        obj.previous = data.previous;

                        for (i = 0; i < step; i = i + 1) {
                            if (page * step + i < obj.count) {
                                obj.results[page * step + i] = data.results[i];
                            }
                        }

                    } else {

                        obj = Object.assign({}, data);
                        obj.___group_name = event.groupName ? event.groupName : '-';
                        obj.___group_identifier = event.___group_identifier ? event.___group_identifier : '-';
                        // obj.___group_identifier = event.groupId;
                        obj.___is_open = true;
                        obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                        obj.___parentId = event.parentGroupId;
                        obj.___type = 'group';
                        obj.___id = event.___id;
                        obj.___level = evRvCommonHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                    }

                }

                evDataHelper.setDefaultObjects(obj);

                obj.results = obj.results.map(function (item) {

                    if (item.___type !== 'placeholder_object') {

                        item.___group_name = item.___group_name ? item.___group_name : '-';
                        item.___group_identifier = item.___group_identifier ? item.___group_identifier : '-';
                        item.___is_selected = evDataHelper.isSelected(entityViewerDataService);

                        item.___parentId = obj.___id;
                        item.___type = 'object';
                        item.___id = evRvCommonHelper.getId(item);
                        item.___level = obj.___level + 1;

                    }

                    return item
                });

                entityViewerDataService.setData(obj);

                resolve(obj);

            })

        });

    };

    var getGroups = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        requestParameters.status = 'loading';

        entityViewerDataService.setRequestParameters(requestParameters);

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();

            var options = requestParameters.body;
            var event = requestParameters.event;

            var page = new Number(options.page) - 1;
            // var pagination = entityViewerDataService.getPagination();
            var step = 40;
            var i;

            groupsService.getList(entityType, options).then(function (data) {

                if (data.status !== 404) {

                    var obj = {};

                    if (!event.___id) {

                        var rootGroupData = entityViewerDataService.getRootGroupData();

                        obj = Object.assign({}, rootGroupData);

                        obj.count = data.count;
                        obj.next = data.next;
                        obj.previous = data.previous;
                        for (i = 0; i < step; i = i + 1) {
                            if (page * step + i < obj.count) {
                                obj.results[page * step + i] = data.results[i];
                            }
                        }


                    } else {

                        var groupData = entityViewerDataService.getData(event.___id);

                        if (groupData) {

                            obj = Object.assign({}, groupData);

                            obj.___group_name = groupData.___group_name ? groupData.___group_name : '-';
                            obj.___group_identifier = groupData.___group_identifier ? groupData.___group_identifier : '-';

                            obj.count = data.count;
                            obj.next = data.next;
                            obj.previous = data.previous;

                            for (i = 0; i < step; i = i + 1) {
                                if (page * step + i < obj.count) {
                                    obj.results[page * step + i] = data.results[i];
                                }
                            }


                        } else {

                            obj = Object.assign({}, data);
                            obj.___group_name = event.groupName ? event.groupName : '-';
                            obj.___group_identifier = event.groupId ? event.groupId: '-';
                            // obj.___group_identifier = event.groupId;
                            obj.___is_open = true;
                            obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                            obj.___parentId = event.parentGroupId;
                            obj.___type = 'group';
                            obj.___id = event.___id;
                            obj.___level = evRvCommonHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                        }
                    }

                    var groups = entityViewerDataService.getGroups();
                    var parents = [];

                    if (obj.___parentId !== null) {
                        parents = evRvCommonHelper.getParents(obj.___parentId, entityViewerDataService);
                    }

                    parents.push(obj);

                    evDataHelper.setDefaultGroups(obj);

                    obj.results = obj.results.map(function (item) {

                        if (item.___type !== 'placeholder_group') {

                            item.___parentId = obj.___id;
                            item.___group_name = item.___group_name ? item.___group_name : '-';
                            item.___group_identifier = item.___group_identifier ? item.___group_identifier : '-';

                            item.___is_selected = evDataHelper.isSelected(entityViewerDataService);


                            item.___level = obj.___level + 1;

                            if (groups.length >= parents.length) {
                                item.___type = 'group';
                            } else {
                                item.___type = 'object';
                            }

                            item.___id = evRvCommonHelper.getId(item);

                        }

                        return item
                    });

                    entityViewerDataService.setData(obj);

                    requestParameters.status = 'loaded';

                    entityViewerDataService.setRequestParameters(requestParameters);

                    resolve(obj);

                }

            })

        })

    };

    var getObjectsByRequestParameters = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        getObjects(requestParameters, entityViewerDataService, entityViewerEventService)
            .then(function () {
                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);
            })

    };

    var getGroupsByRequestParameters = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        getGroups(requestParameters, entityViewerDataService, entityViewerEventService).then(function () {

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        })

    };

    var updateDataStructure = function (entityViewerDataService, entityViewerEventService) {

        console.time('Updating data structure');

        detectLevelChange(entityViewerDataService, entityViewerEventService);
        injectRegularFilters(entityViewerDataService, entityViewerEventService);

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        if (requestParameters.requestType === 'objects') {

            fromMemoryDecorator(
                getObjectsByRequestParameters, entityViewerDataService, entityViewerEventService)

        }

        if (requestParameters.requestType === 'groups') {

            fromMemoryDecorator(
                getGroupsByRequestParameters, entityViewerDataService, entityViewerEventService);
        }

        console.timeEnd('Updating data structure');

    };

    var sortObjects = function (entityViewerDataService, entityViewerEventService) {

        var level = entityViewerDataService.getGroups().length;

        var unfoldedGroups = evDataHelper.getUnfoldedGroupsByLevel(level, entityViewerDataService);

        var activeColumnSort = entityViewerDataService.getActiveColumnSort();

        var requestsParameters = entityViewerDataService.getAllRequestParameters();

        var requestParametersForUnfoldedGroups = [];

        Object.keys(requestsParameters).forEach(function (key) {

            unfoldedGroups.forEach(function (group) {

                if (group.___id === requestsParameters[key].id) {

                    requestsParameters[key].event.___id = group.___id;
                    requestsParameters[key].event.groupName = group.___group_name;
                    requestsParameters[key].event.groupId = group.___group_identifier;
                    requestsParameters[key].event.parentGroupId = group.___parentId;

                    requestParametersForUnfoldedGroups.push(requestsParameters[key]);
                }


            })

        });

        requestParametersForUnfoldedGroups.forEach(function (item) {

            item.body.page = 1;

            if (activeColumnSort.key) {

                if (activeColumnSort.options.sort === 'ASC') {
                    item.body.ordering = activeColumnSort.key
                } else {
                    item.body.ordering = '-' + activeColumnSort.key
                }

            } else {

                if (activeColumnSort.id) {
                    if (activeColumnSort.options.sort === 'ASC') {
                        item.body.ordering = '___da_' + activeColumnSort.id
                    } else {
                        item.body.ordering = '-' + '___da_' + activeColumnSort.id
                    }
                }

            }

            entityViewerDataService.setRequestParameters(item);

        });

        unfoldedGroups.forEach(function (group) {

            group.results = [];

            entityViewerDataService.setData(group)

        });

        var promises = [];

        requestParametersForUnfoldedGroups.forEach(function (requestParameters) {

            promises.push(getObjects(requestParameters, entityViewerDataService, entityViewerEventService))

        });

        Promise.all(promises).then(function () {

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        })

    };

    var sortGroupType = function (entityViewerDataService, entityViewerEventService) {

        var activeGroupSort = entityViewerDataService.getActiveGroupTypeSort();

        console.log('sortGroupType.activeGroupSort', activeGroupSort);

        var groupsTypes = entityViewerDataService.getGroups();

        var level = 0;

        groupsTypes.forEach(function (item, index) {

            if (activeGroupSort.key && item.key === activeGroupSort.key) {
                level = index;

            } else {

                if (activeGroupSort.id && item.id === activeGroupSort.id) {
                    level = index;
                }

            }

        });

        console.log('sortGroupType.level', level);

        var groups = evDataHelper.getGroupsByLevel(level, entityViewerDataService);

        var requestsParameters = entityViewerDataService.getAllRequestParameters();

        var requestParametersForUnfoldedGroups = [];

        Object.keys(requestsParameters).forEach(function (key) {

            groups.forEach(function (group) {

                if (group.___id === requestsParameters[key].id) {

                    requestsParameters[key].event.___id = group.___id;
                    requestsParameters[key].event.groupName = group.___group_name;
                    requestsParameters[key].event.groupId = group.___group_identifier;
                    requestsParameters[key].event.parentGroupId = group.___parentId;

                    requestParametersForUnfoldedGroups.push(requestsParameters[key]);
                }


            })

        });

        requestParametersForUnfoldedGroups.forEach(function (item) {

            item.body.page = 1;

            item.body.groups_order = activeGroupSort.options.sort.toLocaleLowerCase();

            entityViewerDataService.setRequestParameters(item);

        });

        groups.forEach(function (group) {

            group.results = [];

            entityViewerDataService.setData(group)

        });

        var promises = [];

        requestParametersForUnfoldedGroups.forEach(function (requestParameters) {

            promises.push(getGroups(requestParameters, entityViewerDataService, entityViewerEventService))

        });

        Promise.all(promises).then(function () {

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        });

    };

    module.exports = {
        updateDataStructure: updateDataStructure,
        sortObjects: sortObjects,
        sortGroupType: sortGroupType
    }

}());