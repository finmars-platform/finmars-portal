(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('../ev-data-provider/groups.service');
    var objectsService = require('../ev-data-provider/objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var injectRegularFilters = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        var newRequestParametersBody = Object.assign({}, requestParameters.body);
        newRequestParametersBody['filter_settings'] = [];

        var filters = entityViewerDataService.getFilters();

        /*filters.forEach(function (item) {

            if (item.options && item.options.enabled) {

                if (item.options.query && item.options.enabled) {

                    var key = queryParamsHelper.entityPluralToSingular(item.key);

                    newRequestParametersBody[key] = item.options.query
                }

            }

        });*/

        var isFilterValid = function (filterItem) {

            if (filterItem.options && filterItem.options.enabled) { // if filter is enabled

                var filterType = filterItem.options.filter_type;

                if (filterType === 'empty' ||
                    filterItem.options.exclude_empty_cells) { // if filter works for empty cells

                    return true;

                } else if (filterItem.options.filter_values) { // if filter values can be used for filtering (not empty)

                    var filterValues = filterItem.options.filter_values;

                    if (filterType === 'from_to') {

                        if ((filterValues.min_value || filterValues.min_value === 0) &&
                            (filterValues.max_value || filterValues.max_value === 0)) {
                            return true;
                        };

                    } else if (Array.isArray(filterValues)) {

                        if (filterValues[0] || filterValues[0] === 0) {
                            return true;
                        };

                    };
                };

            };

            return false;
        };

        filters.forEach(function (item) {

            if (isFilterValid(item)) {

                // var key = queryParamsHelper.entityPluralToSingular(item.key);
                //var filterSettings = queryParamsHelper.formatFilterSettingsForQueryParams(item);

                var filterSettings = {
                    key: item.key,
                    filter_type: item.options.filter_type,
                    exclude_empty_cells: item.options.exclude_empty_cells,
                    value_type: item.value_type,
                    value: item.options.filter_values
                };

                if (item.options.is_frontend_filter) {
                    filterSettings.is_frontend_filter = true;
                };

                //newRequestParametersBody = Object.assign(newRequestParametersBody, filterSettings);
                newRequestParametersBody['filter_settings'].push(filterSettings);

            };

        });

        requestParameters.body = newRequestParametersBody;

        entityViewerDataService.setRequestParameters(requestParameters);

    };

    var deserializeObjects = function (entityViewerDataService, entityViewerEventService, data, requestParameters, page) {

        var step = requestParameters.pagination.items_per_page;
        var pageAsIndex = parseInt(page, 10) - 1;
        var event = requestParameters.event;

        var obj;
        var i;

        if (!event.___id) {

            var rootGroupData = entityViewerDataService.getRootGroupData();

            obj = Object.assign({}, rootGroupData);

            obj.count = data.count;
            obj.next = data.next;
            obj.previous = data.previous;

            for (i = 0; i < step; i = i + 1) {
                if (pageAsIndex * step + i < obj.count) {
                    obj.results[pageAsIndex * step + i] = data.results[i];
                }
            }

        } else {

            var groupData = entityViewerDataService.getData(event.___id);

            console.log('groupData', groupData);

            if (groupData) {

                obj = Object.assign({}, groupData);

                obj.___group_name = groupData.___group_name ? groupData.___group_name : '-';
                obj.___group_id = groupData.___group_id ? groupData.___group_id : '-';
                obj.___group_identifier = groupData.___group_identifier ? groupData.___group_identifier : '-';

                obj.count = data.count;
                obj.next = data.next;
                obj.previous = data.previous;

                for (i = 0; i < step; i = i + 1) {
                    if (pageAsIndex * step + i < obj.count) {
                        obj.results[pageAsIndex * step + i] = data.results[i];
                    }
                }

            } else {

                obj = Object.assign({}, data);
                obj.___group_name = event.groupName ? event.groupName : '-';
                obj.___group_id = event.groupId ? event.groupId : '-';
                obj.___group_identifier = event.groupIdentifier ? event.groupIdentifier : '-';
                obj.___is_open = true;
                obj.___is_activated = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                obj.___parentId = event.parentGroupId;
                obj.___type = 'group';
                obj.___id = event.___id;
                obj.___level = evRvCommonHelper.getParents(event.parentGroupId, entityViewerDataService).length;

            }


        }

        obj.results = obj.results.filter(function (item) {
            if (item && item.___type !== 'control') {
                return true;
            }

            return false;
        });

        obj.results = obj.results.map(function (item, index) {

            if (item.___type !== 'placeholder_object') {

                item.___group_name = item.___group_name ? item.___group_name : '-';
                item.___group_identifier = item.___group_identifier ? item.___group_identifier : '-';
                item.___group_id = item.___group_id ? item.___group_id : '-';
                item.___is_activated = evDataHelper.isSelected(entityViewerDataService);

                item.___parentId = obj.___id;
                item.___type = 'object';
                item.___id = evRvCommonHelper.getId(item);
                item.___level = obj.___level + 1;
                item.___index = index

            }

            return item
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

    var deserializeGroups = function (entityViewerDataService, entityViewerEventService, data, requestParameters, page) {

        var step = requestParameters.pagination.items_per_page;
        var pageAsIndex = parseInt(page, 10) - 1;
        var event = requestParameters.event;

        var obj;
        var i;

        console.log('event', event);

        if (!event.___id) {

            var rootGroupData = entityViewerDataService.getRootGroupData();

            obj = Object.assign({}, rootGroupData);

            obj.count = data.count;
            obj.next = data.next;
            obj.previous = data.previous;
            obj.___is_open = true;
            for (i = 0; i < step; i = i + 1) {
                if (pageAsIndex * step + i < obj.count) {
                    obj.results[pageAsIndex * step + i] = data.results[i];
                }
            }

            console.log('obj', obj);


        } else {

            var groupData = entityViewerDataService.getData(event.___id);

            if (groupData) {

                obj = Object.assign({}, groupData);

                obj.___group_name = groupData.___group_name ? groupData.___group_name : '-';
                obj.___group_identifier = groupData.___group_identifier ? groupData.___group_identifier : '-';
                obj.___group_id = groupData.___group_id ? groupData.___group_id : '-';

                obj.count = data.count;
                obj.next = data.next;
                obj.previous = data.previous;
                obj.___is_open = true;

                for (i = 0; i < step; i = i + 1) {
                    if (pageAsIndex * step + i < obj.count) {
                        obj.results[pageAsIndex * step + i] = data.results[i];
                    }
                }


            } else {

                obj = Object.assign({}, data);
                obj.___group_name = event.groupName ? event.groupName : '-';
                obj.___group_identifier = event.groupIdentifier ? event.groupIdentifier : '-';
                obj.___group_id = event.groupId ? event.groupId : '-';
                // obj.___group_identifier = event.groupId;
                obj.___is_open = true;
                obj.___is_activated = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

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

        // evDataHelper.setDefaultGroups(obj);

        obj.results = obj.results.filter(function (item) {
            return item.___type !== 'control'
        });

        obj.results = obj.results.map(function (item, index) {

            if (item.___type !== 'placeholder_group') {

                item.___parentId = obj.___id;
                item.___group_name = item.___group_name ? item.___group_name : '-';
                item.___group_identifier = item.___group_identifier ? item.___group_identifier : '-';
                item.___group_id = item.___group_id ? item.___group_id : '-';


                item.___is_activated = evDataHelper.isSelected(entityViewerDataService);


                item.___level = obj.___level + 1;

                if (groups.length >= parents.length) {
                    item.___type = 'group';
                } else {
                    item.___type = 'object';
                }

                item.___id = evRvCommonHelper.getId(item);
                item.___index = index

            }

            return item
        });

        var controlObj = {
            ___parentId: obj.___id,
            ___type: 'control',
            ___level: obj.___level + 1
        };

        controlObj.___id = evRvCommonHelper.getId(controlObj);

        obj.results.push(controlObj);

        console.log('DESERIALIZE GROUPS', obj.results);

        entityViewerDataService.setData(obj);

    };

    var getObjects = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var promises = [];

            var entityType = entityViewerDataService.getEntityType();

            var pagination = entityViewerDataService.getPagination();

            var itemsPerPage = pagination.items_per_page;

            console.log("ev events");
            var pagesToRequest = requestParameters.requestedPages.filter(function (page) {

                return requestParameters.processedPages.indexOf(page) === -1

            });

            //if (requestParameters.body.frontend_filter_changed) {

                pagesToRequest.forEach(function (pageToRequest) {

                    promises.push(new Promise(function (resolveLocal) {

                        var options;

                        options = Object.assign({}, requestParameters.body);

                        options.filter_settings = options.filter_settings.filter(function (optionsFilter) {
                            if (!optionsFilter.is_frontend_filter) {
                                return true;
                            };

                            return false;
                        });

                        options.page = pageToRequest;

                        if (options.groups_types) {

                            options.groups_types = options.groups_types.map(function (groupType) {

                                return groupType.key;

                            })

                        }

                        evDataHelper.setDefaultObjects(entityViewerDataService, entityViewerEventService, requestParameters, pageToRequest);

                        requestParameters.pagination.page = pageToRequest;
                        entityViewerDataService.setRequestParameters(requestParameters);

                        entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        objectsService.getFilteredList(entityType, options).then(function (data) {


                            requestParameters.pagination.count = data.count;
                            requestParameters.processedPages.push(pageToRequest);

                            entityViewerDataService.setRequestParameters(requestParameters);

                            deserializeObjects(entityViewerDataService, entityViewerEventService, data, requestParameters, pageToRequest);

                            resolveLocal()

                        });

                    }));

                });


                Promise.all(promises).then(function () {

                    resolve();

                    entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                })
            //};
        });

    };

    var getGroups = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var promises = [];

            var entityType = entityViewerDataService.getEntityType();

            var pagesToRequest = requestParameters.requestedPages.filter(function (page) {

                return requestParameters.processedPages.indexOf(page) === -1

            });

            console.log('pagesToRequest', pagesToRequest);

            pagesToRequest.forEach(function (pageToRequest) {

                promises.push(new Promise(function (resolveLocal) {

                    var options;

                    var options = Object.assign({}, requestParameters.body);

                    options.filter_settings = options.filter_settings.filter(function (optionsFilter) {
                        if (!optionsFilter.is_frontend_filter) {
                            return true;
                        };

                        return false;
                    });
                    console.log('getGroups.options', options);

                    options.page = pageToRequest;

                    if (options.groups_types) {

                        options.groups_types = options.groups_types.map(function (groupType) {

                            return groupType.key;

                        })

                    }

                    evDataHelper.setDefaultGroups(entityViewerDataService, entityViewerEventService, requestParameters, pageToRequest);

                    requestParameters.pagination.page = pageToRequest;
                    entityViewerDataService.setRequestParameters(requestParameters);

                    entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                    groupsService.getFilteredList(entityType, options).then(function (data) {

                        console.log('get groups', data);

                        requestParameters.pagination.count = data.count;
                        requestParameters.processedPages.push(pageToRequest);

                        entityViewerDataService.setRequestParameters(requestParameters);


                        data.results = data.results.map(function (item) {

                            var result = {};

                            result.___group_name = item.group_name;
                            result.___group_identifier = item.group_identifier;

                            return result
                        });

                        deserializeGroups(entityViewerDataService, entityViewerEventService, data, requestParameters, pageToRequest);

                        entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

                        resolveLocal()

                    })
                }))
            });

            Promise.all(promises).then(function () {
                resolve();
            })

        })

    };

    var updateDataStructure = function (entityViewerDataService, entityViewerEventService) {

        console.time('Updating data structure');

        injectRegularFilters(entityViewerDataService, entityViewerEventService);

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        console.log('updateDataStructure.requestParameters', JSON.parse(JSON.stringify(requestParameters)));

        if (requestParameters.requestType === 'objects') {

            getObjects(requestParameters, entityViewerDataService, entityViewerEventService)
                .then(function () {
                    entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);
                })

        }

        if (requestParameters.requestType === 'groups') {

            getGroups(requestParameters, entityViewerDataService, entityViewerEventService).then(function () {

                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            })

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

                    // requestsParameters[key].event.___id = group.___id;
                    // requestsParameters[key].event.groupName = group.___group_name;
                    // requestsParameters[key].event.groupIdentifier = group.___group_identifier;
                    // requestsParameters[key].event.groupId = group.___group_id;
                    // requestsParameters[key].event.parentGroupId = group.___parentId;

                    requestParametersForUnfoldedGroups.push(requestsParameters[key]);
                }


            })

        });

        requestParametersForUnfoldedGroups.forEach(function (item) {

            item.body.page = 1;

            if (activeColumnSort.options.sort === 'ASC') {
                item.body.ordering = activeColumnSort.key
            } else {
                item.body.ordering = '-' + activeColumnSort.key
            }

            item.processedPages = [];

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

                    // requestsParameters[key].event.___id = group.___id;
                    // requestsParameters[key].event.groupName = group.___group_name;
                    // requestsParameters[key].event.groupIdentifier = group.___group_identifier;
                    // requestsParameters[key].event.groupId = group.___group_id;
                    // requestsParameters[key].event.parentGroupId = group.___parentId;

                    requestParametersForUnfoldedGroups.push(requestsParameters[key]);
                }


            })

        });

        requestParametersForUnfoldedGroups.forEach(function (item) {

            item.body.page = 1;

            item.body.groups_order = activeGroupSort.options.sort.toLocaleLowerCase();
            item.processedPages = [];

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