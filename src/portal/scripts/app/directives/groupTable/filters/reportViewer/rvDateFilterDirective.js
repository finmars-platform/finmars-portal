(function () {

	'use strict';

	const popupEvents = require("../../../../services/events/popupEvents");

	module.exports = function (gFiltersHelper) {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/ev-rv-date-filter-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				scope.filter = rvFilterVm.filter;
				scope.isReport = false;
				scope.activeFilter = {
					type: null
				};

				scope.readyStatus = true;

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

				scope.dateTreeChanged =function (dateTree) {
					scope.filter.options.filter_values = gFiltersHelper.convertDatesTreeToFlatList(dateTree);
				}

				scope.changeFilterType = async function (filterType) {

					if (filterType !== 'use_from_above') {

						scope.filter.options.use_from_above = {};

						const resultList = gFiltersHelper.emptyDateFilter(filterType, scope.filter.options);
						scope.activeFilter.type = resultList[0];
						scope.filter.options = resultList[1];

					}

				};

				scope.openUseFromAboveSettings = async function () {
					[scope.activeFilter.type, scope.filter.options] = await gFiltersHelper.openUseFromAboveSettings(rvFilterVm.openUseFromAboveSettings(), scope.filter.options);
					scope.$apply();
				};

				const init = function () {

					scope.activeFilter.type = rvFilterVm.getActiveFilterType(scope.filterTypes);

					if (!rvFilterVm.columnRowsContent || !rvFilterVm.columnRowsContent.length) {

						rvFilterVm.getDataForSelects();

					}

					scope.columnRowsContent = rvFilterVm.columnRowsContent

				};

				init();

				rvFilterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
					scope.$destroy();
				});

			}
		};
	}

}());