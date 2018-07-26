(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('./groups.service');
    var objectsService = require('./objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var entityViewerDataResolver = require('../entityViewerDataResolver');
    var stringHelper = require('../../helpers/stringHelper');
    var queryParamsHelper = require('../../helpers/queryParamsHelper');

    var requestData = function (entityViewerDataService) {

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();
            var reportOptions = entityViewerDataService.getReportOptions();

            entityViewerDataResolver.getList(entityType, reportOptions).then(function (data) {

                var reportOptions = entityViewerDataService.getReportOptions();

                reportOptions = Object.assign({}, reportOptions, data);

                entityViewerDataService.setReportOptions(reportOptions);

                if (!data.hasOwnProperty('non_field_errors')) {

                    if (data.task_status !== 'SUCCESS') {

                        setTimeout(function () {
                            resolve(requestData(entityViewerDataService));
                        }, 1000)

                    } else {

                        resolve(data);

                    }
                }

            });
        });


    };

    var requestReport = function (entityViewerDataService, entityViewerEventService) {

        console.log('requestReport started');

        requestData(entityViewerDataService).then(function (data) {

            var reportOptions = entityViewerDataService.getReportOptions();

            reportOptions = Object.assign({}, reportOptions, {task_id: null});

            entityViewerDataService.setReportOptions(reportOptions);

            entityViewerDataService.setStatusData('loaded');
            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            console.log('requestReport finished');

            updateDataStructure(entityViewerDataService, entityViewerEventService)

        });

    };

    var getObjects = function (requestParameters, entityViewerDataService, entityViewerEventService) {

        entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_START);

        return new Promise(function (resolve, reject) {

            var entityType = entityViewerDataService.getEntityType();

            var options = requestParameters.body;
            var event = requestParameters.event;

            var page = new Number(options.page) - 1;
            // var pagination = entityViewerDataService.getPagination();
            var step = 40;
            var i;

            console.log('getObjects.options', options);

            console.log('from ', page * step);
            console.log('to ', (page + 1) * step);
            console.log('step ', step);
            console.log('page', page);

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

                        obj = Object.assign({}, data);
                        obj.group_name = event.groupName ? event.groupName : '-';
                        obj.group_id = event.groupId;
                        obj.___is_open = true;
                        obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                        obj.___parentId = event.parentGroupId;
                        obj.___type = 'group';
                        obj.___id = event.___id;
                        obj.___level = evDataHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                    }

                }

                evDataHelper.setDefaultObjects(obj);

                obj.results = obj.results.map(function (item) {

                    if (item.___type !== 'placeholder_object') {

                        item.group_name = item.group_name ? item.group_name : '-';
                        item.___is_selected = evDataHelper.isSelected(entityViewerDataService);

                        item.___parentId = obj.___id;
                        item.___type = 'object';
                        item.___id = evDataHelper.getEvId(item);
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

                            obj = Object.assign({}, data);
                            obj.group_name = event.groupName ? event.groupName : '-';
                            obj.group_id = event.groupId;
                            obj.___is_open = true;
                            obj.___is_selected = evDataHelper.isGroupSelected(event.___id, event.parentGroupId, entityViewerDataService);

                            obj.___parentId = event.parentGroupId;
                            obj.___type = 'group';
                            obj.___id = event.___id;
                            obj.___level = evDataHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                        }
                    }

                    var groups = entityViewerDataService.getGroups();
                    var parents = [];

                    if (obj.___parentId !== null) {
                        parents = evDataHelper.getParents(obj.___parentId, entityViewerDataService);
                    }

                    parents.push(obj);

                    evDataHelper.setDefaultGroups(obj);

                    obj.results = obj.results.map(function (item) {

                        if (item.___type !== 'placeholder_group') {

                            item.___parentId = obj.___id;
                            item.group_name = item.group_name ? item.group_name : '-';

                            item.___is_selected = evDataHelper.isSelected(entityViewerDataService);


                            item.___level = obj.___level + 1;

                            if (groups.length >= parents.length) {
                                item.___type = 'group';
                            } else {
                                item.___type = 'object';
                            }

                            item.___id = evDataHelper.getEvId(item);

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

    var getObjectsRequestParameters = function (entityViewerDataService, entityViewerEventService) {

        console.log('evDataProviderService.getObjects');

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

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        if (requestParameters.requestType === 'objects') {

            getObjectsRequestParameters(entityViewerDataService, entityViewerEventService)

        }

        if (requestParameters.requestType === 'groups') {

            getGroupsByRequestParameters(entityViewerDataService, entityViewerEventService);
        }

    };

    var sortObjects = function (entityViewerDataService, entityViewerEventService) {

    };

    var sortGroupType = function (entityViewerDataService, entityViewerEventService) {

    };

    module.exports = {
        requestReport: requestReport,
        updateDataStructure: updateDataStructure,
        sortObjects: sortObjects,
        sortGroupType: sortGroupType
    }

}());