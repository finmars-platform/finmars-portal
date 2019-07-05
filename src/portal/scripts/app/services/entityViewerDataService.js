(function () {

    var stringHelper = require('../helpers/stringHelper');
    var metaService = require('../services/metaService');

    var getDefaultInterfaceLayout = function () {

        var sidebarWidth = 200;
        var sidebarHeight = document.body.clientHeight;

        var headerToolbarHeight = 64;
        var headerToolbarWidth = document.body.clientWidth - sidebarWidth;

        // var groupingAreaHeight = 88;
        var groupingAreaHeight = 98;
        var columnAreaHeight = 70;
        var progressBarHeight = 4;
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
            mainContent: {
                height: 0
            },
            groupingArea: {
                collapsed: false,
                left: sidebarWidth,
                top: headerToolbarHeight,
                height: groupingAreaHeight
            },
            columnArea: {
                collapsed: false,
                left: sidebarWidth,
                top: headerToolbarHeight + groupingAreaHeight,
                height: columnAreaHeight
            },
            progressBar: {
                height: progressBarHeight
            },
            filterArea: {
                left: filterAreaLeft,
                top: headerToolbarHeight,
                width: filterAreaWidth
            },
            splitPanel: {
                height: 0
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
        obj.___group_name = 'root';
        obj.___is_open = true;
        obj.___id = rootHash;
        obj.___parentId = null;
        obj.___type = 'group';
        obj.___level = 0;

        return obj

    };

    module.exports = function () {

        var data = {
            columns: [],
            groups: [],
            rootGroupOptions: {},
            filters: [],
            pagination: {
                page: 1,
                items_per_page: 60,
                total_items: 1
            },
            status: {
                data: null
            },
            allRowsSelected: false,
            rootEntityViewer: false,
            isSplitPanelActive: false,
            additions: {},
            report: {},
            export: {},
            data: {},
            listLayout: {},
            virtualScroll: {
                reserveTop: 10,
                reserveBottom: 20,
                requestThreshold: 20,
                lastRequestOffset: 0,
                rowHeight: 24,
                offset: 0, // current position
                offsetPx: 0,
                limit: 0, // total rows
                step: 60, // rows to render
                direction: null
            },
            activeLayoutConfiguration: {},
            interfaceLayout: null,
            requestParameters: {},
            activeRequestParametersId: null,
            lastClickInfo: {},
            activeLayoutConfiguration: {},
            unfilteredFlatList: [],
            flatList: [],
            projection: [],
            activeObject: null,
            activeObjectsCount: 0
        };

        data.interfaceLayout = getDefaultInterfaceLayout();

        var rootHash = stringHelper.toHash('root');
        var defaultRootGroup = getDefaultRootGroup();

        setData(defaultRootGroup);
        setActiveRequestParametersId(defaultRootGroup.___id);

        function getInterfaceLayout() {
            return data.interfaceLayout
        }

        function setInterfaceLayout(interfaceLayout) {
            data.interfaceLayout = interfaceLayout
        }

        function setRootEntityViewer(isRootEntityViewer) {
            data.rootEntityViewer = isRootEntityViewer;
        }

        function isRootEntityViewer() {
            return data.rootEntityViewer;
        }

        function setSplitPanelStatus(status) {
            data.isSplitPanelActive = status;
        }

        function isSplitPanelActive() {
            return data.isSplitPanelActive;
        }

        function setEntityType(entityType) {
            data.entityType = entityType;
        }

        function getEntityType() {
            return data.entityType;
        }

        function setContentType(entityType) {
            data.contentType = entityType;
        }

        function getContentType() {
            return data.contentType;
        }


        function setColumns(columns) {

            if (columns) {
                data.columns = columns;
            } else {
                console.error("Set columns error", columns);
                data.columns = [];
            }
        }

        function getColumns() {
            return data.columns;
        }

        function setAttributesFromAbove(attributes) {
            return data.attributesFromAbove = attributes
        }

        function getAttributesFromAbove() {
            return data.attributesFromAbove
        }

        function setGroups(groups) {

            if (groups) {
                data.groups = groups;
            } else {
                console.error("Set groups error", groups);
                data.groups = [];
            }
        }

        function getGroups() {
            return data.groups;
        }

        function setRootGroupOptions(options) {
            data.rootGroupOptions = options;
        }

        function getRootGroupOptions() {
            return data.rootGroupOptions;
        }

        function setFilters(filters) {

            if (filters) {
                data.filters = filters;
            } else {
                console.error("Set filters error", filters);
                data.filters = [];
            }

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

            if (!data.additions) {
                return {};
            }

            return data.additions
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

        function setReportLayoutOptions(options) {
            data.reportLayoutOptions = options;
        }

        function getReportLayoutOptions() {
            return data.reportLayoutOptions;
        }

        function setStatusData(status) {
            data.status.data = status
        }

        function getStatusData() {
            return data.status.data;
        }

        function getSelectAllRowsState() {
            return data.allRowsSelected;
        }

        function setSelectAllRowsState(state) {
            data.allRowsSelected = state;
        }

        function setProjection(projection) {
            data.projection = projection
        }

        function getProjection() {
            return data.projection;
        }

        function setFlatList(flatList) {
            data.flatList = flatList
        }

        function getFlatList() {
            return data.flatList;
        }

        function setUnfilteredFlatList(unfilteredFlatList) {
            data.unfilteredFlatList = unfilteredFlatList;
        }

        function getUnfilteredFlatList() {
            return data.unfilteredFlatList;
        }

        function updateItemInFlatList(item) {

            data.flatList.forEach(function (row) {

                if (row.___id === item.___id) {
                    row = item;
                }

            })

        }

        function setData(obj) {

            data.data[obj.___id] = obj
        }

        function setAllData(data) {
            data.data = data;
        }

        function setObject(obj) {

            // console.log('setData.obj', obj);

            if (data.data[obj.___parentId] && data.data[obj.___parentId].results && data.data[obj.___parentId].results.length) {

                data.data[obj.___parentId].results.forEach(function (item, index) {

                    if (item.___id === obj.___id) {
                        item = obj;
                    }

                })

            } else {
                throw Error('Trying to set not existing object')
            }

        }

        function getObject(objectId, parentId) {

            if (data.data[parentId] && data.data[parentId].results && data.data[parentId].results.length) {

                var result;

                data.data[parentId].results.forEach(function (item) {

                    if (item.___id === objectId) {
                        result = item
                    }

                });

                return result;

            } else {
                throw Error('Object is not exist')
            }
        }

        function getObjects() {

            var groups = getDataAsList();

            var result = [];

            groups.forEach(function (group) {

                group.results.forEach(function (item) {

                    result.push(item)

                });

            });

            return result
        }

        function getData(hashId) {

            if (hashId) {
                return data.data[hashId];
            }

            return data.data;
        }

        function getGroup(hashId) {
            return data.data[hashId];
        }

        function getDataAsList() {

            var keys = Object.keys(data.data);

            var result = [];
            var i;
            var keysLen = keys.length;

            for (i = 0; i < keysLen; i = i + 1) {
                result[i] = data.data[keys[i]]
            }

            return result;

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

        function getRequestParametersAsList() {

            var keys = Object.keys(data.requestParameters);

            var result = [];
            var i;
            var keysLen = keys.length;

            for (i = 0; i < keysLen; i = i + 1) {
                result[i] = data.requestParameters[keys[i]]
            }

            return result;

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
                            ___id: null,
                            groupName: null,
                            groupId: null,
                            parentGroupId: null
                        },
                        body: {
                            groups_types: [groups[0]],
                            page: 1,
                            groups_values: [],
                            groups_order: 'asc',
                            page_size: 60
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
                            groups_order: 'asc',
                            page_size: 60
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

        function setActiveObjectsCount(count) {
            data.activeObjectsCount = count
        }

        function getActiveObjectsCount() {
            return data.activeObjectsCount
        }


        function setActiveObject(obj) {
            data.activeObject = obj
        }

        function setActiveObjectFromAbove(obj) {
            data.activeObjectFromAbove = obj
        }

        function clearActiveObject() {

            var activeObject = getActiveObject();

            if (activeObject) {
                activeObject.___is_activated = false;
                setObject(activeObject);
            }

        }

        function setActiveObjectAction(action) {
            data.activeObjectAction = action;
        }

        function getActiveObjectAction() {
            return data.activeObjectAction;
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

        function getActiveObjectFromAbove() {
            return data.activeObjectFromAbove;
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

        function setVirtualScrollStep(step) {
            return data.virtualScroll.step = step;
        }

        function getVirtualScrollDirection() {
            return data.virtualScroll.direction;
        }

        function setVirtualScrollDirection(direction) {
            return data.virtualScroll.direction = direction;
        }

        function setVirtualScrollOffset(offset) {
            data.virtualScroll.offset = offset;
        }

        function getVirtualScrollOffset() {
            return data.virtualScroll.offset;
        }

        function setVirtualScrollPreviousOffsetPx(offset) {
            data.virtualScroll.previosOffsetPx = offset
        }

        function getVirtualScrollPreviousOffsetPx() {
            return data.virtualScroll.previosOffsetPx;
        }


        function setVirtualScrollOffsetPx(offset) {
            data.virtualScroll.offsetPx = offset
        }

        function getVirtualScrollOffsetPx() {
            return data.virtualScroll.offsetPx;
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

        function setExportOptions(exportOptions) {
            data.export = exportOptions;
        }

        function getExportOptions() {
            return data.export;
        }

        function setListLayout(listLayout) {
            data.listLayout = listLayout;
        }

        function getListLayout() {
            return data.listLayout;
        }

        function setActiveLayoutConfiguration(options) {

            if (options && options.layoutConfig) {

                data.activeLayoutConfiguration = options.layoutConfig;

            } else {

                var listLayout = JSON.parse(JSON.stringify(getListLayout()));

                if (options && options.isReport) {

                    listLayout.data.reportOptions = JSON.parse(JSON.stringify(getReportOptions()));
                    listLayout.data.reportLayoutOptions = JSON.parse(JSON.stringify(getReportLayoutOptions()));

                    if (getExportOptions()) {
                        listLayout.data.export = JSON.parse(JSON.stringify(getExportOptions()));
                    }

                    delete listLayout.data.reportOptions.items;
                    delete listLayout.data.reportOptions.item_complex_transactions;
                    delete listLayout.data.reportOptions.item_counterparties;
                    delete listLayout.data.reportOptions.item_responsibles;
                    delete listLayout.data.reportOptions.item_strategies3;
                    delete listLayout.data.reportOptions.item_strategies2;
                    delete listLayout.data.reportOptions.item_strategies1;
                    delete listLayout.data.reportOptions.item_portfolios;
                    delete listLayout.data.reportOptions.item_instruments;
                    delete listLayout.data.reportOptions.item_instrument_pricings;
                    delete listLayout.data.reportOptions.item_instrument_accruals;
                    delete listLayout.data.reportOptions.item_currency_fx_rates;
                    delete listLayout.data.reportOptions.item_currencies;
                    delete listLayout.data.reportOptions.item_accounts;

                }
                ;

                data.activeLayoutConfiguration = listLayout;

            }

        }

        function getActiveLayoutConfiguration() {
            return data.activeLayoutConfiguration;
        }

        function getLayoutCurrentConfiguration(isReport) {

            var listLayout = JSON.parse(JSON.stringify(getListLayout()));

            listLayout.data.columns = getColumns();
            listLayout.data.grouping = getGroups();
            listLayout.data.filters = getFilters();
            listLayout.data.additions = getAdditions();

            var interfaceLayout = getInterfaceLayout();

            var interfaceLayoutToSave = {};
            interfaceLayoutToSave.groupingArea = {};
            interfaceLayoutToSave.groupingArea.collapsed = interfaceLayout.groupingArea.collapsed;
            interfaceLayoutToSave.groupingArea.height = interfaceLayout.groupingArea.height;
            interfaceLayoutToSave.columnArea = {};
            interfaceLayoutToSave.columnArea.collapsed = interfaceLayout.columnArea.collapsed;
            interfaceLayoutToSave.columnArea.height = interfaceLayout.columnArea.height;

            interfaceLayoutToSave.splitPanel = interfaceLayout.splitPanel;

            listLayout.data.interfaceLayout = interfaceLayoutToSave;

            if (isReport) {

                listLayout.data.reportOptions = JSON.parse(JSON.stringify(getReportOptions()));
                listLayout.data.reportLayoutOptions = JSON.parse(JSON.stringify(getReportLayoutOptions()));

                if (getExportOptions()) {
                    listLayout.data.export = JSON.parse(JSON.stringify(getExportOptions()));
                }

                delete listLayout.data.reportOptions.items;
                delete listLayout.data.reportOptions.item_complex_transactions;
                delete listLayout.data.reportOptions.item_counterparties;
                delete listLayout.data.reportOptions.item_responsibles;
                delete listLayout.data.reportOptions.item_strategies3;
                delete listLayout.data.reportOptions.item_strategies2;
                delete listLayout.data.reportOptions.item_strategies1;
                delete listLayout.data.reportOptions.item_portfolios;
                delete listLayout.data.reportOptions.item_instruments;
                delete listLayout.data.reportOptions.item_instrument_pricings;
                delete listLayout.data.reportOptions.item_instrument_accruals;
                delete listLayout.data.reportOptions.item_currency_fx_rates;
                delete listLayout.data.reportOptions.item_currencies;
                delete listLayout.data.reportOptions.item_accounts;

            }

            return listLayout;
        }

        function setLayoutCurrentConfiguration(activeListLayout, uiService, isReport) {

            var listLayout = {};

            if (activeListLayout.results.length) {

                listLayout = Object.assign({}, activeListLayout.results[0]);

            } else {

                console.log('default triggered');

                var defaultList = uiService.getDefaultListLayout();

                listLayout = {};
                listLayout.data = Object.assign({}, defaultList[0].data);

            }

            if (listLayout.data.interfaceLayout) {

                var interfaceLayout = getInterfaceLayout();
                interfaceLayout = Object.assign(interfaceLayout, listLayout.data.interfaceLayout);
                setInterfaceLayout(interfaceLayout);

            }

            if (isReport) {

                var reportOptions = getReportOptions();
                var reportLayoutOptions = getReportLayoutOptions();
                var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);
                var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, listLayout.data.reportLayoutOptions);

                setReportOptions(newReportOptions);
                setReportLayoutOptions(newReportLayoutOptions);

                setExportOptions(listLayout.data.export);

            }

            setColumns(listLayout.data.columns);
            setGroups(listLayout.data.grouping);
            setFilters(listLayout.data.filters);
            // setAdditions(listLayout.data.additions);

            if (isRootEntityViewer()) {
                setAdditions(listLayout.data.additions);
            }

            setListLayout(listLayout);

            listLayout.data.components = {
                sidebar: true,
                groupingArea: true,
                columnAreaHeader: true,
                splitPanel: true,
                addEntityBtn: true,
                fieldManagerBtn: true,
                layoutManager: true,
                autoReportRequest: false
            };

            setComponents(listLayout.data.components);
            setEditorTemplateUrl('views/additions-editor-view.html');
            // setRootEntityViewer(true); // TODO what?

        }

        return {

            setRootEntityViewer: setRootEntityViewer,
            isRootEntityViewer: isRootEntityViewer,

            setEntityType: setEntityType,
            getEntityType: getEntityType,

            setContentType: setContentType,
            getContentType: getContentType,

            setColumns: setColumns,
            getColumns: getColumns,

            setGroups: setGroups,
            getGroups: getGroups,

            setRootGroupOptions: setRootGroupOptions,
            getRootGroupOptions: getRootGroupOptions,

            setFilters: setFilters,
            getFilters: getFilters,

            setAttributesFromAbove: setAttributesFromAbove,
            getAttributesFromAbove: getAttributesFromAbove,

            getPagination: getPagination,
            setPagination: setPagination,

            setAdditions: setAdditions,
            getAdditions: getAdditions,

            setEditorTemplateUrl: setEditorTemplateUrl,
            getEditorTemplateUrl: getEditorTemplateUrl,

            setComponents: setComponents,
            getComponents: getComponents,

            setReportOptions: setReportOptions,
            getReportOptions: getReportOptions,
            setReportLayoutOptions: setReportLayoutOptions,
            getReportLayoutOptions: getReportLayoutOptions,

            setStatusData: setStatusData,
            getStatusData: getStatusData,

            setProjection: setProjection,
            getProjection: getProjection,

            setFlatList: setFlatList,
            getFlatList: getFlatList,
            setUnfilteredFlatList: setUnfilteredFlatList,
            getUnfilteredFlatList: getUnfilteredFlatList,

            updateItemInFlatList: updateItemInFlatList,

            getSelectAllRowsState: getSelectAllRowsState,
            setSelectAllRowsState: setSelectAllRowsState,

            getGroup: getGroup,
            setData: setData,
            setAllData: setAllData,
            resetData: resetData,
            getData: getData,
            getDataAsList: getDataAsList,

            setObject: setObject,
            getObject: getObject,
            getObjects: getObjects,

            getRootGroupData: getRootGroupData,

            setLastClickInfo: setLastClickInfo,
            getLastClickInfo: getLastClickInfo,

            setRequestParameters: setRequestParameters,
            getRequestParameters: getRequestParameters,
            getRequestParametersAsList: getRequestParametersAsList,

            getActiveRequestParameters: getActiveRequestParameters,
            setActiveRequestParametersId: setActiveRequestParametersId,

            resetRequestParameters: resetRequestParameters,
            getAllRequestParameters: getAllRequestParameters,

            setActiveObjectFromAbove: setActiveObjectFromAbove,
            getActiveObjectFromAbove: getActiveObjectFromAbove,

            setActiveObject: setActiveObject,
            getActiveObject: getActiveObject,
            clearActiveObject: clearActiveObject,
            setActiveObjectAction: setActiveObjectAction,
            getActiveObjectAction: getActiveObjectAction,

            getRowHeight: getRowHeight,
            getRequestThreshold: getRequestThreshold,
            getVirtualScrollStep: getVirtualScrollStep,
            setVirtualScrollStep: setVirtualScrollStep,

            setLastRequestOffset: setLastRequestOffset,
            getLastRequestOffset: getLastRequestOffset,

            setVirtualScrollOffsetPx: setVirtualScrollOffsetPx,
            getVirtualScrollOffsetPx: getVirtualScrollOffsetPx,

            setVirtualScrollPreviousOffsetPx: setVirtualScrollPreviousOffsetPx,
            getVirtualScrollPreviousOffsetPx: getVirtualScrollPreviousOffsetPx,

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

            getVirtualScrollDirection: getVirtualScrollDirection,
            setVirtualScrollDirection: setVirtualScrollDirection,

            getInterfaceLayout: getInterfaceLayout,
            setInterfaceLayout: setInterfaceLayout,

            setExportOptions: setExportOptions,
            getExportOptions: getExportOptions,

            setListLayout: setListLayout,
            getListLayout: getListLayout,

            getActiveLayoutConfiguration: getActiveLayoutConfiguration,
            setActiveLayoutConfiguration: setActiveLayoutConfiguration,

            getLayoutCurrentConfiguration: getLayoutCurrentConfiguration,
            setLayoutCurrentConfiguration: setLayoutCurrentConfiguration,

            setSplitPanelStatus: setSplitPanelStatus,
            isSplitPanelActive: isSplitPanelActive,

            setActiveObjectsCount: setActiveObjectsCount,
            getActiveObjectsCount: getActiveObjectsCount

        }
    }

}());