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

    var uiService = require('../../services/uiService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '='
            },
            templateUrl: 'views/directives/groupTable/g-dashboard-filter-view.html',
            link: function (scope, elem, attrs) {

                scope.filters = scope.evDataService.getFilters();
                scope.entityType = scope.evDataService.getEntityType();
                scope.reportOptions = scope.evDataService.getReportOptions();

                if (!scope.reportLayoutOptions) {
                    scope.reportLayoutOptions = {};
                }

                scope.isReport = metaService.isReport(scope.evDataService.getEntityType());
                scope.viewContext = scope.evDataService.getViewContext();

                scope.fields = {};

                var listLayout = scope.evDataService.getListLayout();
                scope.layoutName = listLayout.name;
                scope.isReportFilterFromDashboard = scope.evDataService.dashboard.isReportDateFromDashboard();

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
                    };

                    scope.datepickerToDisplayOptions = {position: 'left'};

                    if (scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') {
                        scope.datepickerToDisplayOptions = {
                            position: 'left',
                            labelName: 'Date to (incl)',
                            modes: {
                                inception: false
                            }
                        }
                    }
                    /* < preparing data for complexZhDatePickerDirective > */

                };

                scope.getNameOfReportLastDate = function () {
                    if (scope.entityType === 'pl-report' || scope.entityType === 'transaction-report') {
                        return 'To';
                    }

                    return 'Report Date';
                };

                scope.resolveFilterValue = function (field) {
                    return field.id ? field.id : field.key;
                };

                var redrawTableWithUpdatedFilters = function () {

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

                };

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

                    scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE); // needed to keep tracks of changes for didLayoutChanged from gActionsBlockComponent

                    setTimeout(function () {
                        scope.$apply();
                    }, 200)
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

                        if (res.status === 'agree') {

                            // scope.externalCallback({reportOptionsUpdated: true, options: {reportOptions: res.data}});
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                        }

                    });


                };

                // not needed for dashboard component rv filters
                /*scope.resizeFilterSideNav = function (actionType) {

                    if (actionType === 'collapse') {
                        $('body').addClass('filter-side-nav-collapsed');
                        /!*scope.sideNavCollapsed = true;
                        interfaceLayout.filterArea.width = 55;*!/
                    } else {
                        $('body').removeClass('filter-side-nav-collapsed');
                        /!*scope.sideNavCollapsed = false;
                        interfaceLayout.filterArea.width = 239;*!/
                    }

                    scope.evEventService.dispatchEvent(evEvents.TOGGLE_FILTER_AREA);

                    var interval = setInterval(function () {
                        window.dispatchEvent(new Event('resize'));
                    }, 50);

                    setTimeout(function () {
                        clearInterval(interval)
                    }, 300);
                };*/

                scope.openFilterSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
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
                    if (scope.filters && scope.filters.length > 0) {

                        var hasEnabledFilters = false;
                        var hasFrontendFilters = false;

                        scope.filters.forEach(function (filter) {
                            if (filter.options.filter_type === 'date_tree') {
                                filter.options.dates_tree = [];
                            }

                            if (filter.options.filter_type === 'from_to') {
                                filter.options.filter_values = {};
                            } else {
                                filter.options.filter_values = [];
                            }

                            if (filter.options.enabled) {
                                hasEnabledFilters = true;
                            }

                            if (filter.options.is_frontend_filter) {
                                hasFrontendFilters = true;
                            }
                        });


                        scope.evDataService.setFilters(scope.filters);
                        scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);


                        if (hasEnabledFilters) {

                            if (scope.isReport) {

                                redrawTableWithUpdatedFilters();

                            } else if (hasFrontendFilters) {
                                scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE);
                            }

                        }

                    }

                };

                var clearUseFromAboveFilters = function () {

                    if (scope.filters && scope.filters.length > 0) {

                        var hasUseFromAboveFilter = false;

                        scope.filters.forEach(function (filter) {

                            if (filter.options.use_from_above && Object.keys(filter.options.use_from_above).length > 0) {

                                if (filter.options.filter_values.length) {
                                    hasUseFromAboveFilter = true;
                                    filter.options.filter_values = [];
                                }

                            }

                        });

                        if (hasUseFromAboveFilter) {
                            scope.evDataService.setFilters(scope.filters);
                            scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                            redrawTableWithUpdatedFilters();
                        }

                    }

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
                        controller: 'RenameFieldDialogController as vm',
                        templateUrl: 'views/dialogs/rename-field-dialog-view.html',
                        parent: angular.element(document.body),
                        targetEvent: $event,
                        locals: {
                            data: filter
                        }
                    })


                };

                scope.removeFilter = function (filter) {

                    scope.filters = scope.filters.map(function (item) {
                        // if (item.id === filter.id || item.name === filter.name) {
                        if (item.name === filter.name) {
                            // return undefined;
                            item = undefined;
                        }

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

                            /*if (item.value_type === 30) {

                                promises.push(attributeTypeService.getByKey(scope.entityType, item.id).then(function (data) {

                                    var result = data;
                                    result.key = item.key;

                                    return result;

                                }))

                            }*/

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

                scope.filterItemsOutsideNgrepeat = function (itemValue, filterValue) {

                    if (filterValue && itemValue.indexOf(filterValue) === -1) {
                        return true;
                    }

                    return false;
                };

                // Methods for report viewer inside dashboard
                scope.saveLayoutList = function ($event) {

                    var listLayout = scope.evDataService.getLayoutCurrentConfiguration(scope.isReport);

                    if (listLayout.hasOwnProperty('id')) {
                        uiService.updateListLayout(listLayout.id, listLayout).then(function () {
                            scope.evDataService.setActiveLayoutConfiguration({layoutConfig: listLayout});
                        });
                    }

                    $mdDialog.show({
                        controller: 'SaveLayoutDialogController as vm',
                        templateUrl: 'views/save-layout-dialog-view.html',
                        targetEvent: $event,
                        clickOutsideToClose: false
                    })

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
                                entityType: scope.entityType,
                                disableChangesSaving: true
                            }
                        }
                    }).then(function (res) {

                        if (res.status === 'agree') {

                            reportOptions = res.data;

                            scope.evDataService.setReportOptions(reportOptions);

                            scope.evEventService.dispatchEvent(evEvents.REPORT_OPTIONS_CHANGE);

                        }

                    })

                };
                // < Methods for report viewer inside dashboard >

                var initEventListeners = function () {

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                        syncFilters();

                    });

                    scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                        scope.reportOptions = scope.evDataService.getReportOptions();
                        scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                        scope.isReportFilterFromDashboard = scope.evDataService.dashboard.isReportDateFromDashboard();

                    });

                    // not needed for dashboard component rv filters
                    /*scope.evEventService.addEventListener(evEvents.UPDATE_FILTER_AREA_SIZE, function () {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        /!*if (scope.sideNavCollapsed) {
                            interfaceLayout.filterArea.width = 239;
                        } else {
                            interfaceLayout.filterArea.width = 74;
                        }

                        scope.sideNavCollapsed = !scope.sideNavCollapsed;*!/
                        scope.sideNavCollapsed = interfaceLayout.filterArea.collapsed;

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });

                    scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);
                    });*/

                    scope.evEventService.addEventListener(evEvents.CLEAR_USE_FROM_ABOVE_FILTERS, function () {
                        clearUseFromAboveFilters();
                    });

                };

                var init = function () {

                    if (scope.isReport === true) {

                        var ppOptions = {
                            pageSize: 1000,
                            page: 1
                        };

                        scope.pricingPolicies = [];

                        var getPricingPolicies = function () {

                            new Promise(function (resolve, reject) {

                                pricingPolicyService.getList(ppOptions).then(function (data) {

                                    scope.pricingPolicies = scope.pricingPolicies.concat(data.results);

                                    if (data.next) {

                                        ppOptions.page = ppOptions.page + 1;
                                        getPricingPolicies(resolve, reject);

                                    } else {
                                        scope.$apply();
                                        resolve(true);
                                    }

                                }).catch(function (error) {
                                    reject(error);
                                });

                            });

                        };

                        getPricingPolicies();


                        var currencyOptions = {
                            pageSize: 1000,
                            page: 1
                        };

                        scope.currencies = [];

                        var getCurrencies = function () {

                            new Promise(function (resolve, reject) {

                                currencyService.getList(currencyOptions).then(function (data) {

                                    scope.currencies = scope.currencies.concat(data.results);

                                    if (data.next) {

                                        currencyOptions.page = currencyOptions.page + 1;
                                        getPricingPolicies(resolve, reject);

                                    } else {
                                        scope.$apply();
                                        resolve(true);
                                    }

                                }).catch(function (error) {
                                    reject(error);
                                });

                            });

                        };

                        getCurrencies();

                        prepareReportLayoutOptions();

                    }

                    uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {

                        var transactionFields = data.results;
                        scope.transactionsUserDates = transactionFields.filter(function (field) {
                            return field.key.indexOf('user_date') !== -1;
                        });

                    });

                    syncFilters();
                    initEventListeners();

                    // scope.evEventService.dispatchEvent(evEvents.UPDATE_EV_UI);
                };

                init();

            }
        }
    }


}());