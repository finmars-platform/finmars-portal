(function () {

    'use strict';

	var stringHelper = require('../helpers/stringHelper');
    var metaHelper = require('../helpers/meta.helper');
    var reportHelper = require('../helpers/reportHelper');

    var getDefaultInterfaceLayout = function () {

        var sidebarWidth = 160;
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
			topPart: {
				height: 50
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
            verticalSplitPanel: {
                width: 0
            },
            splitPanel: {
                height: 0
            },
            evLeftPanel: {
                width: 230
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

    var emptyUseFromAboveFilters = function (filters) {

        filters.forEach(function (filter) {
            if (filter.options.use_from_above && Object.keys(filter.options.use_from_above).length > 0) {
                filter.options.filter_values = [];
            }
        });

    };
	/** @module entityViewerDataService */
    module.exports = function () {

        var data = {
            columns: [],
            groups: [],
            rootGroupOptions: {
                subtotal_type: false
            },
            filters: [],
            rowTypeFilters: {
                markedRowFilters: 'none'
            },
			useFromAboveFilters: [],
            pagination: {
                page_size: 60
            },
            status: {
                data: null
            },
            allRowsSelected: false,
            activeGroupTypeSort: null,
            activeColumnSort: null,
            rootEntityViewer: false,
            splitPanelIsActive: false,
            verticalSplitPanelIsActive: false,
            splitPanelDefaultLayout: {}, // serves to manage default layout inside split panel
            splitPanelLayoutToOpen: null,
            additions: {},
            report: {},
            export: {},
            data: {},
            sourceData: {},
            layoutToOpen: null,
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
            viewContext: '', // can be: reconciliation_viewer, dashboard, entity_viewer, reconciliation_viewer, split_panel
            viewType: 'report_viewer',
            viewSettings: {},
            lastViewSettings: {},
            ev_options: {},
            activeLayoutConfiguration: {}, // used to check layout for changes
            interfaceLayout: null,
            requestParameters: {},
            activeRequestParametersId: null,
            lastClickInfo: {},
            unfilteredFlatList: [],
            flatList: [],
            projection: [],
            activeObject: null,
            activeObjectsCount: 0,
            dataLoadEnded: false,
            markedSubtotals: {},
			rowSettings: {},
            missingCustomFields: {
                forFilters: [],
                forColumns: [],
            },
			warnAboutLayoutChangesLoss: true,
			isNewLayout: false // does layout exist on server
        };

        var dashboardData = {
            keysOfColumnsToHide: [],
            columnsTextAlign: '',
            reportDataFromDashboard: false
        };

        data.interfaceLayout = getDefaultInterfaceLayout();

        var rootHash = stringHelper.toHash('root');
        var defaultRootGroup = getDefaultRootGroup();

        setData(defaultRootGroup);
        setActiveRequestParametersId(defaultRootGroup.___id);

        function getInterfaceLayout() {
            return data.interfaceLayout;
        }

        function setInterfaceLayout(interfaceLayout) {
            data.interfaceLayout = interfaceLayout;
        }

        function toggleRightSidebar (collapse) {

        	var interfaceLayout = getInterfaceLayout();

            if (collapse || interfaceLayout.filterArea.width === 239) {

                interfaceLayout.filterArea.width = 74;
                interfaceLayout.filterArea.collapsed = true;

            } else {

                interfaceLayout.filterArea.width = 239;
                interfaceLayout.filterArea.collapsed = false;

            }

            setInterfaceLayout(interfaceLayout);

        }

        function setRootEntityViewer(isRootEntityViewer) {
            data.rootEntityViewer = isRootEntityViewer;
        }

        function isRootEntityViewer() {
            return data.rootEntityViewer;
        }

        function setUseFromAbove(useFromAbove) {
            data.useFromAbove = useFromAbove;
        }

        function getUseFromAbove() {
            return data.useFromAbove;
        }

        function setSplitPanelStatus(status) {
            data.splitPanelIsActive = status;
        }

        function isSplitPanelActive() {
            return data.splitPanelIsActive;
        }

        function setVerticalSplitPanelStatus(status) {
            data.verticalSplitPanelIsActive = status;
        }

        function isVerticalSplitPanelActive() {
            return data.verticalSplitPanelIsActive;
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
            if (!Array.isArray(data.columns)) {
                return [];
            }

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
            if (!Array.isArray(data.groups)) {
                return [];
            }

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

        function setRowTypeFilters (color) {
            data.rowTypeFilters = {
                markedRowFilters: color
            };
        }

        function getRowTypeFilters () {
            return data.rowTypeFilters;
        }

        function getPagination() {
            return data.pagination
        }

        function setPagination(pagination) {

            if (pagination) {
                data.pagination = pagination;
            }

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

        function setVerticalAdditions(additions) {
            data.verticalAdditions = additions;
        }

        function getVerticalAdditions() {

            if (!data.verticalAdditions) {
                return {};
            }

            return data.verticalAdditions
        }

        function setEditorTemplateUrl(templateUrl) {
            data.editorTemplateUrl = templateUrl;
        }

        function getEditorTemplateUrl() {
            return data.editorTemplateUrl;
        }

        function setComponents(components) {
            data.components = components;
        }

        function getComponents() {
            return data.components;
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

        function setProjectionLastFrom(from) {
            data.projection_last_from = from
        }

        function getProjectionLastFrom() {
            return data.projection_last_from;
        }

        function getProjection() {
            return data.projection;
        }

        function setFlatList(flatList) {
            data.flatList = flatList;
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

            // data.flatList.forEach(function (row) {
            //
            //     if (row.___id === item.___id) {
            //         row = item;
            //     }
            //
            // })


            data.flatList = data.flatList.map(function (row) {

                if (row.___id === item.___id) {
                    return item
                }

                return row
            })

        }

        function setData(obj) {
            data.data[obj.___id] = obj;
        }

        function setAllData(data) {
            data.data = data;
        }

        function setSourceData(obj) {
            data.sourceData[obj.___id] = obj;
        }

        function getSourceData(hashId) {

            if (hashId) {
                return data.sourceData[hashId];
            }

            return data.sourceData;
        }

        function setObject(obj) {

            // console.log('setData.obj', obj);

            if (data.data[obj.___parentId] && data.data[obj.___parentId].results && data.data[obj.___parentId].results.length) {

                data.data[obj.___parentId].results = data.data[obj.___parentId].results.map(function (item, index) {

                    if (item.___id === obj.___id) {
                        item = obj;
                    }

                    return item

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

            return result;

        }

        function getData(hashId) {

            if (hashId) {
                return data.data[hashId];
            }

            return data.data;
        }

        function getRootGroup() {

            var rootHash = stringHelper.toHash('root');

            return data.data[rootHash];

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

            console.log('defaultRootGroup', defaultRootGroup);

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

        function resetRequestParameters() { // resets number of row's pages
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
                        },
                        pagination: {
                            page: 1,
                            page_size: data.pagination.page_size,
                            count: 1
                        },
                        requestedPages: [1],
                        processedPages: []
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
                        },
                        pagination: {
                            page: 1,
                            page_size: data.pagination.page_size,
                            count: 1
                        },
                        requestedPages: [1],
                        processedPages: []
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

        function resetTableContent () {

        	resetData();
			resetRequestParameters();

			var rootGroup = getRootGroupData();

			setActiveRequestParametersId(rootGroup.___id);

		}


        // Activated Row just for selection purpose
        // Active Object for Split panel,

        function setLastActivatedRow(obj) {
            data.lastActivatedRow = obj;
        }

        function getLastActivatedRow() {
            return data.lastActivatedRow;
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

        function setActiveObjectActionData(actionData) {
            data.activeObjectActionData = actionData;
        }

        function getActiveObjectActionData() {
            return data.activeObjectActionData;
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

        function setRowHeight(height) {
            return data.virtualScroll.rowHeight = height;
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

		function setIsNewLayoutState (state) {
			data.isNewLayout = state;
		}

		function isLayoutNew () {
			return data.isNewLayout;
		}

        function setActiveLayoutConfiguration(options) {

            if (options && options.layoutConfig) {

                data.activeLayoutConfiguration = options.layoutConfig;

            } else {

                var listLayout = metaHelper.recursiveDeepCopy(getListLayout());

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

                /*if (isRootEntityViewer()) {
                    listLayout.data.additions = JSON.parse(JSON.stringify(getAdditions()));
                }*/
                listLayout.data.additions = JSON.parse(JSON.stringify(getAdditions()));

                if (options) {

                    if (options.isReport) {

                        listLayout.data.reportOptions = metaHelper.recursiveDeepCopy(getReportOptions());
                        listLayout.data.reportLayoutOptions = metaHelper.recursiveDeepCopy(getReportLayoutOptions());
                        listLayout.data.rootGroupOptions = metaHelper.recursiveDeepCopy(getRootGroupOptions());

                        if (getExportOptions()) {
                            listLayout.data.export = metaHelper.recursiveDeepCopy(getExportOptions());
                        }

                        var viewType = getViewType();
                        var viewSettings = getViewSettings(viewType);

                        listLayout.data.viewType = viewType;
                        listLayout.data.viewSettings = {};

                        if (viewSettings) {
                            listLayout.data.viewSettings[viewType] = getViewSettings(viewType);
                        }

                        /* delete listLayout.data.reportOptions.items;
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
                        delete listLayout.data.reportOptions.item_accounts; */
						listLayout.data.reportOptions = reportHelper.cleanReportOptionsFromTmpProps(listLayout.data.reportOptions);

                    } else {
                        listLayout.data.pagination = getPagination();
                    }

                }

                data.activeLayoutConfiguration = listLayout;

            }

        }

        function getActiveLayoutConfiguration() {
            return data.activeLayoutConfiguration;
        }

        function getLayoutCurrentConfiguration(isReport) {

            var listLayout = metaHelper.recursiveDeepCopy(getListLayout());

            listLayout.data.columns = getColumns();
            listLayout.data.grouping = getGroups();
            listLayout.data.filters = getFilters();

			listLayout.data.columns.forEach(column => delete column.frontOptions);
			listLayout.data.grouping.forEach(group => delete group.frontOptions);

            emptyUseFromAboveFilters(listLayout.data.filters);

            listLayout.data.rowSettings = getRowSettings();
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

                listLayout.data.reportOptions = metaHelper.recursiveDeepCopy(getReportOptions());
                listLayout.data.reportLayoutOptions = metaHelper.recursiveDeepCopy(getReportLayoutOptions());
                listLayout.data.rootGroupOptions = metaHelper.recursiveDeepCopy(getRootGroupOptions());

                if (getExportOptions()) {
                    listLayout.data.export = metaHelper.recursiveDeepCopy(getExportOptions());
                }

                var viewType = getViewType();
                var viewSettings = getViewSettings(viewType);

                listLayout.data.viewType = viewType;
                listLayout.data.viewSettings = {};

                if (viewSettings) {
                    listLayout.data.viewSettings[viewType] = viewSettings;
                }

                /* delete listLayout.data.reportOptions.items;
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
				delete listLayout.data.reportOptions.item_accounts; */
				listLayout.data.reportOptions = reportHelper.cleanReportOptionsFromTmpProps(listLayout.data.reportOptions);

			}

            else {

                listLayout.data.pagination = getPagination();
                listLayout.data.ev_options = getEntityViewerOptions();

            }

            return listLayout;
        }

        function setLayoutCurrentConfiguration(activeListLayout, uiService, isReport) {

            var listLayout;

            if (activeListLayout) {

                listLayout = Object.assign({}, activeListLayout);

            }

            else {

                var defaultList = uiService.getListLayoutTemplate();

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
                var rootGroupOptions = getRootGroupOptions();

                var newReportOptions = Object.assign({}, reportOptions, listLayout.data.reportOptions);
                var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, listLayout.data.reportLayoutOptions);
                var newRootGroupOptions = Object.assign({}, rootGroupOptions, listLayout.data.rootGroupOptions);

                setReportOptions(newReportOptions);
                setReportLayoutOptions(newReportLayoutOptions);
                setRootGroupOptions(newRootGroupOptions);

                setExportOptions(listLayout.data.export);

                var viewType = listLayout.data.viewType;

                if (viewType) {
                    setViewType(viewType);

                    if (listLayout.data.viewSettings && listLayout.data.viewSettings[viewType]) {
                        setViewSettings(viewType, listLayout.data.viewSettings[viewType]);
                    }
                }

            }

            else {

                setPagination(listLayout.data.pagination);

                var entityViewerOptions = listLayout.data.ev_options;

                if (!entityViewerOptions) {

                    entityViewerOptions = {
                        // complex_transaction_filters: ['ignored', 'locked', 'partially_visible'],
                        entity_filters: ['enabled', 'disabled', 'active', 'inactive']
                    }

                // } else if (!entityViewerOptions.complex_transaction_filters) {
                //
                //     entityViewerOptions.complex_transaction_filters = ['ignored', 'locked', 'partially_visible'];
                //
                //
                // } else if (!entityViewerOptions.entity_filters){
                } else if (!entityViewerOptions.entity_filters){

                    entityViewerOptions.entity_filters = ['enabled', 'disabled', 'active', 'inactive'];
                }

                setEntityViewerOptions(entityViewerOptions);

            }

            setColumns(listLayout.data.columns);
            setGroups(listLayout.data.grouping);
            emptyUseFromAboveFilters(listLayout.data.filters);
            setFilters(listLayout.data.filters);

            /*if (isRootEntityViewer()) {
                setAdditions(listLayout.data.additions);
            }*/
            setAdditions(listLayout.data.additions);

            setListLayout(listLayout);

            const setActiveColumn = async (column) => {

                if (column.options && column.options.sort) {

                    if (column.groups) {
                        setActiveGroupTypeSort(column);
                    } else {
                        setActiveColumnSort(column);
                    }

                    if (column.options.sort_mode === 'manual') {

                        const {results} = await uiService.getColumnSortDataList({
                            filters: {
                                user_code: column.manual_sort_layout_user_code
                            }
                        });

                        if (results.length) {

                            const layout = results[0];
                            setColumnSortData(column.key, layout.data);

                        }

                    }

                }

            };

            data.columns.forEach(setActiveColumn);
            data.groups.forEach(setActiveColumn);

            listLayout.data.components = {
				filterArea: true,
				topPart: true,
            	columnArea: true,
                viewer: true,
                sidebar: true,
                // groupingArea: true,
                columnAreaHeader: true,
                splitPanel: true,
                addEntityBtn: true,
                fieldManagerBtn: true,
                layoutManager: true,
                autoReportRequest: false
            };

            if (isReport) {
				listLayout.data.components.groupingArea = false
			}

            setComponents(listLayout.data.components);
            setEditorTemplateUrl('views/additions-editor-view.html');

        }

        function setSplitPanelDefaultLayout(layoutData) {
            data.splitPanelDefaultLayout = layoutData;
        }

        function getSplitPanelDefaultLayout() {
            return data.splitPanelDefaultLayout;
        }

        function setSplitPanelLayoutToOpen(layoutName) {
            data.splitPanelLayoutToOpen = layoutName;
        }

        function getSplitPanelLayoutToOpen() {
            var splitPanelActiveLayoutName = data.splitPanelLayoutToOpen;
            data.splitPanelLayoutToOpen = false;
            return splitPanelActiveLayoutName;
        }

        function setViewType(viewType) {
            return data.viewType = viewType;
        }

        function getViewType() {
            return data.viewType;
        }

        function setViewSettings(viewType, settings) {

            data.lastViewSettings[viewType] = JSON.parse(JSON.stringify(data.viewSettings));

            return data.viewSettings[viewType] = settings;
        }

        function getViewSettings(viewType) {
            return data.viewSettings[viewType];
        }

        function getLastViewSettings(viewType) {
            return data.lastViewSettings[viewType];
        }

        function setViewContext(vContext) {
            data.viewContext = vContext;
        }

        function getViewContext() {
            return data.viewContext;
        }

        function setEntityViewerOptions(evOptions) {
            data.ev_options = evOptions;
        }

        function getEntityViewerOptions() {
            return data.ev_options;
        }

        function setCurrentMember(member) {
            data.currentMember = member;
        }

        function getCurrentMember() {
            return data.currentMember
        }

        function setReconciliationData(reconData) {
            data.reconciliation = reconData
        }

        function getReconciliationData() {
            return data.reconciliation
        }
        
        function setReconciliationFile(parsedFile){
            data.reconciliationParsedFile = parsedFile
        }
        
        function getReconciliationFile() {
            return data.reconciliationParsedFile;
        }

        function setReconciliationDataService(service) {
            data.reconciliationDataService = service
        }

        function getReconciliationDataService() {
            return data.reconciliationDataService
        }

        function setReconciliationEventService(service) {
            data.reconciliationEventService = service
        }

        function getReconciliationEventService() {
            return data.reconciliationEventService
        }

        function setReconciliationImportConfig(config) {
            data.reconImportConfig = config
        }

        function getReconciliationImportConfig() {
            return data.reconImportConfig;
        }

        function setParentDataService(dataService) {
            data.parentDataService = dataService
        }

        function getParentDataService() {
            return data.parentDataService
        }

        function setParentEventService(eventService) {
            data.parentEventService = eventService
        }

        function getParentEventService() {
            return data.parentEventService
        }

        function setDataLoadStatus(isEnded) {
            data.dataLoadEnded = isEnded;
        }

        function didDataLoadEnd() {
            return data.dataLoadEnded;
        }

        // START: Methods for dashboard
        function setKeysOfColumnsToHide (keys) {
            dashboardData.keysOfColumnsToHide = keys;
        }

        function getKeysOfColumnsToHide () {
            if (!Array.isArray(dashboardData.keysOfColumnsToHide)) {
                return [];
            }

            return dashboardData.keysOfColumnsToHide
        }

        function setColumnsTextAlign (alignDirection) {
            dashboardData.columnsTextAlign = alignDirection;
        }

        function getColumnsTextAlign () {
            return dashboardData.columnsTextAlign;
        }

        function isReportDateFromDashboard () {
            return dashboardData.reportDataFromDashboard;
        }

        function setReportDateFromDashboardProp (fromDashboard) {
            dashboardData.reportDataFromDashboard = fromDashboard;
        }
        // END: Methods for dashboard

        function setMissingPrices(prices) {
            data.missingPrices = prices;
        }

        function getMissingPrices() {
            return data.missingPrices;
        }

        function setMarkedSubtotals (markedSubtotals) {
            data.markedSubtotals = markedSubtotals;
        }

        function getMarkedSubtotals() {
            return data.markedSubtotals;
        }

        function setCrossEntityAttributeExtensions(items) {
            data.crossEntityAttributeExtensions = items;
        }

        function getCrossEntityAttributeExtensions() {
            return data.crossEntityAttributeExtensions;
        }

        function setColumnSortData(key, item) {

            if(!data.columnSortData) {
                data.columnSortData = {}
            }

            data.columnSortData[key] = item;
        }

        function getColumnSortData(key) {

            if (data.columnSortData && data.columnSortData.hasOwnProperty(key)) {
                return data.columnSortData[key];
            }

            return null;
        }

		function setRowSettings (rowSettings) {
			data.rowSettings = rowSettings;
		}

        function getRowSettings () {
			return data.rowSettings || {};
		}

        function setMissingCustomFields(options) {

            if (!options) {
                data.missingCustomFields = {
                    forFilters: [],
                    forColumns: [],
                };
            }

            if (options.forFilters) {
                data.missingCustomFields.forFilters = options.forFilters;
            }

            if (options.forColumns) {
                data.missingCustomFields.forColumns = options.forColumns;
            }
        }

        function getMissingCustomFields() {
            return data.missingCustomFields;
        }

		/**
		 * Setting status to false allows to skip layout changes loss warning once
		 *
		 * @param status {boolean}
		 * @memberOf module:entityViewerDataService
		 */
		function setLayoutChangesLossWarningState (status) {
        	data.warnAboutLayoutChangesLoss = status;
		}

		/**
		 * If warnAboutLayoutChangesLoss === false, turns warning back on before returning false
		 *
		 *@memberOf module:entityViewerDataService
		 */
		function isLayoutChangesLossWarningNeeded() {

			if (!data.warnAboutLayoutChangesLoss) {

				data.warnAboutLayoutChangesLoss = true;
				return false;

			}

			return data.warnAboutLayoutChangesLoss;

		}

        // MATERIAL DESIGN ENTITY VIEWER LOGIC

        function setSelectedGroups(groups) {
		    data.selectedGroups = groups
        }

        function getSelectedGroups(){
            return data.selectedGroups || [];
        }

        function setSelectedGroupsMultiselectState(state) {
            data.selectedGroupsMultiselectState = state
        }

        function getSelectedGroupsMultiselectState(){
            return data.selectedGroupsMultiselectState;
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

            setVerticalAdditions: setVerticalAdditions,
            getVerticalAdditions: getVerticalAdditions,

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

            setProjectionLastFrom: setProjectionLastFrom,
            getProjectionLastFrom: getProjectionLastFrom,

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
            getRootGroup: getRootGroup,

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

			resetTableContent: resetTableContent,

            setActiveObjectFromAbove: setActiveObjectFromAbove,
            getActiveObjectFromAbove: getActiveObjectFromAbove,

            setActiveObject: setActiveObject,
            getActiveObject: getActiveObject,
            clearActiveObject: clearActiveObject,
            setActiveObjectAction: setActiveObjectAction,
            getActiveObjectAction: getActiveObjectAction,

            setActiveObjectActionData: setActiveObjectActionData,
            getActiveObjectActionData: getActiveObjectActionData,

            getRowHeight: getRowHeight,
            setRowHeight: setRowHeight,
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
			setColumnSortData: setColumnSortData,
			getColumnSortData: getColumnSortData,

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

            toggleRightSidebar: toggleRightSidebar,

            setExportOptions: setExportOptions,
            getExportOptions: getExportOptions,

            setListLayout: setListLayout,
            getListLayout: getListLayout,
			setIsNewLayoutState: setIsNewLayoutState,
			isLayoutNew: isLayoutNew,
            getActiveLayoutConfiguration: getActiveLayoutConfiguration,
            setActiveLayoutConfiguration: setActiveLayoutConfiguration,
            getLayoutCurrentConfiguration: getLayoutCurrentConfiguration,
            setLayoutCurrentConfiguration: setLayoutCurrentConfiguration,
			setLayoutChangesLossWarningState: setLayoutChangesLossWarningState,
			isLayoutChangesLossWarningNeeded: isLayoutChangesLossWarningNeeded,

            setSplitPanelStatus: setSplitPanelStatus,
            isSplitPanelActive: isSplitPanelActive,
            setVerticalSplitPanelStatus: setVerticalSplitPanelStatus,
            isVerticalSplitPanelActive: isVerticalSplitPanelActive,
            setSplitPanelDefaultLayout: setSplitPanelDefaultLayout,
            getSplitPanelDefaultLayout: getSplitPanelDefaultLayout,
            setSplitPanelLayoutToOpen: setSplitPanelLayoutToOpen,
            getSplitPanelLayoutToOpen: getSplitPanelLayoutToOpen,

            setLastActivatedRow: setLastActivatedRow,
            getLastActivatedRow: getLastActivatedRow,

            setUseFromAbove: setUseFromAbove,
            getUseFromAbove: getUseFromAbove,

            setViewType: setViewType,
            getViewType: getViewType,

            setViewSettings: setViewSettings,
            getViewSettings: getViewSettings,

            getLastViewSettings: getLastViewSettings,

            setViewContext: setViewContext,
            getViewContext: getViewContext,

            setEntityViewerOptions: setEntityViewerOptions,
            getEntityViewerOptions: getEntityViewerOptions,

            setCurrentMember: setCurrentMember,
            getCurrentMember: getCurrentMember,

            setReconciliationData: setReconciliationData,
            getReconciliationData: getReconciliationData,

            setReconciliationDataService: setReconciliationDataService,
            getReconciliationDataService: getReconciliationDataService,

            setReconciliationEventService: setReconciliationEventService,
            getReconciliationEventService: getReconciliationEventService,

            setReconciliationImportConfig: setReconciliationImportConfig,
            getReconciliationImportConfig: getReconciliationImportConfig,

            setReconciliationFile: setReconciliationFile,
            getReconciliationFile: getReconciliationFile,

            setParentDataService: setParentDataService,
            getParentDataService: getParentDataService,

            setParentEventService: setParentEventService,
            getParentEventService: getParentEventService,

            setDataLoadStatus: setDataLoadStatus,
            didDataLoadEnd: didDataLoadEnd,

            setMissingPrices: setMissingPrices,
            getMissingPrices: getMissingPrices,

            setRowTypeFilters: setRowTypeFilters,
            getRowTypeFilters: getRowTypeFilters,

            setMarkedSubtotals: setMarkedSubtotals,
            getMarkedSubtotals: getMarkedSubtotals,

            setCrossEntityAttributeExtensions: setCrossEntityAttributeExtensions,
            getCrossEntityAttributeExtensions: getCrossEntityAttributeExtensions,

			setRowSettings: setRowSettings,
			getRowSettings: getRowSettings,

            setMissingCustomFields: setMissingCustomFields,
            getMissingCustomFields: getMissingCustomFields,

            setSelectedGroupsMultiselectState: setSelectedGroupsMultiselectState,
            getSelectedGroupsMultiselectState: getSelectedGroupsMultiselectState,

            dashboard: {
                setKeysOfColumnsToHide: setKeysOfColumnsToHide,
                getKeysOfColumnsToHide: getKeysOfColumnsToHide,
                setColumnsTextAlign: setColumnsTextAlign,
                getColumnsTextAlign: getColumnsTextAlign,
                setReportDateFromDashboardProp: setReportDateFromDashboardProp,
                isReportDateFromDashboard: isReportDateFromDashboard
            },

            getSelectedGroups: getSelectedGroups,
            setSelectedGroups: setSelectedGroups

        }
    }

}());
