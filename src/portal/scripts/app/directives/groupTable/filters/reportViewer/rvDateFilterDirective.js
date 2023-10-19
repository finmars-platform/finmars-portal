(function () {

	'use strict';

	const popupEvents = require("../../../../services/events/popupEvents");

	module.exports = function (specificDataService, gFiltersHelper) {
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

				const openUseFromAboveSettings = async function () {
					[scope.activeFilter.type, scope.filter.options] = await gFiltersHelper.openUseFromAboveSettings(rvFilterVm.openUseFromAboveSettings(), scope.filter.options);
					scope.$apply();
				};

				scope.filterTypes = [
					{name: 'Equal', id: 'equal'},
					{name: 'Not equal', id: 'not_equal'},
					{name: 'Greater than', id: 'greater'},
					{name: 'Greater or equal to', id: 'greater_equal'},
					{name: 'Less than', id: 'less'},
					{name: 'Less or equal to', id: 'less_equal'},
					{name: 'From ... to ... (incl)', id: 'from_to'},
					{name: 'Out of range (incl)', id: 'out_of_range'},
					{name: 'Empty cells', id: 'empty'},
					{name: 'Date tree', id: 'date_tree'},

					{name: 'Linked', id: 'use_from_above', onClick: openUseFromAboveSettings},
				];

				scope.readyStatus = true;

				scope.dateTreeChanged =function (dateTree) {
					scope.filter.options.filter_values = gFiltersHelper.convertDatesTreeToFlatList(dateTree);
				}

				const getDataForSelects = async function () {

					scope.readyStatus = false;

					const res = await rvFilterVm.getDataForSelects();

					scope.columnRowsContent = res.results.map(cRowsContent => {
						return {value: cRowsContent};
					});

					scope.readyStatus = true;

					scope.$apply();

				};

				scope.changeFilterType = async function (filterType) {

					if (filterType !== 'use_from_above') {

						scope.filter.options.use_from_above = {};

						const resultList = gFiltersHelper.emptyDateFilter(filterType, scope.filter.options);
						scope.activeFilter.type = resultList[0];
						scope.filter.options = resultList[1];

						if (
							scope.filter.options.filter_type === 'date_tree' &&
							( !scope.columnRowsContent || !scope.columnRowsContent.length )
						) {

							getDataForSelects();

						}

					}

				};

				const init = function () {

					scope.activeFilter.type = rvFilterVm.getActiveFilterType(scope.filterTypes);

					/*if (!rvFilterVm.columnRowsContent || !rvFilterVm.columnRowsContent.length) {

						getDataForSelects();

					}

					scope.columnRowsContent = rvFilterVm.columnRowsContent*/
					if (
						scope.filter.options.filter_type === 'date_tree' &&
						( !scope.columnRowsContent || !scope.columnRowsContent.length )
					) {

						getDataForSelects();

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