(function () {

	'use strict';

	const evEvents = require('../../../../services/entityViewerEvents');

	const evHelperService = require('../../../../services/entityViewerHelperService');
	// const EventService = require('../../../../services/eventService');

	module.exports = function ($mdDialog, $state, $bigDrawer) {
		return {
			require: '^^gFilters',
			restrict: 'E',
			scope: {
				evDataService: '=',
				evEventService: '=',
				attributeDataService: '=',
			},
			templateUrl: 'views/directives/groupTable/filters/g-filters-ev-rv-view.html',
			link: function (scope, elem, attrs, gFiltersVm) {

				scope.entityType = gFiltersVm.entityType;
				scope.isReport = false;
				scope.isRootEntityViewer = scope.evDataService.isRootEntityViewer();
				scope.showFrontFilters = true;

				scope.readyStatus = {
					filters: false
				}

				scope.popupPosX = gFiltersVm.popupPosX;
				scope.popupPosY = gFiltersVm.popupPosY;
				scope.fpBackClasses = gFiltersVm.fpBackClasses;
				scope.fpClasses = gFiltersVm.fpClasses;

				const gFiltersLeftPartWidth = elem[0].querySelector('.gFiltersLeftPart').clientWidth;
				const gFiltersRightPartWidth = elem[0].querySelector('.gFiltersRightPart').clientWidth;
				let filtersChipsContainer = elem[0].querySelector(".gFiltersContainerWidth");

				let filters = scope.evDataService.getFilters();
				let customFields = scope.attributeDataService.getCustomFieldsByEntityType(scope.entityType);

				scope.evGetEntityNameByState = function () {

					switch ($state.current.name) {
						case 'app.data.portfolio':
							return "PORTFOLIO";
							break;
						case 'app.data.account':
							return "ACCOUNT";
							break;
						case 'app.data.counterparty':
							return "COUNTERPARTY";
							break;
						case 'app.data.counterparty-group':
							return "COUNTERPARTY GROUP";
							break;
						case 'app.data.responsible':
							return "RESPONSIBLE";
							break;
						case 'app.data.responsible-group':
							return "RESPONSIBLE GROUP";
							break;
						case 'app.data.instrument':
							return "INSTRUMENT";
							break;
						case 'app.data.transaction':
							return "TRANSACTION";
							break;
						case 'app.data.price-history':
							return "PRICE HISTORY";
							break;
						case 'app.data.currency-history':
							return "CURRENCY HISTORY";
							break;
						case 'app.data.strategy':
							return "STRATEGY";
							break;
						case 'app.data.strategy-subgroup':
							return "STRATEGY SUBGROUP";
							break;
						case 'app.data.strategy-group':
							return "STRATEGY GROUP";
							break;
						case 'app.data.account-type':
							return "ACCOUNT TYPES";
							break;
						case 'app.data.instrument-type':
							return "INSTRUMENT TYPES";
							break;
						/* case 'app.data.pricing-policy':
							return "PRICING POLICY";
							break; */
						case 'app.data.transaction-type':
							return "TRANSACTION TYPE";
							break;
						case 'app.data.transaction-type-group':
							return "TRANSACTION TYPE GROUP";
							break;
						case 'app.data.currency':
							return "CURRENCY";
							break;
						case 'app.data.complex-transaction':
							return "TRANSACTION";
							break;
						case 'app.data.tag':
							return "TAG";
							break;
						default:
							return "ENTITIY";
							break;
					}
				};

				scope.evAddEntity = async function () {

					let editLayout, entity = {};

					switch (scope.entityType) {

						case 'transaction-type':

							editLayout = await uiService.getDefaultEditLayout(scope.entityType);
							evHelperService.openTTypeAddDrawer(
								scope.evDataService,
								scope.evEventService,
								editLayout,
								$bigDrawer,
								scope.entityType,
								entity
							);

							break;

						case 'complex-transaction':

							editLayout = await uiService.getDefaultEditLayout(scope.entityType);

							evHelperService.openComplexTransactionAddDrawer(
								scope.evDataService,
								scope.evEventService,
								editLayout,
								$bigDrawer,
								scope.entityType,
								entity
							);

							break;

						default:

							editLayout = await uiService.getDefaultEditLayout(scope.entityType);
							evHelperService.openEntityViewerAddDrawer(
								scope.evDataService,
								scope.evEventService,
								editLayout,
								$bigDrawer,
								scope.entityType,
								entity
							);

							break;

					}

				};

				scope.evApplyDatabaseFilters = function () {
					scope.evDataService.resetTableContent();
					scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
				};

				//region Chips
				const formatFiltersForChips = function () {
					console.log("testing.formatFiltersForChips ", filters);
					scope.filtersChips = [];

					const errors = [];
					const shownFilters = scope.showFrontFilters ? filters.frontend : filters.backend;
					console.log("testing.formatFiltersForChips filtersList", shownFilters, scope.showFrontFilters);
					shownFilters.forEach(filter => {

						const filterOpts = filter.options || {};
						let filterVal = filterOpts.filter_values || "";

						let filterData = {
							id: filter.key,
							isActive: filterOpts.enabled
						};

						const filterName = filter.layout_name ? filter.layout_name : filter.name;

						let chipText = gFiltersVm.getChipTextElem(filterName, filterVal);

						filterData.text = chipText;

						if (filter.key.startsWith('custom_fields')) {

							let error;

							[filter, filterData, error] = gFiltersVm.checkCustomFieldFilterForError(filter, filterData, customFields);
							if (error) errors.push(error);

						}

						scope.filtersChips.push(filterData);

					});

					if (errors.length) gFiltersVm.updateMissingCustomFieldsList(errors);

					gFiltersVm.updateFilterAreaHeight();

					console.log("testing.formatFiltersForChips filtersChips", scope.filtersChips);

				};

				scope.onFilterChipClick = gFiltersVm.onFilterChipClick;
				scope.filterSettingsChange = gFiltersVm.filterSettingsChange;

				scope.onChipsFirstRender = gFiltersVm.onChipsFirstRender;

				scope.addFilter = function ($event) {

					const shownFilters = scope.showFrontFilters ? filters.frontend : filters.backend;

					gFiltersVm.openAddFilterDialog($event, shownFilters).then(res => {
						console.log("testing.addFilter res", res);
						if (res.status === 'agree') {

							if (scope.showFrontFilters) {
								filters.frontend.push(res.data);

							} else {
								filters.backend.push(res.data);
							}
							console.log("testing.addFilter filters", filters);
							scope.evDataService.setFilters(filters);
							scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

						}

					});

				};

				scope.removeFilter = function (filtersToRemove) {

					const filterRemovedFilters = filter => {
						return filtersToRemove.find(item => item.id !== filter.key);
					};

					if (scope.showFrontFilters) {
						filters.frontend = filters.frontend.filter(filterRemovedFilters);

					} else {
						filters.backend = filters.backend.filter(filterRemovedFilters);
					}

					scope.evDataService.setFilters(filters);

					scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
					scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

				};
				//endregion

				scope.toggleFiltersToShow = function () {
					scope.showFrontFilters = !scope.showFrontFilters;
					formatFiltersForChips();
				};

				scope.toggleSplitPanel = gFiltersVm.toggleSplitPanel;

				scope.exportAsCSV = gFiltersVm.exportAsCSV;
				scope.exportAsExcel = gFiltersVm.exportAsExcel;
				scope.copyReport = gFiltersVm.copyReport;
				scope.copySelectedToBuffer = gFiltersVm.copySelectedToBuffer;

				scope.openViewConstructor = gFiltersVm.openViewConstructor;

				scope.openCustomFieldsManager = function ($event) {

					$mdDialog.show({
						controller: 'AttributesManagerDialogController as vm',
						templateUrl: 'views/dialogs/attributes-manager-dialog-view.html',
						targetEvent: $event,
						multiple: true,
						locals: {
							data: {
								entityType: scope.entityType
							}
						}
					});

				};

				scope.openInputFormEditor = function (ev) {

					$mdDialog.show({
						controller: 'EntityDataConstructorDialogController as vm',
						templateUrl: 'views/dialogs/entity-data-constructor-dialog-view.html',
						targetEvent: ev,
						multiple: true,
						locals: {
							data: {
								entityType: scope.entityType
							}
						}
					});

				};

				const initEventListeners = function () {

					// placed here because formatFiltersForChips() should be called only after customFields update
					scope.evEventService.addEventListener(evEvents.DYNAMIC_ATTRIBUTES_CHANGE, function () {
						customFields = scope.attributeDataService.getCustomFieldsByEntityType(scope.entityType);
						formatFiltersForChips();
					});

					scope.evEventService.addEventListener(evEvents.TABLE_SIZES_CALCULATED, function () {
						gFiltersVm.calculateFilterChipsContainerWidth(gFiltersLeftPartWidth, gFiltersRightPartWidth, filtersChipsContainer);
					});

					scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

						filters = scope.evDataService.getFilters();

						formatFiltersForChips();

						setTimeout(function () { // wait until DOM elems reflow after ng-repeat

							const filterAreaHeightChanged = gFiltersVm.updateFilterAreaHeight();

							if (filterAreaHeightChanged) {
								scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);
							}

						}, 0);

					});

				};

				const init = function () {

					// separateEvFilters();

					scope.popupEventService = gFiltersVm.popupEventService;
					scope.chipsListEventService = gFiltersVm.chipsListEventService;

					scope.popupData = gFiltersVm.popupData;

					formatFiltersForChips();

					scope.readyStatus.filters = true;

					gFiltersVm.updateFilterAreaHeightOnInit();

					initEventListeners();

				};

				init();

			}
		}
	}

})();