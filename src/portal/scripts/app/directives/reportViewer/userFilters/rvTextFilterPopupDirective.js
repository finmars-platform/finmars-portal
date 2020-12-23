(function () {

	const popupEvents = require("../../../services/events/popupEvents");

	'use strict';

	module.exports = function () {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/reportViewer/userFilters/rv-text-filter-popup-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

				scope.filter = rvFilterVm.filter

				if (!scope.filter.options.filter_type) {
					scope.filter.options.filter_type = "contains";
				}

				scope.activeFilterType = null;

				scope.filterTypes = [
					{name: 'Equal', value: 'equal'},
					{name: 'Contains', value: 'contains'},
					{name: 'Does not contains', value: 'does_not_contains'},
					{name: 'Select', value: 'selector'},
					{name: 'Multiple Select', value: 'multiselector'},
					{name: 'Empty cells', value: 'empty'},
					// {name: 'Linked', value: 'use_from_above'}
				];

				scope.changeFilterType = async function () {

					/*if (scope.activeFilterType === 'use_from_above') {

						scope.activeFilterType = await rvFilterVm.openLinkedSettings();
						scope.$apply();
						console.log("testing scope.activeFilterType", scope.activeFilterType);

					} else { */

						scope.filter.options.use_from_above = {}
						scope.filter.options.filter_type = scope.activeFilterType

						if (scope.activeFilterType === 'empty') {
							scope.filter.options.exclude_empty_cells = false;
						}

						scope.filter.options.filter_values = [];

					// }

				};

				scope.openLinkedSettings = async function () {
					scope.activeFilterType = await rvFilterVm.openLinkedSettings();
					scope.$apply();
				};

				scope.getMultiselectorName = function () {
					return scope.filter.name + ". " + "Regime = " + scope.filter.options.filter_type;
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