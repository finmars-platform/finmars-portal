/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../../services/fieldResolverService');
    var evEvents = require('../../services/entityViewerEvents');

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                options: '=',
                reportOptions: '=',
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function (scope, elem, attrs) {

                scope.filters = scope.evDataService.getFilters();
                scope.entityType = scope.evDataService.getEntityType();
                scope.reportOptions = scope.evDataService.getReportOptions();

                console.log('scope.reportOptions', scope.reportOptions);

                scope.isReport = ['balance-report',
                    'cash-flow-projection-report',
                    'performance-report', 'pnl-report',
                    'transaction-report'].indexOf(scope.entityType) !== -1;


                console.log('scope.isReport', scope.isReport);

                scope.fields = {};

                scope.resolveFilterValue = function (field) {
                    return field.id ? field.id : field.key;
                };

                if (scope.isReport === true) {

                    pricingPolicyService.getList().then(function (data) {

                        scope.pricingPolicies = data.results;

                        scope.$apply();

                    });

                    currencyService.getList({"page_size": 200}).then(function (data) {

                        scope.currencies = data.results;

                        scope.$apply();

                    });

                }

                scope.updateReportOptions = function () {

                    var reportOptions = scope.evDataService.getReportOptions();

                    var newReportOptions = Object.assign({}, reportOptions, scope.reportOptions);

                    console.log('report options', newReportOptions);

                    scope.evDataService.setReportOptions(newReportOptions)

                };

                scope.openPeriodsDialog = function ($event) {

                    $mdDialog.show({
                        controller: 'PeriodsEditorDialogController as vm',
                        templateUrl: 'views/dialogs/periods-editor-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            options: {
                                periods: scope.reportOptions.periods
                            }
                        }
                    }).then(function (res) {

                        console.log('res', res);

                        if (res.status === 'agree') {

                            // scope.externalCallback({reportOptionsUpdated: true, options: {reportOptions: res.data}});
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                        }

                    });


                };

                scope.openReportSettings = function ($event) {

                    var reportOptions = scope.evDataService.getReportOptions();

                    $mdDialog.show({
                        controller: 'GReportSettingsDialogController as vm',
                        templateUrl: 'views/dialogs/g-report-settings-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            reportOptions: reportOptions,
                            options: {
                                entityType: scope.entityType
                            }
                        }
                    }).then(function (res) {

                        reportOptions = res.data;

                        scope.evDataService.setReportOptions(reportOptions);

                        scope.reportOptions = reportOptions;

                    })

                };

                scope.calculateReport = function () {

                    var reportOptions = scope.evDataService.getReportOptions();

                    reportOptions = Object.assign({}, reportOptions, {task_id: null});

                    scope.evDataService.setReportOptions(reportOptions);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);
                    // scope.evEventService.dispatchEvent(evEvents.CALCULATE_REPORT);

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

                scope.openFilterSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.toggleFilterState = function () {
                    if (scope.isReport === true) {
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                    } else {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                    }
                };

                scope.filterChange = function (filter) {
                    if (scope.isReport === true) {
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                    } else {
                        scope.evDataService.resetData();
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                    }
                };

                scope.selectAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.enabled = true;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    if (scope.isReport === true) {
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                    } else {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                    }
                };

                scope.clearAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.query = '';
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    if (scope.isReport === true) {
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                    } else {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                    }
                };

                scope.deselectAll = function () {

                    scope.filters.forEach(function (item) {
                        item.options.enabled = false;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    if (scope.isReport === true) {
                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                    } else {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                    }
                };

                if (scope.options && scope.options.isRootEntityViewer === false) {

                    scope.$on('rootEditorEntityIdDown', function (event, data) {

                        scope.filters.forEach(function (item) {
                            //console.log('item', item);
                            if (item.hasOwnProperty('options') && item.options.useFromAbove == true) {

                                if (item.key == data.entityType) {
                                    item.options.query = [data.editorEntityId]
                                }

                            }

                        });

                        scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)

                    });
                }

                scope.useFromAbove = function (filter) {

                    if (!filter.hasOwnProperty('options')) {
                        filter.options = {};
                    }

                    filter.options.useFromAbove = !filter.options.useFromAbove;

                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                };

                scope.removeFilter = function (filter) {
                    //console.log('filter to remove is ', filter);
                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.name === filter.name) {
                            // return undefined;
                            item = undefined;
                        }
                        //console.log('filter in filters list', item);
                        return item;
                    }).filter(function (item) {
                        return !!item;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                    scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                };

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

                var dragAndDrop = {

                    init: function () {
                        this.dragula();
                        this.eventListeners();
                    },

                    eventListeners: function () {

                        this.dragula.on('over', function (elem, container, source) {
                            $(container).addClass('active');
                            $(container).on('mouseleave', function () {
                                $(this).removeClass('active');
                            })
                        });
                        this.dragula.on('drop', function (elem, target) {
                            $(target).removeClass('active');
                        });

                        this.dragula.on('dragend', function (el) {

                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)

                        })
                    },

                    dragula: function () {
                        console.log('COLUMSN DRAGULA INIT?');

                        var items = [document.querySelector('.g-filters-holder')];
                        var i;
                        //var itemsElem = document.querySelectorAll('.g-columns-holder md-card');
                        //for (i = 0; i < itemsElem.length; i = i + 1) {
                        //    items.push(itemsElem[i]);
                        //}

                        this.dragula = dragula(items);
                    }
                };

                setTimeout(function () {
                    dragAndDrop.init();
                }, 500);

                var init = function () {

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                        scope.filters = scope.evDataService.getFilters();

                        var promises = [];

                        scope.filters.forEach(function (item) {

                            if (!scope.fields.hasOwnProperty(item.key)) {
                                if (item['value_type'] === "mc_field" || item['value_type'] === "field") {
                                    if (item.key === 'tags') {
                                        promises.push(fieldResolverService.getFields(item.key, {entityType: scope.entityType}));
                                    } else {
                                        promises.push(fieldResolverService.getFields(item.key));
                                    }
                                }

                            }
                        });

                        Promise.all(promises).then(function (data) {

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


                    })

                };

                init();

            }
        }
    }


}());