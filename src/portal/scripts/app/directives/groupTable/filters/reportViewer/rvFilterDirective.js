(function () {

	'use strict';

	const popupEvents = require("../../../../services/events/popupEvents");
	const evEvents = require("../../../../services/entityViewerEvents");
	const userFilterService = require('../../../../services/rv-data-provider/user-filter.service');

	const metaHelper = require('../../../../helpers/meta.helper');

	module.exports = function ($mdDialog, gFiltersHelper) {
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
			templateUrl: 'views/directives/groupTable/filters/reportViewer/rv-filter-view.html',
			controllerAs: 'vm',
			controller: ['$scope', function RvFilterController ($scope) {

				let vm = this;

				vm.evDataService = $scope.evDataService;
				vm.evEventService = $scope.evEventService;
				vm.attributeDataService = $scope.attributeDataService;
				vm.popupEventService = $scope.popupEventService;

				vm.columnRowsContent = [];
				vm.showSelectMenu = false;

				vm.isRootEntityViewer = vm.evDataService.isRootEntityViewer();
				vm.useFromAbove = vm.evDataService.getUseFromAbove();

				vm.filterNotFound = false;

				let filtersList;
				let useFromAboveFilters;
				let isUseFromAboveFilter = false;
				let filterIndex = -1;

				const findFilter = function () {
					const filtersTest = vm.evDataService.getFilters();

					let allFilters = JSON.parse(JSON.stringify(vm.evDataService.getFilters()));
					filtersList = [];
					useFromAboveFilters = [];

					isUseFromAboveFilter = false;

					allFilters.forEach((filter) => {

						if (isUseFromAbove(filter)) {

							useFromAboveFilters.push(filter);

							if (filter.key === $scope.filterKey) {

								vm.filter = filter
								isUseFromAboveFilter = true;
								filterIndex = useFromAboveFilters.length - 1;

							}

						}

						else {

							filtersList.push(filter);

							if (filter.key === $scope.filterKey) {

								vm.filter = filter
								filterIndex = filtersList.length - 1;

							}

						}

					});

					if (filterIndex > -1) {
						vm.filter = gFiltersHelper.setFilterDefaultOptions(vm.filter, true);

					} else {
						vm.filterNotFound = true;
					}


				};

				vm.getDataForSelects = function () {

					var columnRowsContent  = userFilterService.getCellValueByKey(vm.evDataService, vm.filter.key);

					vm.columnRowsContent = columnRowsContent.map(cRowsContent => {
						return {
							id: cRowsContent, // for text multiselector
							value: cRowsContent, // for text selector
							active: false // for date multiselector
						}
					});

					// $scope.$apply();

				};

				vm.openUseFromAboveSettings = function () {

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

									resolve('use_from_above');

								}

							} else {

								resolve(vm.filter.options.filter_type);
							}

						});

					});

				}

				const isUseFromAbove = (filterData) => {
					return !!(filterData.options.use_from_above && Object.keys(filterData.options.use_from_above).length);
				};

				vm.getActiveFilterType = (filterTypesList) => {

					console.log('vm.getActiveFilterType vm.filter', vm.filter)

					if ((vm.filter.options.use_from_above &&
						Object.keys(vm.filter.options.use_from_above).length) || vm.filter.options.filter_type == 'use_from_above') {

						return 'use_from_above';

					} else {

						const activeType = filterTypesList.find(type => {
							return type.value === vm.filter.options.filter_type;
						});

						return activeType ? activeType.value : null;

					}

				};

				vm.saveFilterSettings = function () {

					if (isUseFromAboveFilter !== isUseFromAbove(vm.filter)) { // is use from above toggled

						if (isUseFromAboveFilter) { // became ordinary filter

							filtersList.push(vm.filter);
							useFromAboveFilters.splice(filterIndex, 1);

						} else { // became use from above filter

							filtersList.splice(filterIndex, 1);
							useFromAboveFilters.push(vm.filter);

						}

					}

					let allFilters = useFromAboveFilters.concat(filtersList);

					vm.evDataService.setFilters(allFilters);

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
		};
	}
}());