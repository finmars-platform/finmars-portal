(function () {

	const popupEvents = require("../../../../services/events/popupEvents");
	const metaHelper = require('../../../../helpers/meta.helper');

	'use strict';

	module.exports = function (gFiltersHelper) {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/ev-rv-number-filter-popup-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				scope.filter = rvFilterVm.filter;
				scope.isReport = true;
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
				];

				scope.changeFilterType = function (filterType) {

					/* scope.filter.options.filter_type = scope.activeFilter.type;

					if (scope.activeFilter.type === 'from_to' || scope.activeFilter.type === 'out_of_range') {

						scope.filter.options.filter_values = {}

					} else {

						if (scope.activeFilter.type === 'empty') {
							scope.filter.options.exclude_empty_cells = false;
						}

						scope.filter.options.filter_values = [];

					} */

					if (filterType !== 'use_from_above') {

						scope.filter.options.use_from_above = {};
						[scope.activeFilter.type, scope.filter.options] = gFiltersHelper.emptyNumberFilter(filterType, scope.filter.options);

					}

				};

				scope.openUseFromAboveSettings = async function () {

					/* scope.activeFilter.type = await rvFilterVm.openUseFromAboveSettings();

					if (scope.activeFilter.type === 'use_from_above') {

						scope.filter.options.use_from_above = {};
						scope.filter.options.filter_type = scope.activeFilter.type;
						scope.filter.options.filter_values = [];

					}

					scope.$apply(); */
					[scope.activeFilter.type, scope.filter.options] = await gFiltersHelper.openUseFromAboveSettings(rvFilterVm.openUseFromAboveSettings(), scope.filter.options);
					scope.$apply();

				};

				const initEventListeners = function () {

					rvFilterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
						scope.$destroy();
					});

				};

				const init = function () {

					scope.activeFilter.type = rvFilterVm.getActiveFilterType(scope.filterTypes);

					initEventListeners();

				};

				init();

			}
		};
	}

}());