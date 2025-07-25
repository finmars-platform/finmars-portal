(function () {

	'use strict';

	const popupEvents = require("../../../../services/events/popupEvents");
	const evEvents = require("../../../../services/entityViewerEvents");

	const metaHelper = require('../../../../helpers/meta.helper').default;

	module.exports = function ($mdDialog, specificDataService, userFilterService, gFiltersHelper) {
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

				// vm.columnRowsContent = [];
				vm.showSelectMenu = false;

				vm.isRootEntityViewer = vm.evDataService.isRootEntityViewer();
				vm.useFromAbove = vm.evDataService.getUseFromAbove();

				vm.filterNotFound = false;

				const entityType = $scope.evDataService.getEntityType();
				const contentType = $scope.evDataService.getContentType();
				const attrsList = vm.attributeDataService.getAllAttributesByEntityType(entityType);

				let filtersList;
				let useFromAboveFilters;
				let isUseFromAboveFilter = false;
				let filterIndex = -1;

				const findFilter = function () {

					let allFilters = structuredClone( vm.evDataService.getFilters() );
					filtersList = [];
					useFromAboveFilters = [];

					isUseFromAboveFilter = false;

					allFilters.forEach((filter) => {

						if ( isUseFromAbove(filter) ) {

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

				const getFilterAttr = attrKey => {
					return attrsList.find(attr => attr.key === attrKey);
				};

				vm.getDataForSelects = async function () {

					/* var columnRowsContent  = userFilterService.getCellValueByKey(vm.evDataService, vm.filter.key);

					vm.columnRowsContent = columnRowsContent.map(userFilterService.mapColRowsContent); */

					let filterAttr = getFilterAttr(vm.filter.key);

					let key = vm.filter.key; // for dynamic attribute
					let content_type = filterAttr.content_type;

					const reportOptions = vm.evDataService.getReportOptions();

					// `report_instance_id` needed for custom fields and system attributes of report
					let options = {
						filters: {
							report_instance_id: reportOptions.report_instance_id
						}
					};

					if ( key.startsWith('custom_fields.') ) {

						content_type = contentType;

					}
					else if ( !key.includes('attributes.') ) { // not dynamic attribute

						const keyParts = vm.filter.key.split(".");
						key = keyParts.at(-1);

					}

					const res = await specificDataService.getValuesForSelect(
						content_type, key, vm.filter.value_type, options
					);

					if (vm.filter.value_type === 40) {
						// there is data processing inside rvDateFilterDirective
						return res;

					} else {
						return res.results.map( userFilterService.mapColRowsContent );
					}

				};

				var dialogParent = document.querySelector('.dialog-containers-wrap');

				vm.openUseFromAboveSettings = function () {

					return new Promise(function (resolve) {

						$mdDialog.show({
							controller: 'UseFromAboveDialogController as vm',
							templateUrl: 'views/dialogs/use-from-above-dialog-view.html',
							parent: dialogParent,
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

							console.log('openUseFromAboveSettings.res', res)
							console.log('openUseFromAboveSettings.vm.filter', vm.filter)

							if (res.status === 'agree') {


								if (vm.filter.options.use_from_above.key !== res.data.item ||
									vm.filter.options.filter_type !== res.data.filterType) {

									vm.filter.options.use_from_above = {}

									vm.filter.options.use_from_above.key = res.data.item
									vm.filter.options.filter_type = res.data.filterType
									vm.filter.options.use_from_above.attrs_entity_type = res.data.attrsEntityType

									// resolve('use_from_above');
									resolve(vm.filter);

								}

							} else {

								// resolve(vm.filter.options.filter_type);
								resolve(vm.filter);
							}

						});

					});

				}

				const isUseFromAbove = (filterData) => {
					return !!(filterData.options.use_from_above && Object.keys(filterData.options.use_from_above).length);
				};

				vm.getActiveFilterType = (filterTypesList) => {

					console.log('vm.getActiveFilterType vm.filter', vm.filter)

					if (vm.filter.options.use_from_above &&
						Object.keys(vm.filter.options.use_from_above).length) {

						return 'use_from_above';

					} else {

						const activeType = filterTypesList.find(type => {
							// return type.value === vm.filter.options.filter_type;
							return type.id === vm.filter.options.filter_type;
						});

						// return activeType ? activeType.value : null;
						return activeType ? activeType.id : null;

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