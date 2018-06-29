(function () {

    var stringHelper = require('../helpers/stringHelper');

    var getDefaultInterfaceLayout = function () {

        var sidebarWidth = 200;
        var sidebarHeight = document.body.clientHeight;

        var headerToolbarHeight = 64;
        var headerToolbarWidth = document.body.clientWidth - sidebarWidth;

        var groupingAreaHeight = 86;
        var columnAreaHeight = 70;
        var filterAreaWidth = 239;
        var filterAreaLeft = document.body.clientWidth - filterAreaWidth;

        return {
            sidebar: {
                left: 0,
                top: 0,
                width: sidebarWidth,
                height: sidebarHeight
            },
            headerToolbar: {
                left: sidebarWidth,
                top: 0,
                width: headerToolbarWidth,
                height: headerToolbarHeight
            },
            groupingArea: {
                left: sidebarWidth,
                top: headerToolbarHeight,
                height: groupingAreaHeight
            },
            columnArea: {
                left: sidebarWidth,
                top: headerToolbarHeight + groupingAreaHeight,
                height: columnAreaHeight
            },
            filterArea: {
                left: filterAreaLeft,
                top: headerToolbarHeight,
                width: filterAreaWidth
            }
        }

    };

    var getDefaultRootGroup = function () {

        var rootHash = stringHelper.toHash('root');

        var obj = {};
        obj.count = 0;
        obj.next = null;
        obj.previous = null;
        obj.results = [];
        obj.group_name = 'root';
        obj.is_open = true;
        obj.___id = rootHash;
        obj.___parentId = null;
        obj.___type = 'group';
        obj.___level = 0;

        return obj

    };

    module.exports = function () {

        console.log('Entity Viewer Data Service started!');

        var data = {
            columns: [],
            groups: [],
            filters: [],
            pagination: {
                page: 1,
                items_per_page: 15,
                total_items: 1
            },
            status: {
                data: null
            },
            rootEntityViewer: false,
            additions: {},
            report: {},
            data: {},
            virtualScroll: {
                reserveTop: 20,
                reserveBottom: 20,
                requestThreshold: 20,
                lastRequestOffset: 0,
                rowHeight: 24,
                offset: 0, // current position
                limit: 0, // total rows
                step: 40 // rows to render
            },
            interfaceLayout: null,
            requestParameters: {},
            activeRequestParametersId: null,
            lastClickInfo: {}
        };

        console.log('getInterfaceLayout', getDefaultInterfaceLayout());

        data.interfaceLayout = getDefaultInterfaceLayout();

        var rootHash = stringHelper.toHash('root');
        var defaultRootGroup = getDefaultRootGroup();

        setData(defaultRootGroup);
        setActiveRequestParametersId(defaultRootGroup.___id);


        console.log('Entity Viewer Data Service data', data);

        function getInterfaceLayout() {
            return data.interfaceLayout
        }

        function setRootEntityViewer(isRootEntityViewer) {
            data.rootEntityViewer = isRootEntityViewer;
        }

        function isRootEntityViewer() {
            return data.rootEntityViewer
        }


        function setEntityType(entityType) {
            data.entityType = entityType;
        }

        function getEntityType() {
            return data.entityType;
        }


        function setColumns(columns) {
            data.columns = columns;
        }

        function getColumns() {
            return data.columns;
        }

        function setGroups(groups) {
            data.groups = groups;
        }

        function getGroups() {
            return data.groups;
        }

        function setFilters(filters) {
            data.filters = filters;
        }

        function getFilters() {
            return data.filters;
        }

        function getPagination() {
            return data.pagination
        }

        function setPagination(pagination) {
            data.pagination = pagination;
        }

        function setAdditions(additions) {
            data.additions = additions;
        }

        function getAdditions() {
            return data.additions
        }

        function setEditorEntityId(id) {
            data.editorEntityId = id;
        }

        function getEditorEntityId() {
            return data.editorEntityId;
        }

        function setEditorTemplateUrl(templateUrl) {
            data.editorTemplateUrl = templateUrl;
        }

        function getEditorTemplateUrl() {
            return data.editorTemplateUrl;
        }

        function setComponents(components) {
            data.components = components
        }

        function getComponents() {
            return data.components
        }

        function setReportOptions(options) {
            data.reportOptions = options;
        }

        function getReportOptions() {
            return data.reportOptions
        }

        function setStatusData(status) {
            data.status.data = status
        }

        function getStatusData() {
            return data.status.data;
        }

        function setProjection(projection) {
            data.projection = projection
        }

        function getProjection() {
            return data.projection;
        }

        function setData(obj) {

            console.log('setData.obj', obj);

            data.data[obj.___id] = obj
        }

        function getData(hashId) {

            if (hashId) {
                return data.data[hashId];
            }

            return data.data;
        }

        function resetData() {

            data.data = {};

            var rootHash = stringHelper.toHash('root');
            var defaultRootGroup = getDefaultRootGroup();

            setData(defaultRootGroup);

        }

        function getRootGroupData() {
            return data.data[rootHash]
        }

        function setLastClickInfo(click) {
            data.lastClickInfo = click;
        }

        function getLastClickInfo() {
            return data.lastClickInfo;
        }


        function setRequestParameters(requestParameters) {

            data.requestParameters[requestParameters.id] = requestParameters;

        }

        function resetRequestParameters() {
            data.requestParameters = {};
        }

        function getRequestParameters(id) {

            // console.log('data.requestParameters', data.requestParameters);

            if (data.requestParameters[id]) {
                return data.requestParameters[id]
            } else {

                var groups = getGroups();

                var defaultParameters = {};

                if (groups.length) {

                    defaultParameters = {
                        requestType: 'groups',
                        id: id,
                        groups_level: 1, // 0 is for root
                        event: {
                            groupName: null,
                            groupId: null,
                            parentGroupId: null
                        },
                        body: {
                            groups_types: [groups[0]].map(function (item) {
                                    if (item.id) {
                                        return item.id
                                    } else {
                                        return item.key
                                    }
                                }
                            ),
                            page: 1,
                            groups_values: [],
                            groups_order: 'asc'
                        }
                    };

                } else {

                    defaultParameters = {
                        requestType: 'objects',
                        id: id,
                        groups_level: 1, // 0 is for root
                        event: {
                            groupName: null,
                            groupId: null,
                            parentGroupId: null
                        },
                        body: {
                            groups_types: [],
                            page: 1,
                            groups_values: [],
                            groups_order: 'asc'
                        }
                    };

                }

                return defaultParameters;
            }
        }

        function getAllRequestParameters() {
            return data.requestParameters;
        }

        function getActiveRequestParameters() {

            if (data.activeRequestParametersId) {
                return getRequestParameters(data.activeRequestParametersId);
            }

        }

        function setActiveRequestParametersId(id) {
            data.activeRequestParametersId = id;
        }

        function setActiveObject(obj) {
            data.activeObject = obj
        }

        function setActiveColumnSort(column) {
            data.activeColumnSort = column;
        }

        function getActiveColumnSort() {
            return data.activeColumnSort;
        }

        function setActiveGroupTypeSort(group) {
            data.activeGroupTypeSort = group;
        }

        function getActiveGroupTypeSort() {
            return data.activeGroupTypeSort;
        }

        function getActiveObject() {
            return data.activeObject;
        }

        function getRowHeight() {
            return data.virtualScroll.rowHeight;
        }

        function getRequestThreshold() {
            return data.virtualScroll.requestThreshold;
        }

        function setLastRequestOffset(offset) {
            return data.virtualScroll.lastRequestOffset = offset;
        }

        function getLastRequestOffset() {
            return data.virtualScroll.lastRequestOffset;
        }

        function getVirtualScrollStep() {
            return data.virtualScroll.step;
        }

        function setVirtualScrollOffset(offset) {
            data.virtualScroll.offset = offset;
        }

        function getVirtualScrollOffset() {
            return data.virtualScroll.offset;
        }

        function getVirtualScrollReserveTop() {
            return data.virtualScroll.reserveTop;
        }

        function getVirtualScrollReserveBottom() {
            return data.virtualScroll.reserveBottom;
        }

        function setVirtualScrollLimit(limit) {
            data.virtualScroll.limit = limit;
        }

        function getVirtualScrollLimit() {
            return data.virtualScroll.limit;
        }

        return {

            setRootEntityViewer: setRootEntityViewer,
            isRootEntityViewer: isRootEntityViewer,

            setEntityType: setEntityType,
            getEntityType: getEntityType,

            setColumns: setColumns,
            getColumns: getColumns,

            setGroups: setGroups,
            getGroups: getGroups,

            setFilters: setFilters,
            getFilters: getFilters,

            getPagination: getPagination,
            setPagination: setPagination,

            setAdditions: setAdditions,
            getAdditions: getAdditions,

            setEditorEntityId: setEditorEntityId,
            getEditorEntityId: getEditorEntityId,

            setEditorTemplateUrl: setEditorTemplateUrl,
            getEditorTemplateUrl: getEditorTemplateUrl,

            setComponents: setComponents,
            getComponents: getComponents,

            setReportOptions: setReportOptions,
            getReportOptions: getReportOptions,

            setStatusData: setStatusData,
            getStatusData: getStatusData,

            setProjection: setProjection,
            getProjection: getProjection,

            setData: setData,
            resetData: resetData,
            getData: getData,

            getRootGroupData: getRootGroupData,

            setLastClickInfo: setLastClickInfo,
            getLastClickInfo: getLastClickInfo,

            setRequestParameters: setRequestParameters,
            getRequestParameters: getRequestParameters,

            getActiveRequestParameters: getActiveRequestParameters,
            setActiveRequestParametersId: setActiveRequestParametersId,

            resetRequestParameters: resetRequestParameters,
            getAllRequestParameters: getAllRequestParameters,

            setActiveObject: setActiveObject,
            getActiveObject: getActiveObject,

            getRowHeight: getRowHeight,
            getRequestThreshold: getRequestThreshold,
            getVirtualScrollStep: getVirtualScrollStep,

            setLastRequestOffset: setLastRequestOffset,
            getLastRequestOffset: getLastRequestOffset,

            setActiveColumnSort: setActiveColumnSort,
            getActiveColumnSort: getActiveColumnSort,

            setActiveGroupTypeSort: setActiveGroupTypeSort,
            getActiveGroupTypeSort: getActiveGroupTypeSort,

            setVirtualScrollOffset: setVirtualScrollOffset,
            getVirtualScrollOffset: getVirtualScrollOffset,

            getVirtualScrollReserveTop: getVirtualScrollReserveTop,
            getVirtualScrollReserveBottom: getVirtualScrollReserveBottom,

            setVirtualScrollLimit: setVirtualScrollLimit,
            getVirtualScrollLimit: getVirtualScrollLimit,

            getInterfaceLayout: getInterfaceLayout

        }
    }

}());