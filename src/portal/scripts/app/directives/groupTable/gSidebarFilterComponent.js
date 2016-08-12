/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

	'use strict';

	var logService = require('../../../../../core/services/logService');
	var fieldResolverService = require('../../services/fieldResolverService');

	module.exports = function () {
		return {
			restrict: 'AE',
			scope: {
				filters: '=',
				externalCallback: '&'
			},
			templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
			link: function (scope, elem, attrs) {

				logService.component('groupSidebarFilter', 'initialized');

				scope.fields = {};

				scope.$watchCollection('filters', function () {
					scope.externalCallback();

					var promises = [];

					scope.filters.forEach(function (item) {
						//console.log("filter's item ", item);
						if (!scope.fields.hasOwnProperty(item.key)) {
							if (item['value_type'] == "mc_field" || item['value_type'] == "field") {
								promises.push(fieldResolverService.getFields(item.key));
							}
							//console.log("filter's promises ", promises);
						}
					});

					Promise.all(promises).then(function (data) {
						//console.log("filter's data ", data);
						data.forEach(function(item){
							scope.fields[item.key] = item.data;
						});
						scope.$apply();
					});
				});

				scope.openFilterSettings = function ($mdOpenMenu, ev) {
					$mdOpenMenu(ev);
				};

				scope.toggleFilterState = function () {
					scope.externalCallback();
				};

				scope.filterChange = function (filter) {
					scope.externalCallback();
				};

				scope.selectAll = function () {
					scope.filters.forEach(function (item) {
						item.options.enabled = true;
					});
					scope.externalCallback();
				};

				scope.clearAll = function () {
					scope.filters.forEach(function (item) {
						item.options.query = '';
					});
					scope.externalCallback();
				};

				scope.deselectAll = function () {
					scope.filters.forEach(function (item) {
						item.options.enabled = false;
					});
					scope.externalCallback();
				};

				scope.removeFilter = function (filter) {

					scope.filters = scope.filters.map(function (item) {
						if (item.id === filter.id || item.name === filter.name) {
							return undefined
						}
						return item
					}).filter(function (item) {
						return !!item;
					});

					scope.externalCallback();
				}

				scope.getFilterType = function (filterType) {
					switch (filterType) {
						case 'field':
						case 'mc_field':
							return true;
							break;
						default:
							return false;
							break;
					}
				};
				//console.log('filter fields', scope.filters);
			}
		}
	}


}());