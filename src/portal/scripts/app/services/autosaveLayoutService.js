'use strict';

import evEvents from "./entityViewerEvents";
import objectComparisonHelper from "../helpers/objectsComparisonHelper";
import metaHelper from "../helpers/meta.helper";
import reportHelper from "../helpers/reportHelper";
import utilsHelper from "../helpers/utils.helper";

export default function () {

    let changesTrackingEvents = {
        GROUPS_CHANGE: null,
        COLUMNS_CHANGE: null,
        COLUMN_SORT_CHANGE: null,
        RESIZE_COLUMNS_END: null,
        FILTERS_CHANGE: null,
        ADDITIONS_CHANGE: null,
        UPDATE_TABLE_VIEWPORT: null,
        TOGGLE_FILTER_AREA: null,
        REPORT_OPTIONS_CHANGE: null,
        REPORT_TABLE_VIEW_CHANGED: null,
        REPORT_EXPORT_OPTIONS_CHANGED: null,
        DATA_LOAD_END: null,
        ENTITY_VIEWER_PAGINATION_CHANGED: null,
        VIEW_TYPE_CHANGED: null
    };

    const removeChangesTrackingEventListeners = function (evEventService) {

        var trackingEventsListenerNames = Object.keys(changesTrackingEvents);

        for (var i = 0; i < trackingEventsListenerNames.length; i++) {

            var telName = trackingEventsListenerNames[i];

            if (changesTrackingEvents[telName]) { // execute only if event listener has been added
                evEventService.removeEventListener(evEvents[telName], changesTrackingEvents[telName]);
            }

        }

    };

    const areObjTheSame = function (data1, data2) {

        if (typeof data1 === 'object' && typeof data2 === 'object') {

            return objectComparisonHelper.areObjectsTheSame(data1, data2);

        } else {

            if (data1 !== data2) {
                return false;
            }

            return true;

        }

    };

    const areReportOptionsTheSame = function (activeLayoutConfig, evDataService) {

        var originalReportOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportOptions);

        var originReportLayoutOptions = metaHelper.recursiveDeepCopy(activeLayoutConfig.data.reportLayoutOptions);

        if (originReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
            delete originalReportOptions.pl_first_date;
            delete originalReportOptions.begin_date;
        }

        if (originReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
            delete originalReportOptions.report_date;
            delete originalReportOptions.end_date;
        }

        delete originalReportOptions.task_id;
        delete originalReportOptions.recieved_at;
        delete originalReportOptions.task_status;


        var currentReportOptions = metaHelper.recursiveDeepCopy(evDataService.getReportOptions());

        var currentReportLayoutOptions = metaHelper.recursiveDeepCopy(evDataService.getReportLayoutOptions());

        if (currentReportLayoutOptions.datepickerOptions.reportFirstDatepicker.datepickerMode !== 'datepicker') {
            delete currentReportOptions.pl_first_date;
            delete currentReportOptions.begin_date;
        }

        if (currentReportLayoutOptions.datepickerOptions.reportLastDatepicker.datepickerMode !== 'datepicker') {
            delete currentReportOptions.report_date;
            delete currentReportOptions.end_date;
        }

        delete currentReportOptions.task_id;
        delete currentReportOptions.recieved_at;
        delete currentReportOptions.task_status;
        /* delete currentReportOptions.items;
        delete currentReportOptions.item_complex_transactions;
        delete currentReportOptions.item_counterparties;
        delete currentReportOptions.item_responsibles;
        delete currentReportOptions.item_strategies3;
        delete currentReportOptions.item_strategies2;
        delete currentReportOptions.item_strategies1;
        delete currentReportOptions.item_portfolios;
        delete currentReportOptions.item_instruments;
        delete currentReportOptions.item_instrument_pricings;
        delete currentReportOptions.item_instrument_accruals;
        delete currentReportOptions.item_currency_fx_rates;
        delete currentReportOptions.item_currencies;
        delete currentReportOptions.item_accounts; */
        currentReportOptions = reportHelper.cleanReportOptionsFromTmpProps(currentReportOptions);

        if (areObjTheSame(originalReportOptions, currentReportOptions) &&
            areObjTheSame(originReportLayoutOptions, currentReportLayoutOptions)) {

            return true;

        } else {
            return false;
        }

    };

    let autosaveTimeoutId;
    let testId = 0;

    const autosaveLayout = function (evDataService, isReport) {
        testId += 1;
        const autosaveLayoutId = testId;
        console.log("testing1 autosaveLayout" + autosaveLayoutId + " called");
        console.trace();
        var currentLayoutConfig = evDataService.getLayoutCurrentConfiguration(isReport);

        // clearTimeout(autosaveTimeoutId);

        autosaveTimeoutId = setTimeout(function () {
            console.log("testing1 autosaveLayout" + autosaveLayoutId + " autosaveListLayout");
            // uiService.autosaveListLayout(currentLayoutConfig);

        }, 5000);

    };

    const onLayoutChange = function (current, original, evDataService, isReport) {
        console.log("testing1 onLayoutChange called");
        clearTimeout(autosaveTimeoutId);

        if (!areObjTheSame(current, original)) {
            autosaveLayout(evDataService, isReport);
        }

    }

    const initListenersForAutosaveLayout = function (evDataService, evEventService, isReport) {
        console.log("testing initListenersForAutosaveLayout", isReport);

        const groupsChangeEventIndex = evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originalGroups = activeLayoutConfig.data.grouping;
            const currentGroups = evDataService.getGroups();

            /*if (!areObjTheSame(currentGroups, originalGroups)) {
                autosaveLayout(evDataService, isReport);
            }*/
            onLayoutChange(currentGroups, originalGroups, evDataService, isReport);

        });

        const columnsChangeEventIndex = evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originalColumns = activeLayoutConfig.data.columns;
            const currentColumns = scope.evDataService.getColumns();

            /*if (!areObjTheSame(currentColumns, originalColumns)) {
                autosaveLayout(evDataService, isReport);
            }*/
            onLayoutChange(originalColumns, currentColumns, evDataService, isReport);

        });

        const columnsSortChangeEventIndex = evEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            var originalColumns = activeLayoutConfig.data.columns;
            var currentColumns = evDataService.getColumns();

            /*if (!areObjTheSame(currentColumns, originalColumns)) {
                autosaveLayout(evDataService, isReport);
            }*/
            onLayoutChange(originalColumns, currentColumns, evDataService, isReport);

        });

        const rceEventIndex = evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originalColumns = activeLayoutConfig.data.columns;
            const currentColumns = evDataService.getColumns();

            /*if (!areObjTheSame(currentColumns, originalColumns)) {
                autosaveLayout(evDataService, isReport);
            }*/
            onLayoutChange(originalColumns, currentColumns, evDataService, isReport);

        });

        const filtersChangeEventIndex = evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {
            console.log("testing1 FILTERS_CHANGE");
            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originalFilters = activeLayoutConfig.data.filters;
            const currentFilters = evDataService.getFilters();
            console.log("testing1 FILTERS_CHANGE");
            /* if (!areObjTheSame(currentFilters, originalFilters)) {
                autosaveLayout(evDataService, isReport);
            } */
            onLayoutChange(originalFilters, currentFilters, evDataService, isReport);

        });

        const additionsChangeEventIndex = evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originAdditions = activeLayoutConfig.data.additions;
            const currentAdditions = evDataService.getAdditions();

            /* if (!areObjTheSame(originAdditions, currentAdditions)) {
                autosaveLayout(evDataService, isReport);
            } */
            onLayoutChange(originAdditions, currentAdditions, evDataService, isReport);

        });

        const onUpdateTableViewport = utilsHelper.debounce(function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
            const currentInterfaceLayout = evDataService.getInterfaceLayout();

            onLayoutChange(originInterfaceLayout, currentInterfaceLayout, evDataService, isReport);

        }, 500);

        const utvEventIndex = evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, onUpdateTableViewport);

        const tfaEventIndex = evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

            const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
            const originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
            const currentInterfaceLayout = evDataService.getInterfaceLayout();

            /* if (!areObjTheSame(originInterfaceLayout, currentInterfaceLayout)) {
                autosaveLayout(evDataService, isReport);
            } */
            onLayoutChange(originInterfaceLayout, currentInterfaceLayout, evDataService, isReport);

        });

        const evpcEventIndex = evEventService.addEventListener(evEvents.ENTITY_VIEWER_PAGINATION_CHANGED, function () {
            clearTimeout(autosaveTimeoutId);
            autosaveLayout(evDataService, isReport);
        });

        let roChangeEventIndex,
            rtvChangedEventIndex,
            reoChangeEventIndex,
            viewTypeChangedEI,
            evSettingsIndex;

        if (isReport) {

            roChangeEventIndex = evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();

                if (!areReportOptionsTheSame(activeLayoutConfig, evDataService)) {

                    clearTimeout(autosaveTimeoutId);
                    autosaveLayout(evDataService, isReport);

                }

            });

            rtvChangedEventIndex = evEventService.addEventListener(evEvents.REPORT_TABLE_VIEW_CHANGED, function () {

                const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();

                const originalColumns = activeLayoutConfig.data.columns;
                const currentColumns = evDataService.getColumns();

                const originalRootGroupOptions = activeLayoutConfig.data.rootGroupOptions;
                const currentRootGroupOptions = evDataService.getRootGroupOptions();

                const originalGroups = activeLayoutConfig.data.grouping;
                const currentGroups = evDataService.getGroups();

                if (!areObjTheSame(originalColumns, currentColumns) ||
                    !areObjTheSame(originalGroups, currentGroups) ||
                    !areObjTheSame(originalRootGroupOptions, currentRootGroupOptions) ||
                    !areReportOptionsTheSame(activeLayoutConfig, evDataService)) {

                    clearTimeout(autosaveTimeoutId);
                    autosaveLayout(evDataService, isReport);

                }

            });

            reoChangeEventIndex = evEventService.addEventListener(evEvents.REPORT_EXPORT_OPTIONS_CHANGED, function () {

                const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
                const originalReportExportOptions = activeLayoutConfig.data.export;
                const currentReportExportOptions = evDataService.getExportOptions();

                onLayoutChange(originalReportExportOptions, currentReportExportOptions, evDataService, isReport);

            });

            viewTypeChangedEI = evEventService.addEventListener(evEvents.VIEW_TYPE_CHANGED, function () {

                const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();

                const originalViewType = activeLayoutConfig.data.viewType;
                const originalViewSettings = activeLayoutConfig.data.viewSettings;

                const currentViewType = evDataService.getViewType();
                let currentViewSettings = null;

                if (originalViewType === currentViewType) {

                    if (currentViewType) {
                        currentViewSettings = evDataService.getViewSettings(currentViewType);
                    }

                    /*if (!areObjTheSame(originalViewSettings, currentViewSettings)) {
                        autosaveLayout(evDataService, isReport);
                    }*/
                    onLayoutChange(originalViewSettings, currentViewSettings, evDataService, isReport);


                } else {
                    clearTimeout(autosaveTimeoutId);
                    autosaveLayout(evDataService, isReport);
                }

            });

        }
        else {

            evSettingsIndex = evEventService.addEventListener(evEvents.ENTITY_VIEWER_SETTINGS_CHANGED, function () {

                const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();
                const originalEvSettings = activeLayoutConfig.data.ev_options;
                const evSettings = evDataService.getEntityViewerOptions();

                /*if (!areObjTheSame(originalEvSettings, evSettings)) {
                    autosaveLayout(evDataService, isReport);
                }*/
                onLayoutChange(originalEvSettings, evSettings, evDataService, isReport);

            });

        }

        changesTrackingEvents.GROUPS_CHANGE = groupsChangeEventIndex;
        changesTrackingEvents.COLUMNS_CHANGE = columnsChangeEventIndex;
        changesTrackingEvents.COLUMN_SORT_CHANGE = columnsSortChangeEventIndex;
        changesTrackingEvents.RESIZE_COLUMNS_END = rceEventIndex;
        changesTrackingEvents.FILTERS_CHANGE = filtersChangeEventIndex;
        changesTrackingEvents.ADDITIONS_CHANGE = additionsChangeEventIndex;
        changesTrackingEvents.UPDATE_TABLE_VIEWPORT = utvEventIndex;
        changesTrackingEvents.TOGGLE_FILTER_AREA = tfaEventIndex;
        changesTrackingEvents.REPORT_OPTIONS_CHANGE = roChangeEventIndex;
        changesTrackingEvents.REPORT_TABLE_VIEW_CHANGED = rtvChangedEventIndex;
        // Report viewer specific tracking
        changesTrackingEvents.REPORT_EXPORT_OPTIONS_CHANGED = reoChangeEventIndex;
        // changesTrackingEvents.DATA_LOAD_END = dleEventIndex;
        changesTrackingEvents.ENTITY_VIEWER_PAGINATION_CHANGED = evpcEventIndex;
        changesTrackingEvents.VIEW_TYPE_CHANGED = viewTypeChangedEI;
        // Entity viewer specific tracking
        changesTrackingEvents.ENTITY_VIEWER_SETTINGS_CHANGED = evSettingsIndex;

    };

    return {
        initListenersForAutosaveLayout: initListenersForAutosaveLayout,
        removeChangesTrackingEventListeners: removeChangesTrackingEventListeners
    }

}