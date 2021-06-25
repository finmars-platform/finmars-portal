(function () {

	const popupEvents = require("../../../../services/events/popupEvents");
	const evEvents = require("../../../../services/entityViewerEvents");

	'use strict';

	module.exports = function (gFiltersHelper) {
		return {
			restrict: 'E',
			scope: {
				filterKey: '<',
				filterType: '@', // ('frontend', 'backend')
				evDataService: '=',
				evEventService: '=',
				attributeDataService: '=',
				popupEventService: '=',

				onCancel: '&',
				onSave: '&'
			},
			templateUrl: 'views/directives/groupTable/filters/entityViewer/ev-filter-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function EvFilterController ($scope) {

				let vm = this;

				vm.filterType = $scope.filterType;
				vm.evDataService = $scope.evDataService;
				vm.evEventService = $scope.evEventService;
				vm.attributeDataService = $scope.attributeDataService;
				vm.popupEventService = $scope.popupEventService;

				/**
				 * Frontend or backend filters
				 * @type {Array}
				 */
				let filtersList;
				let filterIndex;

				const findFilter = function () {

					let filtersData = vm.evDataService.getFilters();

					filtersList = JSON.parse(JSON.stringify(filtersData[vm.filterType]));

					filterIndex = filtersList.findIndex(filter => filter.key === $scope.filterKey)
					vm.filter = filtersList[filterIndex];

					vm.filter = gFiltersHelper.setFilterDefaultOptions(vm.filter);

				};

				vm.getActiveFilterType = (filterTypesList) => {

					const activeType = filterTypesList.find(type => {
						return type.value === vm.filter.options.filter_type;
					});

					return activeType ? activeType.value : null;

				};

				vm.save = function () {

					let filters = vm.evDataService.getFilters();
					filters[vm.filterType] = filtersList;
					// console.log("testing.save ", filters, filtersList);
					vm.evDataService.setFilters(filters);

					$scope.onSave();
					$scope.$destroy();

				};

				vm.cancel = function () {
					$scope.onCancel();
					$scope.$destroy();
				};

				const init = function () {

					findFilter();

					vm.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {
						findFilter();
					});


					vm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
						$scope.$destroy();
					});

				};

				init();

			}]
		}
	}
})();