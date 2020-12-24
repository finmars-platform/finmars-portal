(function () {

	const popupEvents = require("../../../services/events/popupEvents");

	'use strict';

	module.exports = function () {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/reportViewer/userFilters/rv-number-filter-popup-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				console.log('#69 rvNumberFilterPopupDirective scope, rvFilterVm', scope, rvFilterVm);

				scope.filter = rvFilterVm.filter

				if (!scope.filter.options.filter_type) {
					scope.filter.options.filter_type = "contains";
				}

				scope.activeFilterType = null;

				scope.filterTypes = [
					{name: 'Equal', value: 'equal'},
					{name: 'Not equal', value: 'not_equal'},
					{name: 'Greater than', value: 'greater'},
					{name: 'Greater or equal to', value: 'greater_equal'},
					{name: 'Less than', value: 'less'},
					{name: 'Less or equal to', value: 'less_equal'},
					{name: 'From ... to ... (incl)', value: 'from_to'},
					{name: 'Empty cells', value: 'empty'},
				];


				scope.changeFilterType = async function () {

					scope.filter.options.use_from_above = {};
					scope.filter.options.filter_type = scope.activeFilterType;

					if (scope.activeFilterType === 'from_to') {

						scope.filter.options.filter_values = {}

					} else {

						if (scope.activeFilterType === 'empty') {
							scope.filter.options.exclude_empty_cells = false;
						}

						scope.filter.options.filter_values = [];

					}

				};

				scope.openLinkedSettings = async function () {
					scope.activeFilterType = await rvFilterVm.openLinkedSettings();
					scope.$apply();
				};


				const init = function () {

					if (scope.filter.options.use_from_above &&
						Object.keys(scope.filter.options.use_from_above).length) {

						scope.activeFilterType = 'use_from_above'

					} else {

						let activeType = scope.filterTypes.find(type => {
							return type.value === scope.filter.options.filter_type;
						});

						scope.activeFilterType = activeType.value

					}

				};

				init();

				rvFilterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
					scope.$destroy();
				});

			}
		};
	}

}());