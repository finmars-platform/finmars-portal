(function () {

	const popupEvents = require("../../../services/events/popupEvents");

	'use strict';

	module.exports = function () {
		return {
			require: '^^rvFilter',
			restrict: 'E',
			scope: {},
			templateUrl: 'views/directives/reportViewer/userFilters/rv-date-filter-popup-view.html',
			link: function (scope, elem, attrs, rvFilterVm) {

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
					{name: 'Date tree', value: 'date_tree'},
				];

				const convertDatesTreeToFlatList = function (dateTree) {

					var datesList = [];

					dateTree.map(function (yearGroup) {

						yearGroup.items.map(function (monthGroup) {

							monthGroup.items.map(function (date) {

								delete date.dayNumber;
								delete date.available;

								date = JSON.parse(angular.toJson(date));

								if (date.active) {
									datesList.push(date.value);
								}

							});

						});

					});

					return datesList;

				};

				scope.dateTreeChanged =function (dateTree) {
					scope.filter.options.filter_values = convertDatesTreeToFlatList(dateTree);
				}


				scope.changeFilterType = async function () {

					scope.filter.options.use_from_above = {};
					scope.filter.options.filter_type = scope.activeFilterType;

					if (scope.activeFilterType === 'date_tree') {
						scope.filter.options.dates_tree = [];
					}

					if (scope.activeFilterType === 'from_to') {

						scope.filter.options.filter_values = {};

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