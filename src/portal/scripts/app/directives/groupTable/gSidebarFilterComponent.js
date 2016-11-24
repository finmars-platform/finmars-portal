/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');
    var fieldResolverService = require('../../services/fieldResolverService');


    var pricingPolicyService = require('../../services/pricingPolicyService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                filters: '=',
                entityType: '=',
                isReport: '=',
                reportOptions: '=',
                externalCallback: '&'
            },
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function (scope, elem, attrs) {

                logService.component('groupSidebarFilter', 'initialized');

                scope.fields = {};
                //scope.reportOptions = {};

                scope.filters.forEach(function (item) {
                    if (!item.options) {
                        item.options = {enabled: false};
                    }
                    item.options.enabled = false;
                });

                if (scope.isReport == true) {
                    pricingPolicyService.getList().then(function (data) {

                        scope.pricingPolicies = data.results;

                        scope.$apply();

                    });
                }


                scope.openReportSettings = function ($event) {

                    console.log('scope.reportOptions', scope.reportOptions);

                    $mdDialog.show({
                        controller: 'GReportSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            reportOptions: scope.reportOptions
                        }
                    }).then(function (res) {

                        console.log('res', res);

                        if (res.status == 'agree') {
                            scope.reportOptions = res.data;
                        }

                    });


                };

                scope.calculateReport = function () {
                    console.log('calculate report');
                    scope.reportOptions["task_id"] = undefined;
                    scope.externalCallback();
                };

                scope.resizeFilterSideNav = function (actionType) {
                    if (actionType === 'collapse') {
                        $('body').addClass('filter-side-nav-collapsed');
                        scope.sideNavCollapsed = true;
                    } else {
                        $('body').removeClass('filter-side-nav-collapsed');
                        scope.sideNavCollapsed = false;
                    }
                    var interval = setInterval(function () {
                        $(window).trigger('resize');
                    }, 50);

                    setTimeout(function () {
                        clearInterval(interval)
                    }, 300);
                };

                scope.$watchCollection('filters', function () {

                    //scope.externalCallback();

                    var promises = [];

                    scope.filters.forEach(function (item) {
                        //console.log("filter's item ", item);
                        if (!scope.fields.hasOwnProperty(item.key)) {
                            if (item['value_type'] == "mc_field" || item['value_type'] == "field") {
                                if (item.key == 'tags') {
                                    promises.push(fieldResolverService.getFields(item.key, {entityType: scope.entityType}));
                                } else {
                                    promises.push(fieldResolverService.getFields(item.key));
                                }
                            }

                            //console.log("filter's promises ", promises);
                        }
                    });

                    Promise.all(promises).then(function (data) {
                        //console.log("filter's data ", data);
                        data.forEach(function (item) {
                            scope.fields[item.key] = item.data;
                        });
                        scope.$apply(
                            function () {
                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            }
                        )
                        ;
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
                    console.log('filter to remove is ', filter);
                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.name === filter.name) {
                            // return undefined;
                            item = undefined;
                        }
                        console.log('filter in filters list', item);
                        return item;
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