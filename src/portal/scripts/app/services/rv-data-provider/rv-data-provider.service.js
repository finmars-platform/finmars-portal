(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('./groups.service');
    var objectsService = require('./objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var evRvCommonHelper = require('../../helpers/ev-rv-common.helper');
    var entityViewerDataResolver = require('../entityViewerDataResolver');
    var stringHelper = require('../../helpers/stringHelper');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var reportHelper = require('../../helpers/reportHelper');
    var transactionReportHelper = require('../../helpers/transactionReportHelper');

    console.log('evRvCommonHelper', evRvCommonHelper);

    var requestData = function (evDataService) {

        return new Promise(function (resolve, reject) {

            var entityType = evDataService.getEntityType();
            var reportOptions = evDataService.getReportOptions();

            entityViewerDataResolver.getList(entityType, reportOptions).then(function (data) {

                // console.log('requestData.data', data);

                if (!data.hasOwnProperty('non_field_errors')) {

                    var reportOptions = evDataService.getReportOptions();

                    reportOptions = Object.assign({}, reportOptions, data);

                    evDataService.setReportOptions(reportOptions);

                    if (data.hasOwnProperty('task_status') && data.task_status !== 'SUCCESS') {

                        setTimeout(function () {
                            resolve(requestData(evDataService));
                        }, 1000)

                    } else {

                        resolve(data);

                    }
                }

            }).catch(function (reason) {

                console.log('here?');

            })
        });


    };

    var injectRegularFilters = function (requestParameters, entityViewerDataService, entityViewerEventService) {

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
        // console.log('injectRegularFilters.newRequestParameters', requestParameters);

    };

    var requestReport = function (entityViewerDataService, entityViewerEventService) {

        var reportOptions = entityViewerDataService.getReportOptions();
        reportOptions.task_id = null;
        entityViewerDataService.setReportOptions(reportOptions);

        // console.log('requestReport started');

        requestData(entityViewerDataService, entityViewerEventService).then(function (data) {

            var reportOptions = entityViewerDataService.getReportOptions();

            reportOptions = Object.assign({}, reportOptions, {task_id: null});

            reportOptions.items = transactionReportHelper.injectIntoItems(reportOptions.items, data);
            reportOptions.items = reportHelper.releaseEntityObjects(reportOptions.items);

            console.log('reportOptions.items', reportOptions.items);

            entityViewerDataService.setReportOptions(reportOptions);

            entityViewerDataService.setStatusData('loaded');

            // console.log('requestReport finished');

            createDataStructure(entityViewerDataService, entityViewerEventService)

        });

    };

    var getObjects = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        requestParameters.status = 'loading';

        entityViewerDataService.setRequestParameters(requestParameters);

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();

            var options = requestParameters.body;
            var event = requestParameters.event;

            var page = new Number(options.page) - 1;
            // var pagination = entityViewerDataService.getPagination();
            var step = 40;
            var i;

            // console.log('getObjects.options', options);
            //
            // console.log('from ', page * step);
            // console.log('to ', (page + 1) * step);
            // console.log('step ', step);
            // console.log('page', page);

            objectsService.getList(entityType, options, entityViewerDataService).then(function (data) {

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

                        obj.group_name = groupData.group_name ? groupData.group_name : '-';

                        obj.count = data.count;
                        obj.next = data.next;
                        obj.previous = data.previous;

                        for (i = 0; i < step; i = i + 1) {
                            if (page * step + i < obj.count) {
                                obj.results[page * step + i] = data.results[i];
                            }
                        }

                    } else {

                        var parentGroup = entityViewerDataService.getData(event.parentGroupId);

                        var parentItemIsFirst = false;

                        parentGroup.results.forEach(function (item) {
                            if (event.___id === item.___id) {
                                parentItemIsFirst = item.___is_first
                            }
                        });

                        obj = Object.assign({}, data);
                        obj.group_name = event.groupName ? event.groupName : '-';
                        obj.group_id = event.groupId;
                        obj.___is_open = true;
                        obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                        obj.___parentId = event.parentGroupId;
                        obj.___type = 'group';
                        obj.___id = event.___id;
                        obj.___level = evRvCommonHelper.getParents(event.parentGroupId, entityViewerDataService).length;
                        obj.___is_first = parentItemIsFirst;

                    }

                }

                obj.results = obj.results.map(function (item) {


                    item.group_name = item.group_name ? item.group_name : '-';
                    item.___is_selected = evDataHelper.isSelected(entityViewerDataService);

                    item.___parentId = obj.___id;
                    item.___type = 'object';
                    item.___id = evRvCommonHelper.getId(item);
                    item.___level = obj.___level + 1;
                    item.___is_first = false;

                    return item
                });

                if (obj.results.length) {
                    obj.results[0].___is_first = true;
                }

                entityViewerDataService.setData(obj);

                requestParameters.status = 'loaded';

                entityViewerDataService.setRequestParameters(requestParameters);

                resolve(obj);

            })

        });

    };

    var getGroups = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        requestParameters.status = 'loading';

        entityViewerDataService.setRequestParameters(requestParameters);

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();

            var options = requestParameters.body;
            var event = requestParameters.event;

            var page = new Number(options.page) - 1;
            // var pagination = entityViewerDataService.getPagination();
            var step = 40;
            var i;

            groupsService.getList(entityType, options, entityViewerDataService).then(function (data) {

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

                            obj.group_name = groupData.group_name ? groupData.group_name : '-';

                            obj.count = data.count;
                            obj.next = data.next;
                            obj.previous = data.previous;

                            for (i = 0; i < step; i = i + 1) {
                                if (page * step + i < obj.count) {
                                    obj.results[page * step + i] = data.results[i];
                                }
                            }


                        } else {


                            var parentGroup = entityViewerDataService.getData(event.parentGroupId);

                            var parentItemIsFirst = false;

                            parentGroup.results.forEach(function (item) {
                                if (event.___id === item.___id) {
                                    parentItemIsFirst = item.___is_first
                                }
                            });

                            obj = Object.assign({}, data);
                            obj.group_name = event.groupName ? event.groupName : '-';
                            obj.group_id = event.groupId;
                            obj.___is_open = true;
                            obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                            obj.___parentId = event.parentGroupId;
                            obj.___type = 'group';
                            obj.___id = event.___id;
                            obj.___level = evRvCommonHelper.getParents(event.parentGroupId, entityViewerDataService).length;
                            obj.___is_first = parentItemIsFirst;

                        }
                    }

                    var groups = entityViewerDataService.getGroups();
                    var parents = [];

                    if (obj.___parentId !== null) {
                        parents = evRvCommonHelper.getParents(obj.___parentId, entityViewerDataService);
                    }

                    parents.push(obj);

                    obj.results = obj.results.map(function (item) {

                        item.___parentId = obj.___id;
                        item.group_name = item.group_name ? item.group_name : '-';

                        item.___is_selected = evDataHelper.isSelected(entityViewerDataService);


                        item.___level = obj.___level + 1;

                        if (groups.length >= parents.length) {
                            item.___type = 'group';
                        } else {
                            item.___type = 'object';
                        }

                        item.___id = evRvCommonHelper.getId(item);

                        item.___is_first = false;

                        return item
                    });

                    if (obj.results.length) {
                        obj.results[0].___is_first = true;
                    }


                    entityViewerDataService.setData(obj);

                    requestParameters.status = 'loaded';

                    entityViewerDataService.setRequestParameters(requestParameters);

                    resolve(obj);

                }

            })

        })

    };

    var getObjectsByRequestParameters = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        // console.log('evDataProviderService.getObjects');

        return getObjects(requestParameters, entityViewerDataService, entityViewerEventService)


    };

    var getGroupsByRequestParameters = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        return getGroups(requestParameters, entityViewerDataService, entityViewerEventService)

    };

    var createRequestParameters = function (item, level, evDataService, evEventService) {

        // console.log('createRequestParameters.item', item);

        var groups = evDataService.getGroups();

        var requestParameters;

        var id = evRvCommonHelper.getId(item);

        var group_types = evDataHelper.getGroupTypesToLevel(level + 1, evDataService);
        var group_values = evDataHelper.getGroupValuesByItem(item, evDataService);

        if (item.group_id) {
            group_values.push(item.group_id);
        } else {
            group_values.push(item.group_name);
        }


        if (groups.length && level + 1 < groups.length) {

            requestParameters = {
                requestType: 'groups',
                id: id,
                groups_level: level + 1, // 0 is for root
                event: {
                    ___id: id,
                    groupName: item.group_name,
                    groupId: item.group_id ? item.group_id : null,
                    parentGroupId: item.___parentId
                },
                body: {
                    groups_types: group_types,
                    page: 1,
                    groups_values: group_values,
                    groups_order: 'asc'
                }
            };

        } else {

            requestParameters = {
                requestType: 'objects',
                id: id,
                groups_level: level + 1, // 0 is for root
                event: {
                    ___id: id,
                    groupName: item.group_name,
                    groupId: item.group_id ? item.group_id : null,
                    parentGroupId: item.___parentId
                },
                body: {
                    groups_types: group_types,
                    page: 1,
                    groups_values: group_values,
                    groups_order: 'asc'
                }
            };

        }

        evDataService.setRequestParameters(requestParameters);

        return requestParameters;

    };

    var recursiveRequest = function (items, level, evDataService, evEventService) {

        return new Promise(function RecursiveRequestPromise(resolve, reject) {

            var promises = [];
            var requestParameters;

            items.forEach(function (item) {

                requestParameters = createRequestParameters(item, level, evDataService, evEventService);
                promises.push(updateDataStructureByRequestParameters(requestParameters, evDataService, evEventService));

            });


            Promise.all(promises).then(function (data) {

                var groups = evDataService.getGroups();

                level = level + 1;

                if (level < groups.length) {

                    // console.log('to next level!', level);

                    items = evDataHelper.getGroupsByLevel(level, evDataService);

                    // console.log('recursiveRequest.items', items);

                    var recursiveRequestPromises = [];

                    items.forEach(function (item) {

                        // console.log('item!', item.group_name);

                        recursiveRequestPromises.push(recursiveRequest(item.results, level, evDataService, evEventService));

                    });

                    console.log('recursiveRequest.level', level);
                    console.log('recursiveRequest.recursiveRequestPromises', recursiveRequestPromises.length);

                    Promise.all(recursiveRequestPromises).then(function (data) {
                        resolve(data);
                    })


                } else {

                    resolve([])
                }

            });

        })

    };

    var initRecursiveRequestParametersCreation = function (evDataService, evEventService) {

        console.time('Creating Data Structure');

        var rootGroup = evDataService.getRootGroupData();
        var level = 0;

        return recursiveRequest(rootGroup.results, level, evDataService, evEventService).then(function (data) {

            console.timeEnd('Creating Data Structure');

            return data;

        })

    };

    var createDataStructure = function (evDataService, evEventService) {

        evDataService.resetData();
        evDataService.resetRequestParameters();

        var defaultRootRequestParameters = evDataService.getActiveRequestParameters();
        var groups = evDataService.getGroups();

        if (groups.length) {

            getGroups(defaultRootRequestParameters, evDataService, evEventService).then(function () {

                initRecursiveRequestParametersCreation(evDataService, evEventService).then(function () {

                    evEventService.dispatchEvent(evEvents.DATA_LOAD_END);

                })

            });

        } else {

            getObjects(defaultRootRequestParameters, evDataService, evEventService).then(function () {

                evEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            })

        }


    };

    var updateDataStructureByRequestParameters = function (requestParameters, evDataService, evEventService) {

        // console.log('updateDataStructureByRequestParameters.requestParameters', requestParameters);

        return new Promise(function (resolve, reject) {

            injectRegularFilters(requestParameters, evDataService, evEventService);

            // console.log('requestParameters.requestType', requestParameters.requestType);

            if (requestParameters.requestType === 'objects') {

                getObjectsByRequestParameters(requestParameters, evDataService, evEventService).then(function (data) {
                    resolve(data)
                })

            }

            if (requestParameters.requestType === 'groups') {

                getGroupsByRequestParameters(requestParameters, evDataService, evEventService).then(function (data) {
                    resolve(data)
                })
            }

        })

    };

    var updateDataStructure = function (evDataService, evEventService) {

        return new Promise(function (resolve, reject) {

            var requestParameters = evDataService.getActiveRequestParameters();

            injectRegularFilters(requestParameters, evDataService, evEventService);

            if (requestParameters.requestType === 'objects') {

                getObjectsByRequestParameters(requestParameters, evDataService, evEventService).then(function (data) {
                    resolve(data)
                })

            }

            if (requestParameters.requestType === 'groups') {

                getGroupsByRequestParameters(requestParameters, evDataService, evEventService).then(function (data) {
                    resolve(data)
                })
            }

        })

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
                    requestsParameters[key].event.groupName = group.group_name;
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

    };

    module.exports = {
        createDataStructure: createDataStructure,
        requestReport: requestReport,
        updateDataStructure: updateDataStructure,
        sortObjects: sortObjects,
        sortGroupType: sortGroupType
    }

}());