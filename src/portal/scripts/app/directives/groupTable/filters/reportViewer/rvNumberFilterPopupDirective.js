(function () {

	const popupEvents = require("../../../../services/events/popupEvents");
	const metaHelper = require('../../../../helpers/meta.helper');

	'use strict';

	module.exports = function () {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/groupTable/filters/reportViewer/rv-number-filter-popup-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				scope.filter = rvFilterVm.filter;

				scope.activeFilterType = null;

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


				scope.changeFilterType = async function () {

					scope.filter.options.use_from_above = {};
					scope.filter.options.filter_type = scope.activeFilterType;

					if (scope.activeFilterType === 'from_to' || scope.activeFilterType === 'out_of_range') {

						scope.filter.options.filter_values = {}

					} else {

						if (scope.activeFilterType === 'empty') {
							scope.filter.options.exclude_empty_cells = false;
						}

						scope.filter.options.filter_values = [];

					}

				};

				scope.openUseFromAboveSettings = async function () {
					scope.activeFilterType = await rvFilterVm.openUseFromAboveSettings();
					scope.$apply();
				};


				const init = function () {

					scope.activeFilterType = rvFilterVm.getActiveFilterType(scope.filterTypes);

				};

				init();

				rvFilterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
					scope.$destroy();
				});

			}
		};
	}

}());