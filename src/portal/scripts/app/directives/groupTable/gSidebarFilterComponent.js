/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var fieldResolverService = require('../../services/fieldResolverService');
    var evEvents = require('../../services/entityViewerEvents');
    var evDomManager = require('../../services/ev-dom-manager/ev-dom.manager');
    var rvDomManager = require('../../services/rv-dom-manager/rv-dom.manager');

    var pricingPolicyService = require('../../services/pricingPolicyService');
    var currencyService = require('../../services/currencyService');

    var attributeTypeService = require('../../services/attributeTypeService');
    var metaService = require('../../services/metaService');

    var transactionTypeService = require('../../services/transactionTypeService');
    var uiService = require('../../services/uiService');

    module.exports = function ($mdDialog) {
        return {
            restrict: 'AE',
            scope: {
                evDataService: '=',
                evEventService: '=',
                attributeDataService: '=',
                spExchangeService: '=',
                contentWrapElement: '='
            },
            templateUrl: 'views/directives/groupTable/sidebar-filter-view.html',
            link: function (scope, elem, attrs) {

                scope.filters = scope.evDataService.getFilters();
                scope.entityType = scope.evDataService.getEntityType();
                scope.contentType = scope.evDataService.getContentType();
                scope.reportOptions = scope.evDataService.getReportOptions();

                if (!scope.reportLayoutOptions) {
                    scope.reportLayoutOptions = {};
                }

                scope.isReport = metaService.isReport(scope.entityType);

                scope.fields = {};

                var entityAttrs = [];
                var dynamicAttrs = [];

                var viewContext = scope.evDataService.getViewContext();
                var contextMenu = {};
                var ttypes = null;

                var getAttributes = function () {

                    var allAttrsList = [];

                    if (viewContext === 'reconciliation_viewer') {

                        allAttrsList = scope.attributeDataService.getReconciliationAttributes();

                    } else {

                        switch (scope.entityType) {
                            case 'balance-report':
                                allAttrsList = scope.attributeDataService.getBalanceReportAttributes();
                                break;

                            case 'pl-report':
                                allAttrsList = scope.attributeDataService.getPlReportAttributes();
                                break;

                            case 'transaction-report':
                                allAttrsList = scope.attributeDataService.getTransactionReportAttributes();
                                break;

                            default:
                                entityAttrs = [];
                                dynamicAttrs = [];
                                allAttrsList = [];

                                entityAttrs = scope.attributeDataService.getEntityAttributesByEntityType(scope.entityType);

                                entityAttrs.forEach(function (item) {
                                    if (item.key === 'subgroup' && item.value_entity.indexOf('strategy') !== -1) {
                                        item.name = 'Group';
                                    }
                                    item.entity = scope.entityType;
                                });

                                var instrumentUserFields = scope.attributeDataService.getInstrumentUserFields();
                                var transactionUserFields = scope.attributeDataService.getTransactionUserFields();

                                instrumentUserFields.forEach(function (field) {

                                    entityAttrs.forEach(function (entityAttr) {

                                        if (entityAttr.key === field.key) {
                                            entityAttr.name = field.name;
                                        }

                                    })

                                });

                                transactionUserFields.forEach(function (field) {

                                    entityAttrs.forEach(function (entityAttr) {

                                        if (entityAttr.key === field.key) {
                                            entityAttr.name = field.name;
                                        }

                                    })

                                });

                                dynamicAttrs = scope.attributeDataService.getDynamicAttributesByEntityType(scope.entityType);


                                dynamicAttrs = dynamicAttrs.map(function (attribute) {

                                    var result = {};

                                    result.attribute_type = Object.assign({}, attribute);
                                    result.value_type = attribute.value_type;
                                    result.content_type = scope.contentType;
                                    result.key = 'attributes.' + attribute.user_code;
                                    result.name = attribute.name;

                                    return result

                                });

                                allAttrsList = allAttrsList.concat(entityAttrs);
                                allAttrsList = allAttrsList.concat(dynamicAttrs);
                        }

                    }

                    return allAttrsList;

                };

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

                        if (scope.entityType === 'transaction-report') {
                            scope.datepickerFromDisplayOptions = {
                                position: 'left',
                                labelName: 'Date from (incl)'
                            };
                        }

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

                scope.resolveFilterValue = function (field) {
                    return field.id ? field.id : field.key;
                };

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

                        console.log('res', res);

                        if (res.status === 'agree') {

                            // scope.externalCallback({reportOptionsUpdated: true, options: {reportOptions: res.data}});
                            scope.evEventService.dispatchEvent(evEvents.REDRAW_TABLE)
                        }

                    });


                };

                scope.openContextMenu = function ($event) {

                    var lastClickedRow = scope.evDataService.getActiveObject();

                    if (lastClickedRow) {

                        var objectId = lastClickedRow.___id;
                        var parentGroupHashId = lastClickedRow.___parentId;

                        var contextMenuPosition = 'top: ' + $event.pageY + 'px; right: 0;';

                        if (scope.isReport) {

                            rvDomManager.createPopupMenu(objectId, contextMenu, ttypes, parentGroupHashId, scope.evDataService, scope.evEventService, contextMenuPosition);

                        } else {
                            evDomManager.createPopupMenu(objectId, parentGroupHashId, scope.evDataService, scope.evEventService, contextMenuPosition);
                        }

                    }

                };

                scope.resizeFilterSideNav = function (actionType) {

                    if (actionType === 'collapse') {
                        $('body').addClass('filter-side-nav-collapsed');
                    } else {
                        $('body').removeClass('filter-side-nav-collapsed');
                    }

                    scope.evEventService.dispatchEvent(evEvents.TOGGLE_FILTER_AREA);

                };

                scope.openFilterSettings = function ($mdOpenMenu, ev) {
                    $mdOpenMenu(ev);
                };

                scope.toggleFilterState = function () {

                    scope.evDataService.resetData();
                    scope.evDataService.resetRequestParameters();

                    var rootGroup = scope.evDataService.getRootGroupData();

                    scope.evDataService.setActiveRequestParametersId(rootGroup.___id);

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE);

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

                var attrsWithoutFilters = ['notes'];

                scope.addFilter = function ($event) {

                    var allAttrsList = getAttributes();

                    var availableAttrs;

                    availableAttrs = allAttrsList.filter(function (attr) {
                        for (var i = 0; i < scope.filters.length; i++) {
                            if (scope.filters[i].key === attr.key) {
                                return false;
                            }
                        }

                        if (attrsWithoutFilters.indexOf(attr.key) !== -1) {
                            return false;
                        }

                        return true;
                    });

                    $mdDialog.show({
                        controller: "TableAttributeSelectorDialogController as vm",
                        templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                        targetEvent: $event,
                        multiple: true,
                        locals: {
                            data: {
                                availableAttrs: availableAttrs,
                                title: 'Choose column to add'
                            }
                        }
                    }).then(function (res) {

                        if (res && res.status === "agree") {
                            res.data.groups = true;
                            scope.filters.push(res.data);
                            scope.evDataService.setFilters(scope.filters);
                            scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
                        }

                    });

                };

                var dragAndDrop = {

                    init: function () {
                        this.dragulaInit();
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

                            var filterCards = target.querySelectorAll('.filterCardHolder');
                            var newFiltersOrder = [];

                            filterCards.forEach(function (filter) {

                                var filterKey = filter.dataset.filterKey;

                                for (var i = 0; i < scope.filters.length; i++) {

                                    if (scope.filters[i].key === filterKey) {
                                        newFiltersOrder.push(scope.filters[i]);
                                        break;
                                    }

                                }

                            });

                            scope.evDataService.setFilters(newFiltersOrder);
                            scope.evEventService.dispatchEvent(evEvents.FILTERS_CHANGE);

                        });
                    },

                    dragulaInit: function () {
                        var items = [document.querySelector('.g-filters-holder')];

                        this.dragula = dragula(items, {
                            revertOnSpill: true
                        });
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

                var init = function () {

                    uiService.getTransactionFieldList({pageSize: 1000}).then(function (data) {

                        var transactionFields = data.results;

                        console.log('transactionFields transactionFields', transactionFields);

                        scope.transactionsUserDates = transactionFields.filter(function (field) {
                            return ['user_date_1', 'user_date_2', 'user_date_3', 'user_date_4', 'user_date_5'].indexOf(field.key) !== -1;
                        });

                    });

                    syncFilters();

                    /*scope.evEventService.addEventListener(evEvents.DATA_LOAD_END, function () {

                    });*/

                    transactionTypeService.getListLight({
                        pageSize: 1000
                    }).then(function (data) {

                        uiService.getContextMenuLayoutList().then(function (contextMenuData) {

                            if (contextMenuData.results.length) {

                                var contextMenuLayout = contextMenuData.results[0];
                                contextMenu = contextMenuLayout.data.menu

                            } else {

                                contextMenu = {
                                    root: {
                                        items: [
                                            {
                                                name: 'Edit Instrument',
                                                action: 'edit_instrument'
                                            },
                                            {
                                                name: 'Edit Account',
                                                action: 'edit_account'
                                            },
                                            {
                                                name: 'Edit Portfolio',
                                                action: 'edit_portfolio'
                                            },
                                            {
                                                name: 'Edit Price',
                                                action: 'edit_price'
                                            },
                                            {
                                                name: 'Edit FX Rate',
                                                action: 'edit_fx_rate'
                                            },
                                            {
                                                name: 'Edit Pricing FX Rate',
                                                action: 'edit_pricing_currency'
                                            },
                                            {
                                                name: 'Edit Accrued FX Rate',
                                                action: 'edit_accrued_currency'
                                            },
                                            {
                                                name: 'Edit Currency',
                                                action: 'edit_currency'
                                            },
                                            {
                                                name: 'Open Book Manager',
                                                action: 'book_transaction'
                                            }
                                        ]
                                    }
                                };
                            }

                            ttypes = data.results;

                        });

                    });

                    scope.evEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {
                        syncFilters();
                    });

                    scope.evEventService.addEventListener(evEvents.REPORT_OPTIONS_CHANGE, function () {

                        scope.reportOptions = scope.evDataService.getReportOptions();
                        scope.reportLayoutOptions = scope.evDataService.getReportLayoutOptions();

                    });

                    scope.evEventService.addEventListener(evEvents.UPDATE_FILTER_AREA_SIZE, function () {

                        var interfaceLayout = scope.evDataService.getInterfaceLayout();

                        if (scope.sideNavCollapsed) {
                            interfaceLayout.filterArea.width = 239;
                        } else {
                            interfaceLayout.filterArea.width = 55;
                        }

                        scope.sideNavCollapsed = !scope.sideNavCollapsed;

                        scope.evDataService.setInterfaceLayout(interfaceLayout);

                        scope.evEventService.dispatchEvent(evEvents.UPDATE_TABLE_VIEWPORT);

                    });

                    scope.evEventService.addEventListener(evEvents.TOGGLE_FILTER_AREA, function () {
                        scope.evEventService.dispatchEvent(evEvents.UPDATE_FILTER_AREA_SIZE);
                    });

                    scope.evEventService.dispatchEvent(evEvents.UPDATE_EV_UI);

                };

                init();

            }
        }
    }


}());