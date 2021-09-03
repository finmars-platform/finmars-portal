(function () {

	'use strict';

	const popupEvents = require("../../../../services/events/popupEvents");

	module.exports = function (gFiltersHelper) {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/ev-rv-text-filter-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				scope.filter = rvFilterVm.filter;
				scope.isReport = true;
				scope.activeFilter = {
					type: null
				};

				scope.filterTypes = [
					{name: 'Equal', value: 'equal'},
					{name: 'Contains', value: 'contains'},
					{name: 'Does not contains', value: 'does_not_contains'},
					{name: 'Select', value: 'selector'},
					{name: 'Multiple Select', value: 'multiselector'},
					{name: 'Empty cells', value: 'empty'}
				];

				scope.readyStatus = true;

				scope.changeFilterType = function (filterType) {

					if (filterType !== 'use_from_above') {

						scope.filter.options.use_from_above = {};
						// openUseFromAboveSettings() responsible for setting 'use_from_above' into scope.activeFilterType

						/* scope.activeFilter.type = filterType;
						scope.filter.options.filter_type = scope.activeFilter.type;

						if (scope.activeFilter.type === 'empty') {
							scope.filter.options.exclude_empty_cells = false;
						}

						scope.filter.options.filter_values = []; */
						const resultList = gFiltersHelper.emptyTextFilter(filterType, scope.filter.options);
						scope.activeFilter.type = resultList[0];
						scope.filter.options = resultList[1];
					}

				};

				scope.openUseFromAboveSettings = async function () {

					/*scope.activeFilter.type = await rvFilterVm.openUseFromAboveSettings();

					if (scope.activeFilter.type === 'use_from_above') {

						scope.filter.options.use_from_above = {};
						scope.filter.options.filter_type = scope.activeFilter.type;
						scope.filter.options.filter_values = [];

					}*/
					[scope.activeFilter.type, scope.filter.options] = await gFiltersHelper.openUseFromAboveSettings(rvFilterVm.openUseFromAboveSettings(), scope.filter.options);
					scope.$apply();
				};

				scope.getMultiselectorName = function () {
					return scope.filter.name + ". " + "Regime = " + scope.filter.options.filter_type;
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