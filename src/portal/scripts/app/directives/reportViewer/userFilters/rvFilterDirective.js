(function () {

	let evEvents = require("../../../services/entityViewerEvents");

	'use strict';

	module.exports = function () {
		return {
			restrict: 'E',
			scope: {
				filterKey: '=',
				evDataService: '=',
				evEventService: '=',

				onCancel: '&',
				onSave: '&'
			},
			templateUrl: 'views/components/g-layouts-manager-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function RvFilterController ($scope) {

				let vm = this;
				let filters = JSON.parse(JSON.stringify($scope.evDataService.getFilters()));

				vm.filter = filters.find(filter => filter.key === $scope.filterKey);

				vm.columnRowsContent = [];
				vm.showSelectMenu = false;

				vm.isRootEntityViewer = $scope.evDataService.isRootEntityViewer();
				vm.useFromAbove = $scope.evDataService.getUseFromAbove();

				if (!vm.filter.options) {
					vm.filter.options = {};
				}

				if (!vm.filter.options.filter_values) {
					vm.filter.options.filter_values = [];
				}

				if (!vm.filter.options.hasOwnProperty('exclude_empty_cells')) {
					vm.filter.options.exclude_empty_cells = false;
				}

				vm.saveFilterSettings = function () {
					$scope.onSave();
				};

				vm.cancel = function () {
					$scope.onCancel();
				};

				$scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

					filters = JSON.parse(JSON.stringify($scope.evDataService.getFilters()));
					vm.filter = filters.find(filter => filter.key === $scope.filterKey);

				});

			}]
		};
	}
}());