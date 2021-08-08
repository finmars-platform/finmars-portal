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
			templateUrl: 'views/directives/groupTable/filters/ev-rv-number-filter-view.html',
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
					{name: 'Empty cells', value: 'empty'},
				];

				scope.changeFilterType = function (filterType) {

					scope.filter.options.use_from_above = {};

					const resultList = gFiltersHelper.emptyNumberFilter(filterType, scope.filter.options);
					scope.activeFilter.type = resultList[0];
					scope.filter.options = resultList[1];

				};

				const initEventListeners = function () {

					filterVm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
						scope.$destroy();
					});

				};

				const init = function () {

					scope.activeFilter.type = filterVm.getActiveFilterType(scope.filterTypes);

					initEventListeners();

				};

				init();

			}
		}
	}
})();