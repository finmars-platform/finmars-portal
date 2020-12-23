(function () {

	const popupEvents = require("../../../services/events/popupEvents");
	const evEvents = require("../../../services/entityViewerEvents");
	const userFilterService = require('../../../services/rv-data-provider/user-filter.service');

	'use strict';

	module.exports = function ($mdDialog) {
		return {
			restrict: 'E',
			scope: {
				filterKey: '<',
				evDataService: '=',
				evEventService: '=',
				attributeDataService: '=',
				popupEventService: '=',

				onCancel: '&',
				onSave: '&'
			},
			templateUrl: 'views/directives/reportViewer/userFilters/rv-filter-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function RvFilterController ($scope) {

				const vm = this;
				let filters = JSON.parse(JSON.stringify($scope.evDataService.getFilters()));

				vm.filter = filters.find(filter => filter.key === $scope.filterKey);

				vm.evDataService = $scope.evDataService
				vm.evEventService = $scope.evEventService
				vm.attributeDataService = $scope.attributeDataService
				vm.popupEventService = $scope.popupEventService

				vm.columnRowsContent = []
				vm.showSelectMenu = false

				vm.isRootEntityViewer = vm.evDataService.isRootEntityViewer();
				vm.useFromAbove = vm.evDataService.getUseFromAbove();

				if (!vm.filter.options) {
					vm.filter.options = {}
				}

				if (!vm.filter.options.filter_values) {
					vm.filter.options.filter_values = []
				}

				if (!vm.filter.options.hasOwnProperty('exclude_empty_cells')) {
					vm.filter.options.exclude_empty_cells = false;
				}

				if (!vm.filter.options.use_from_above) {
					vm.filter.options.use_from_above = {}
				}

				vm.getDataForSelects = function () {

					var columnRowsContent  = userFilterService.getCellValueByKey(vm.evDataService, vm.filter.key);

					vm.columnRowsContent = columnRowsContent.map(cRowsContent => {
						return {
							id: cRowsContent, // for text multiselector
							value: cRowsContent,
							active: false // for date multiselector
						}
					});

					// $scope.$apply();

				};

				vm.openLinkedSettings = function () {

					return new Promise(function (resolve) {

						$mdDialog.show({
							controller: 'UseFromAboveDialogController as vm',
							templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
							parent: angular.element(document.body),
							multiple: true,
							locals: {
								data: {
									item: vm.filter.options.use_from_above.key,
									data: { value_type: vm.filter.value_type },
									entityType: vm.filter.options.use_from_above.attrs_entity_type,
									filterType: vm.filter.options.filter_type
								},
								attributeDataService: vm.attributeDataService
							}

						}).then(function (res) {

							if (res.status === 'agree') {

								if (vm.filter.options.use_from_above.key !== res.data.item ||
									vm.filter.options.filter_type !== res.data.filterType) {

									vm.filter.options.use_from_above.key = res.data.item
									vm.filter.options.filter_type = res.data.filterType
									vm.filter.options.use_from_above.attrs_entity_type = res.data.attrsEntityType

								}

							}

							resolve(vm.filter.options.filter_type);

						});

					});

				}

				vm.saveFilterSettings = function () {

					vm.evDataService.setFilters(filters);
					$scope.onSave();
					$scope.$destroy();

				};

				vm.cancel = function () {
					$scope.onCancel();
					$scope.$destroy();
				};

				vm.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

					filters = JSON.parse(JSON.stringify(vm.evDataService.getFilters()));
					vm.filter = filters.find(filter => filter.key === $scope.filterKey);

				});


				vm.popupEventService.addEventListener(popupEvents.CLOSE_POPUP, function () {
					$scope.$destroy();
				});

			}]
		};
	}
}());