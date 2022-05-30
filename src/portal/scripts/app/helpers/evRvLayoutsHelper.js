(function () {

    'use strict';

	const uiService = require('../services/uiService');
	const metaContentTypesService = require('../services/metaContentTypesService');

	const evEvents = require('../services/entityViewerEvents');

	const toastNotificationService = require('../../../../core/services/toastNotificationService');
	const localStorageService = require('../../../../shell/scripts/app/services/localStorageService');

	const metaHelper = require('./meta.helper');
	const objectComparisonHelper = require('./objectsComparisonHelper');

    let getLinkingToFilters = function (layout) {

        let linkingToFilters = [];

        layout.data.filters.forEach(function (filter) {

            if (filter.options.use_from_above) {

                if (typeof filter.options.use_from_above === 'object') {

                    if (Object.keys(filter.options.use_from_above).length) {

                        let filterObj = {
                            key: filter.options.use_from_above.key,
                            name: filter.name,
                            filter_type: filter.options.filter_type
                        };

                        if (filter.layout_name) {
                            filterObj.layout_name = filter.layout_name;
                        }

                        linkingToFilters.push(filterObj);

                    }


                } else {

                    let filterObj = {
                        key: filter.options.use_from_above,
                        name: filter.name,
                        filter_type: filter.options.filter_type
                    };

                    if (filter.layout_name) {
                        filterObj.layout_name = filter.layout_name;
                    }

                    linkingToFilters.push(filterObj);

                }

            }

        });

        return linkingToFilters;
    };

    let getDataForLayoutSelectorWithFilters = function (layouts) {

        let result = [];

        layouts.forEach(function (layout) {

            let layoutObj = {
                id: layout.id,
                name: layout.name,
                user_code: layout.user_code,
                //content_type: layout.content_type,
                content: []
            };

            layoutObj.content = getLinkingToFilters(layout);

            result.push(layoutObj);

        });

        return result;

    };

    const saveRowTypeFiltersToLocalStorage = function (entityViewerDataService, isReport) {

        const rowTypeFilters = entityViewerDataService.getRowTypeFilters();

        if (rowTypeFilters) {

        	const color = rowTypeFilters.markedRowFilters || 'none';
			const entityType = entityViewerDataService.getEntityType();

			localStorageService.cacheRowTypeFilter(isReport, entityType, color);

        }

    };

    const saveLayoutList = function (entityViewerDataService, isReport) {

        saveRowTypeFiltersToLocalStorage(entityViewerDataService, isReport);

    	var currentLayoutConfig = entityViewerDataService.getLayoutCurrentConfiguration(isReport);

		if (currentLayoutConfig.hasOwnProperty('id')) {

			uiService.updateListLayout(currentLayoutConfig.id, currentLayoutConfig).then(function (updatedLayoutData) {

                let listLayout = updatedLayoutData;

                entityViewerDataService.setListLayout(listLayout);
                entityViewerDataService.setActiveLayoutConfiguration({layoutConfig: currentLayoutConfig});

				toastNotificationService.success("Success. Page was saved.");

			});

		}

	};

    /* const getLayoutByUserCode = function (entityType, userCode) {

		const contentType = metaContentTypesService.findContentTypeByEntity(entityType, 'ui');

		return uiService.getListLayout(
			null,
			{
				pageSize: 1000,
				filters: {
					content_type: contentType,
					user_code: userCode
				}
			}
		);

	}; */
	/**
	 * @memberOf module:evRvLayoutsHelper
	 *
	 * @param isRootEntityViewer {boolean}
	 * @param evDataService {Object}
	 * @param evEventService {Object}
	 * @param layout {Object}
	 */
	const applyLayout = function (isRootEntityViewer, evDataService, evEventService, layout) {

		/*if (isRootEntityViewer) {

			evDataService.setListLayout(layout);
			evDataService.setActiveLayoutConfiguration({layoutConfig: layout});

			evEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

			// toastNotificationService.success("New layout with name '" + layout.name + "' created");

			evDataService.setIsNewLayoutState(false);

		} else { // split panel

			evDataService.setSplitPanelLayoutToOpen(layout.id);
			evEventService.dispatchEvent(evEvents.LIST_LAYOUT_CHANGE);

		}*/
		evDataService.setListLayout(layout);
		evDataService.setActiveLayoutConfiguration({layoutConfig: layout});

		evEventService.dispatchEvent(evEvents.LAYOUT_NAME_CHANGE);

		// toastNotificationService.success("New layout with name '" + layout.name + "' created");

		evDataService.setIsNewLayoutState(false);

	};

	/**
	 *
	 * @param layoutToOverwrite {Object}
	 * @param listLayout {Object}
	 * @returns {Promise<any>}
	 */
	const overwriteLayout = (layoutToOverwrite, listLayout) => {

		const id = layoutToOverwrite.id;

		listLayout.id = id;
		layoutToOverwrite.data = listLayout.data;
		layoutToOverwrite.name = listLayout.name;

		return uiService.updateListLayout(id, layoutToOverwrite);

	};
	/**
	 * @memberOf module:evRvLayoutsHelper
	 *
	 * @param evDataService {Object} - entityViewerDataService
	 * @param evEventService {Object} - entityViewerEventService
	 * @param isReport {boolean}
	 * @param $mdDialog {Object}
	 * @param entityType {string}
	 * @param $event {Object} - event object
	 * @return {Promise<any>} - saved layout or error
	 */
    const saveAsLayoutList = function (evDataService, evEventService, isReport, $mdDialog, entityType, $event) {

    	return new Promise((resolve, reject) => {

			const listLayout = evDataService.getLayoutCurrentConfiguration(isReport);
			const isRootEntityViewer = evDataService.isRootEntityViewer();
			/* $mdDialog.show({
				controller: 'UiLayoutSaveAsDialogController as vm',
				templateUrl: 'views/dialogs/ui/ui-layout-save-as-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				locals: {
					options: {
						label: "Save layout as",
						layoutName: listLayout.name,
						complexSaveAsLayoutDialog: {
							entityType: entityType
						}
					}
				},
				clickOutsideToClose: false

			}) */
			$mdDialog.show({
				controller: 'NewLayoutDialogController as vm',
				templateUrl: 'views/dialogs/new-layout-dialog-view.html',
				parent: angular.element(document.body),
				targetEvent: $event,
				preserveScope: false,
				locals: {
					data: {
						entityType: entityType,
						name: listLayout.name,
					}
				}
			})
			.then(res => {

				if (res.status === 'agree') {

					const saveAsLayout = function () {

						listLayout.name = res.data.name;
						listLayout.user_code = res.data.user_code;

						uiService.createListLayout(entityType, listLayout).then(function (data) {

							applyLayout(isRootEntityViewer, evDataService, evEventService, data);
							toastNotificationService.success("Layout '" + listLayout.name + "' saved.");

							resolve({status: res.status, layoutData: data});

						}).catch(error => {
							reject({status: res.status, error: error});
						});

					};

					if (isRootEntityViewer) listLayout.is_default = true; // default layout for split panel does not have is_default === true

					if (listLayout.id) { // if layout based on another existing layout

						delete listLayout.id;
						saveAsLayout();

					} else { // if layout was not based on another layout
						saveAsLayout();
					}

				}
				else if (res.status === 'overwrite') {

					const userCode = res.data.user_code;

					listLayout.name = res.data.name;
					listLayout.user_code = userCode;

					uiService.getListLayoutByUserCode(entityType, userCode).then(function (layoutToOverwriteData) {

						const layoutToOverwrite = layoutToOverwriteData.results[0];
						overwriteLayout(layoutToOverwrite, listLayout).then(function (updatedLayoutData) {

							/* if (isRootEntityViewer) listLayout.is_default = true; // default layout for split panel does not have is_default === true
							listLayout.modified = updatedLayoutData.modified; */

							applyLayout(isRootEntityViewer, evDataService, evEventService, updatedLayoutData);
							toastNotificationService.success("Success. Layout " + listLayout.name + " overwritten.");

							resolve({status: res.status});

						}).catch(error => reject({status: res.status, error: error}));

					});

				}
				else {
					resolve({status: 'disagree'});
				}

			});

		});

	};

	const clearSplitPanelAdditions = function (evDataService) {

		var interfaceLayout = evDataService.getInterfaceLayout();
		interfaceLayout.splitPanel.height = 0;

		evDataService.setInterfaceLayout(interfaceLayout);

		var additions = evDataService.getAdditions();

		additions.isOpen = false;
		additions.type = '';
		delete additions.layoutData;

		evDataService.setSplitPanelStatus(false);
		evDataService.setAdditions(additions);

	};

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

	const addLayoutChangeListeners = function (evDataService) {

		const activeLayoutConfig = evDataService.getActiveLayoutConfiguration();

		if (activeLayoutConfig && activeLayoutConfig.data) {

			var groupsChangeEventIndex = evEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

				var originalGroups = activeLayoutConfig.data.grouping;
				var currentGroups = evDataService.getGroups();

				if (!areObjTheSame(currentGroups, originalGroups)) {
					layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var columnsChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

				var originalColumns = activeLayoutConfig.data.columns;
				var currentColumns = scope.evDataService.getColumns();

				if (!areObjTheSame(currentColumns, originalColumns)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var columnsSortChangeEventIndex = scope.evEventService.addEventListener(evEvents.COLUMN_SORT_CHANGE, function () {

				var originalColumns = activeLayoutConfig.data.columns;
				var currentColumns = scope.evDataService.getColumns();

				if (!areObjTheSame(currentColumns, originalColumns)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var rceEventIndex = scope.evEventService.addEventListener(evEvents.RESIZE_COLUMNS_END, function () {

				var originalColumns = activeLayoutConfig.data.columns;
				var currentColumns = scope.evDataService.getColumns();

				if (!areObjTheSame(currentColumns, originalColumns)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
					scope.$apply();
				}

			});

			var filtersChangeEventIndex = scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

				var originalFilters = activeLayoutConfig.data.filters;
				var currentFilters = scope.evDataService.getFilters();

				if (!areObjTheSame(currentFilters, originalFilters)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var additionsChangeEventIndex = scope.evEventService.addEventListener(evEvents.ADDITIONS_CHANGE, function () {

				var originAdditions = activeLayoutConfig.data.additions;
				var currentAdditions = scope.evDataService.getAdditions();

				if (!areObjTheSame(originAdditions, currentAdditions)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var utvEventIndex = scope.evEventService.addEventListener(evEvents.UPDATE_TABLE_VIEWPORT, function () {

				var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
				var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

				if (!areObjTheSame(originInterfaceLayout, currentInterfaceLayout)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
				}

			});

			var tfaEventIndex = scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {

				var originInterfaceLayout = activeLayoutConfig.data.interfaceLayout;
				var currentInterfaceLayout = scope.evDataService.getInterfaceLayout();

				if (!areObjTheSame(originInterfaceLayout, currentInterfaceLayout)) {
					scope.layoutChanged = true;
					removeChangesTrackingEventListeners();
					scope.$apply();
				}

			});

			var evpcEventIndex = scope.evEventService.addEventListener(evEvents.ENTITY_VIEWER_PAGINATION_CHANGED, function () {
				scope.layoutChanged = true;
				removeChangesTrackingEventListeners();
			});

			if (scope.isReport) {

				var roChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

					if (!areReportOptionsTheSame()) {
						scope.layoutChanged = true;
						removeChangesTrackingEventListeners();
					}

				});

				var rtvChangedEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_TABLE_VIEW_CHANGED, function () {

					var originalColumns = activeLayoutConfig.data.columns;
					var currentColumns = scope.evDataService.getColumns();

					var originalRootGroupOptions = activeLayoutConfig.data.rootGroupOptions;
					var currentRootGroupOptions = scope.evDataService.getRootGroupOptions();

					var originalGroups = activeLayoutConfig.data.grouping;
					var currentGroups = scope.evDataService.getGroups();

					if (!areObjTheSame(originalColumns, currentColumns) ||
						!areObjTheSame(originalGroups, currentGroups) ||
						!areObjTheSame(originalRootGroupOptions, currentRootGroupOptions) ||
						!areReportOptionsTheSame()) {
						scope.layoutChanged = true;
						removeChangesTrackingEventListeners();

					}

				});

				var reoChangeEventIndex = scope.evEventService.addEventListener(evEvents.REPORT_EXPORT_OPTIONS_CHANGED, function () {

					var originalReportExportOptions = activeLayoutConfig.data.export;
					var currentReportExportOptions = scope.evDataService.getExportOptions();

					if (!areObjTheSame(originalReportExportOptions, currentReportExportOptions)) {
						scope.layoutChanged = true;
						removeChangesTrackingEventListeners();
					}

				});

				var viewTypeChangedEI = scope.evEventService.addEventListener(evEvents.VIEW_TYPE_CHANGED, function () {

					var originalViewType = activeLayoutConfig.data.viewType;
					var originalViewSettings = activeLayoutConfig.data.viewSettings;

					var currentViewType = scope.evDataService.getViewType();
					var currentViewSettings = null;

					if (originalViewType === currentViewType) {

						if (currentViewType) {
							currentViewSettings = scope.evDataService.getViewSettings(currentViewType);
						}

						if (!areObjTheSame(originalViewSettings, currentViewSettings)) {
							scope.layoutChanged = true;
							removeChangesTrackingEventListeners();
						}

					} else {
						scope.layoutChanged = true;
						removeChangesTrackingEventListeners();
					}

				});

			} else {

				var evSettingsIndex = scope.evEventService.addEventListener(evEvents.ENTITY_VIEWER_SETTINGS_CHANGED, function () {

					var originalEvSettings = activeLayoutConfig.data.ev_options;
					var evSettings = scope.evDataService.getEntityViewerOptions();

					if (!areObjTheSame(originalEvSettings, evSettings)) {
						scope.layoutChanged = true;
						removeChangesTrackingEventListeners();
					}

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
			changesTrackingEvents.DATA_LOAD_END = dleEventIndex;
			changesTrackingEvents.ENTITY_VIEWER_PAGINATION_CHANGED = evpcEventIndex;
			changesTrackingEvents.VIEW_TYPE_CHANGED = viewTypeChangedEI;
			// Entity viewer specific tracking
			changesTrackingEvents.ENTITY_VIEWER_SETTINGS_CHANGED = evSettingsIndex;
		}

	};

	const statesWithLayoutsList = [
		'app.portal.reports.balance-report',
		'app.portal.reports.pl-report',
		'app.portal.reports.transaction-report',

		'app.portal.data.portfolio',
		'app.portal.data.account',
		'app.portal.data.account-type',
		'app.portal.data.counterparty',
		'app.portal.data.responsible',
		'app.portal.data.instrument',
		'app.portal.data.instrument-type',
		'app.portal.data.complex-transaction',
		'app.portal.data.transaction',
		'app.portal.data.transaction-type',
		'app.portal.data.currency-history',
		'app.portal.data.price-history',
		'app.portal.data.currency',
		'app.portal.data.strategy-group',
		'app.portal.data.strategy',
	];

    /** @module evRvLayoutsHelper */
    module.exports = {
        getLinkingToFilters: getLinkingToFilters,
        getDataForLayoutSelectorWithFilters: getDataForLayoutSelectorWithFilters,

		saveLayoutList: saveLayoutList,
		saveAsLayoutList: saveAsLayoutList,

		clearSplitPanelAdditions: clearSplitPanelAdditions,

		statesWithLayouts: statesWithLayoutsList,
    }

}());