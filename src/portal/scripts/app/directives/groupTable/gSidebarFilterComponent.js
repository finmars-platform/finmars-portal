/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../../services/fieldResolverService');
    var evEvents = require('../../services/entityViewerEvents');

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaService = require('../../services/metaService');

    var userFilterService = require('../../services/rv-data-provider/user-filter.service');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '='
            },
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function (scope, elem, attrs) {

                scope.filters = scope.evDataService.getFilters();
                scope.entityType = scope.evDataService.getEntityType();
                scope.reportOptions = scope.evDataService.getReportOptions();

                if (!scope.reportLayoutOptions) {
                    scope.reportLayoutOptions = {};
                }

                scope.isReport = metaService.isReport(scope.evDataService.getEntityType());

                scope.fields = {};

                var prepareReportLayoutOptions = function () {

                    scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    // preparing data for complexZhDatePickerDirective
                    if (!scope.reportLayoutOptions.hasOwnProperty('datepickerOptions')) {
                        scope.reportLayoutOptions.datepickerOptions = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportLastDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportLastDatepicker = {};
                    }

                    if (!scope.reportLayoutOptions.datepickerOptions.hasOwnProperty('reportFirstDatepicker')) {
                        scope.reportLayoutOptions.datepickerOptions.reportFirstDatepicker = {};
                    }

                    scope.datepickerFromDisplayOptions = {
                        position: 'left',
                        labelName: 'Date from (excl)'
                    }

                    scope.datepickerToDisplayOptions = {position: 'left'};

                    if (scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') {
                        scope.datepickerToDisplayOptions = {
                            position: 'left',
                            labelName: 'Date to (incl)'
                        }
                    }
                    /* < preparing data for complexZhDatePickerDirective > */

                };

                scope.resolveFilterValue = function (field) {
                    return field.id ? field.id : field.key;
                };

                if (scope.isReport === true) {

                    pricingPolicyService.getList().then(function (data) {

                        scope.pricingPolicies = data.results;

                        scope.$apply();

                    });

                    currencyService.getList({"pageSize": 200}).then(function (data) {

                        scope.currencies = data.results;

                        scope.$apply();

                    });

                    prepareReportLayoutOptions();

                }

                scope.updateReportOptions = function () {

                    var reportOptions = scope.evDataService.getReportOptions();
                    var reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    var newReportOptions = Object.assign({}, reportOptions, scope.reportOptions);
                    var newReportLayoutOptions = Object.assign({}, reportLayoutOptions, scope.reportLayoutOptions);
                    // TODO Delete in future
                    delete newReportLayoutOptions.reportFirstDatepicker;
                    delete newReportLayoutOptions.reportLastDatepicker;
                    // < Delete in future >
                    console.log('report options', newReportOptions, newReportLayoutOptions);

                    scope.evDataService.setReportOptions(newReportOptions);
                    scope.evDataService.setReportLayoutOptions(newReportLayoutOptions);

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

                scope.resizeFilterSideNav = function (actionType) {

                    var interfaceLayout = scope.evDataService.getInterfaceLayout();

                    if (actionType === 'collapse') {
                        $('body').addClass('filter-side-nav-collapsed');
                        scope.sideNavCollapsed = true;
                        interfaceLayout.filterArea.width = 55;
                    } else {
                        $('body').removeClass('filter-side-nav-collapsed');
                        scope.sideNavCollapsed = false;
                        interfaceLayout.filterArea.width = 239;
                    }

                    // scope.evDataService.setInterfaceLayout(interfaceLayout);

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

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.filterChange = function (filter) {

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.selectAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.enabled = true;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.clearAll = function () {
                    scope.filters.forEach(function (item) {
                        item.options.query = '';
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.deselectAll = function () {

                    scope.filters.forEach(function (item) {
                        item.options.enabled = false;
                    });

                    scope.evDataService.setFilters(scope.filters);
                    scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                };

                scope.useFromAbove = function (filter) {

                    if (!filter.hasOwnProperty('options')) {
                        filter.options = {};
                    }

                    filter.options.useFromAbove = !filter.options.useFromAbove;

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
                };

                scope.renameFilter = function (filter, $mdMenu, $event) {

                    $mdMenu.close($event);


                    $mdDialog.show({
                        controller: 'RenameDialogController as vm',
                        templateUrl: 'views/dialogs/rename-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: filter
                        }
                    })


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
                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)
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

                            scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE)

                        })
                    },

                    dragula: function () {
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

                var syncFilters = function () {

                    scope.filters = scope.evDataService.getFilters();

                    scope.evDataService.setFilters(scope.filters);

                    var promises = [];

                    scope.filters.forEach(function (item) {

                        if (!scope.fields.hasOwnProperty(item.key)) {

                            if (item['value_type'] === "mc_field" || item['value_type'] === "field") {

                                if (item.key === 'tags' || item.key === 'group') {
                                    promises.push(fieldResolverService.getFields(item.key, {entityType: scope.entityType}));
                                } else {
                                    promises.push(fieldResolverService.getFields(item.key));
                                }

                            }

                            if (item.value_type === 30) {

                                promises.push(attributeTypeService.getByKey(scope.entityType, item.id).then(function (data) {

                                    var result = data;
                                    result.key = item.key;

                                    return result;

                                }))

                            }

                        }
                    });

                    Promise.all(promises).then(function (data) {

                        data.forEach(function (item) {

                            if (item.hasOwnProperty('classifiers_flat')) {
                                scope.fields[item.key] = item.classifiers_flat
                            } else {
                                scope.fields[item.key] = item.data;
                            }

                        });

                        scope.$apply(
                            function () {
                                setTimeout(function () {
                                    $(elem).find('.md-select-search-pattern').on('keydown', function (ev) {
                                        ev.stopPropagation();
                                    });
                                }, 100);
                            }
                        );
                    });

                };

                var init = function () {

                    syncFilters();

                    scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {
                        /*if (scope.isReport) {

                            var testKeyData = userFilterService.getDataByKey(scope.evDataService, 'instrument.maturity_date');
                            var testKeyData1 = userFilterService.getDataByKey(scope.evDataService, 'portfolio.name');

                            console.log('testKeyData', testKeyData);
                            console.log('testKeyData1', testKeyData1);

                        }*/

                    });

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                        syncFilters();

                    });

                    scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                        scope.reportOptions = scope.evDataService.getReportOptions();
                        scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                        setTimeout(function () {
                            scope.$apply();
                        }, 500);

                        // prepareReportLayoutOptions();

                    });

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_EV_UI);

                };

                init();

            }
        }
    }


}());