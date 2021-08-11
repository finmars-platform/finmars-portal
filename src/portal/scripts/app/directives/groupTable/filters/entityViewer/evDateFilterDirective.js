(function () {

	'use strict';

	const specificDataService = require('../../../../services/specificDataService');
	const evEvents = require("../../../../services/entityViewerEvents");
	const popupEvents = require("../../../../services/events/popupEvents");

	module.exports = function (gFiltersHelper) {
		return {
			require: '^^evFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/ev-rv-date-filter-view.html',
			link: function (scope, elem, attrs, filterVm) {

				scope.filter = filterVm.filter;
				scope.isReport = false;
				scope.activeFilter = {
					type: null
				};

				scope.filterTypes = [
					{name: 'Equal', value: 'equal'},
					{name: 'Not equal', value: 'not_equal'},
					{name: 'Greater than', value: 'greater'},
					{name: 'Greater or equal to', value: 'greater_equal'},
					{name: 'Less than', value: 'less'},
					{name: 'Less or equal to', value: 'less_equal'},
					{name: 'From ... to ... (incl)', value: 'from_to'},
					{name: 'Out of range (incl)', value: 'out_of_range'},
					{name: 'Empty cells', value: 'empty'},
					{name: 'Date tree', value: 'date_tree'},
				];

				scope.columnRowsContent = null;

				scope.readyStatus = true;

				const contentType = filterVm.evDataService.getContentType();

				const getDataForSelects = function () {

					scope.readyStatus = false;

					specificDataService.getValuesForSelect(contentType, scope.filter.key, scope.filter.value_type).then(function (data) {

						// var columnRowsContent = userFilterService.getCellValueByKey(scope.evDataService, scope.filter.key);

						scope.columnRowsContent = data.results.map(cRowsContent => {
							return {
								id: cRowsContent, // for text multiselector
								value: cRowsContent, // for text selector
								active: false // for date multiselector
							}
						});

						scope.readyStatus = true;

						scope.$apply();

					})

				};

				scope.dateTreeChanged =function (dateTree) {
					scope.filter.options.filter_values = gFiltersHelper.convertDatesTreeToFlatList(dateTree);
				}

				scope.changeFilterType = function (filterType) {

					const resultList = gFiltersHelper.emptyDateFilter(filterType, scope.filter.options);
					scope.activeFilter.type = resultList[0];
					scope.filter.options = resultList[1];

					if (scope.filter.options.filter_type === 'date_tree' &&
						!scope.columnRowsContent) {

						getDataForSelects();

					}

				};

				const initEventListeners = function () {

					filterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {

						// filterVm.evEventService.removeEventListener(evEvents.DATA_LOAD_END, dataLoadEndId);
						scope.$destroy();

					});

				};

				const init = function () {

					scope.activeFilter.type = filterVm.getActiveFilterType(scope.filterTypes);

					initEventListeners();

					if (scope.filter.options.filter_type === 'date_tree') {
						getDataForSelects();
					}

				};

				init();

			}
		}
	}
})();