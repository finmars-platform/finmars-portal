(function () {

    var evEvents = require('../entityViewerEvents');
    var groupsService = require('../ev-data-provider/groups.service');
    var objectsService = require('../ev-data-provider/objects.service');
    var evDataHelper = require('../../helpers/ev-data.helper');
    var entityViewerDataResolver = require('../entityViewerDataResolver');
    var stringHelper = require('../../helpers/stringHelper');

    var detectLevelChange = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = JSON.parse(JSON.stringify(entityViewerDataService.getActiveRequestParameters()));

        // console.log('detectLevelChange.options.page', requestParameters.body.page);

        if (!requestParameters.body.page) {
            requestParameters.body.page = 1;
        }

        var groupData;

        if (!requestParameters.event.groupId) {
            groupData = entityViewerDataService.getRootGroupData();
        } else {
            groupData = entityViewerDataService.getData(requestParameters.event.groupId);
        }

        // console.log('detectLevelChange.groupData', groupData);
        // console.log('detectLevelChange.groupData', groupData && groupData.___parentId !== null && !groupData.next && groupData.results.lengt);

        if (groupData && groupData.___parentId !== null && !groupData.next && groupData.results.length) {

            var parent = entityViewerDataService.getData(groupData.___parentId);

            // console.log('parent', parent);

            requestParameters.body.page = Math.ceil(parent.results / 40); // TODO 40 - items per page, make configurable
            requestParameters.event.groupId = parent.___id;
            requestParameters.event.groupName = parent.group_name;
            requestParameters.event.parentGroupId = parent.___parentId;
            requestParameters.requestType = 'groups';

        }

        entityViewerDataService.setRequestParameters(requestParameters);
        entityViewerDataService.setActiveRequestParametersId(requestParameters.id);

    };

    var fromMemoryDecorator = function (callback, entityViewerDataService, entityViewerEventService) {

        var requestParameters = JSON.parse(JSON.stringify(entityViewerDataService.getActiveRequestParameters()));

        var options = requestParameters.body;
        var event = requestParameters.event;

        var nextPage = evDataHelper.getNextPage(options, event, entityViewerDataService);

        console.log('options.page ', options.page);
        console.log('nextPage', nextPage);

        if (evDataHelper.ifFirstRequestForRootGroup(event, entityViewerDataService) || evDataHelper.isFirstRequestForObjects(event, entityViewerDataService)) {

            requestParameters.body = options;

            entityViewerDataService.setRequestParameters(requestParameters);

            callback(entityViewerDataService, entityViewerEventService);

        } else {

            if (options.page < nextPage) {

                options.page = nextPage;

                requestParameters.body = options;

                entityViewerDataService.setRequestParameters(requestParameters);

                callback(entityViewerDataService, entityViewerEventService);

            } else {

                console.log('fromMemoryDecorator: From memory');

                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            }

        }

    };

    var getObjects = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();
        var entityType = entityViewerDataService.getEntityType();

        var options = requestParameters.body;
        var event = requestParameters.event;

        objectsService.getList(entityType, options).then(function (data) {

            console.log('data', data);

            var groupData = entityViewerDataService.getData(event.groupId);

            var obj;

            if (groupData) {

                obj = Object.assign({}, groupData);

                obj.count = data.count;
                obj.next = data.next;
                obj.previous = data.previous;
                obj.results = obj.results.concat(data.results)

            } else {

                obj = Object.assign({}, data);
                obj.group_name = event.groupName;
                obj.is_open = true;

                obj.___parentId = event.parentGroupId;
                obj.___type = 'group';
                obj.___id = event.groupId;
                obj.___level = evDataHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                var currentLimit = entityViewerDataService.getVirtualScrollLimit();
                var newLimit = currentLimit + obj.count;

                entityViewerDataService.setVirtualScrollLimit(newLimit);

            }

            obj.results = obj.results.map(function (item) {
                item.___parentId = obj.___id;
                item.___type = 'object';
                item.___id = evDataHelper.getEvId(item);
                item.___level = obj.___level + 1;

                return item
            });

            entityViewerDataService.setData(obj);

            entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

        })

    };

    var getGroups = function (entityViewerDataService, entityViewerEventService) {

        var requestParameters = entityViewerDataService.getActiveRequestParameters();
        var entityType = entityViewerDataService.getEntityType();

        var options = requestParameters.body;
        var event = requestParameters.event;

        console.log('event', event);
        console.log('options', options);

        groupsService.getList(entityType, options).then(function (data) {

            if (data.status !== 404) {

                var obj = {};

                if (!event.groupId) {

                    var rootGroupData = entityViewerDataService.getRootGroupData();

                    obj = Object.assign({}, rootGroupData);

                    obj.count = data.count;
                    obj.next = data.next;
                    obj.previous = data.previous;
                    obj.results = obj.results.concat(data.results);

                    entityViewerDataService.setVirtualScrollLimit(obj.count);

                } else {

                    var groupData = entityViewerDataService.getData(event.groupId);

                    console.log('groupData', groupData);

                    if (groupData) {

                        obj = Object.assign({}, groupData);

                        obj.count = data.count;
                        obj.next = data.next;
                        obj.previous = data.previous;
                        obj.results = obj.results.concat(data.results);

                    } else {

                        obj = Object.assign({}, data);
                        obj.group_name = event.groupName;
                        obj.is_open = true;

                        obj.___parentId = event.parentGroupId;
                        obj.___type = 'group';
                        obj.___id = event.groupId;
                        obj.___level = evDataHelper.getParents(event.parentGroupId, entityViewerDataService).length;

                        var currentLimit = entityViewerDataService.getVirtualScrollLimit();
                        var newLimit = currentLimit + obj.count;

                        entityViewerDataService.setVirtualScrollLimit(newLimit);

                    }
                }

                var groups = entityViewerDataService.getGroups();
                var parents = [];

                console.log('obj', obj);

                if (obj.___parentId !== null) {
                    parents = evDataHelper.getParents(obj.___parentId, entityViewerDataService);
                }

                parents.push(obj);

                console.log('groups', groups);
                console.log('parents', parents);

                obj.results = obj.results.map(function (item) {
                    item.___parentId = obj.___id;

                    item.___level = obj.___level + 1;

                    if (groups.length >= parents.length) {
                        item.___type = 'group';
                    } else {
                        item.___type = 'object';
                    }

                    item.___id = evDataHelper.getEvId(item);

                    return item
                });

                console.log('obj', obj);

                entityViewerDataService.setData(obj);

                entityViewerEventService.dispatchEvent(evEvents.DATA_LOAD_END);

            }

        })

    };

    var updateDataStructure = function (entityViewerDataService, entityViewerEventService) {

        console.time('Updating data structure');

        detectLevelChange(entityViewerDataService, entityViewerEventService);

        var requestParameters = entityViewerDataService.getActiveRequestParameters();

        if (requestParameters.requestType === 'objects') {

            fromMemoryDecorator(
                getObjects, entityViewerDataService, entityViewerEventService)


        }

        if (requestParameters.requestType === 'groups') {

            fromMemoryDecorator(
                getGroups, entityViewerDataService, entityViewerEventService);
        }

        console.timeEnd('Updating data structure');

    };

    module.exports = {
        updateDataStructure: updateDataStructure
    }

}());