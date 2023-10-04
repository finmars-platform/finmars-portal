(function () {

	'use strict';

	const evEvents = require("../../../../services/entityViewerEvents");
	const popupEvents = require("../../../../services/events/popupEvents");

	module.exports = function (specificDataService, userFilterService, gFiltersHelper) {
		return {
			require: '^^evFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/ev-rv-text-filter-view.html',
			link: function (scope, elem, attrs, filterVm) {

				scope.filter = filterVm.filter;
				scope.isReport = false;
				scope.activeFilter = {
					type: null
				};

				scope.filterTypes = [
					{name: 'Equal', id: 'equal'},
					{name: 'Contains', id: 'contains'},
					{name: 'Has substring', id: 'contains_has_substring'},
					// {name: 'Does not contains', value: 'does_not_contains'},
					{name: 'Select', id: 'selector'},
					{name: 'Multiple Select', id: 'multiselector'},
					{name: 'Empty cells', id: 'empty'}
				];

				scope.columnRowsContent = null;

				scope.readyStatus = true;

				const contentType = filterVm.evDataService.getContentType();

				const getDataForSelects = function () {

					scope.readyStatus = false;

					specificDataService.getValuesForSelect(contentType, scope.filter.key, scope.filter.value_type).then(function (data) {

						// var columnRowsContent = userFilterService.getCellValueByKey(scope.evDataService, scope.filter.key);

						scope.columnRowsContent = data.results.map(userFilterService.mapColRowsContent);

						scope.readyStatus = true;

						scope.$apply();

					})

				};

				scope.changeFilterType = function (filterType) {
					/* scope.activeFilter.type = filterType;
					scope.filter.options.filter_type = scope.activeFilter.type;

					if (scope.activeFilter.type === 'empty') {
						scope.filter.options.exclude_empty_cells = false;
					}

					scope.filter.options.filter_values = []; */
					const resultList = gFiltersHelper.emptyTextFilter(filterType, scope.filter.options);
					scope.activeFilter.type = resultList[0];
					scope.filter.options = resultList[1];

					if (['selector', 'multiselector'].includes(scope.filter.options.filter_type) &&
						!scope.columnRowsContent) {

						getDataForSelects();

					}

				};

				const initEventListeners = function () {

					/* if (!dataLoadEndId) {
						dataLoadEndId = filterVm.evEventService.addEventListener(evEvents.DATA_LOAD_END, getDataForSelects);
					} */

					filterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {

						// filterVm.evEventService.removeEventListener(evEvents.DATA_LOAD_END, dataLoadEndId);
						scope.$destroy();

					});

				};

				const init = function () {

					scope.activeFilter.type = filterVm.getActiveFilterType(scope.filterTypes);

					initEventListeners();

					/*if (!scope.columnRowsContent || scope.columnRowsContent.length === 0) {
						setTimeout(() => {
							getDataForSelects();
						}, 500);
					}*/

					if (['selector', 'multiselector'].includes(scope.filter.options.filter_type)) {
						getDataForSelects();
					}

				};

				init();

			}
		}
	}
})();