/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var uiService = require('../../services/uiService');

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var customFieldService = require('../../services/reports/customFieldService');

    var evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService, attributeDataService, contentWrapElement) {

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityViewerDataService = entityViewerDataService;
        vm.entityViewerEventService = entityViewerEventService;

        vm.contentWrapElement = contentWrapElement;

        vm.entityType = vm.entityViewerDataService.getEntityType();

        vm.general = [];
        vm.attrs = [];
        vm.custom = [];

        vm.instrumentDynamicAttrs = [];
        vm.accountDynamicAttrs = [];
        vm.portfolioDynamicAttrs = [];

        vm.cardsDividedIntoTabs = true;

        var columns = vm.entityViewerDataService.getColumns();
        var filters = vm.entityViewerDataService.getFilters();
        var groups = vm.entityViewerDataService.getGroups();

        vm.attrsList = [];

        $('body').addClass('drag-dialog'); // hide backdrop

        var balanceAttrsToRemove = [
            'pricing_currency.notes', 'pricing_currency.reference_for_pricing', 'pricing_currency.daily_pricing_model.name', 'pricing_currency.default_fx_rate', 'currency.name',
            'currency.short_name', 'currency.notes', 'currency.user_code', 'currency.reference_for_pricing', 'currency.daily_pricing_model.name', 'currency.default_fx_rate', 'pricing_currency_fx_rate'
        ];

        var balancePerformanceAttrsToRemove = [
            'principal_fx', 'principal_fixed_loc', 'principal_fx_loc', 'carry_fixed_loc', 'carry', 'carry_fx', 'carry_fx_loc', 'overheads', 'overheads_fixed', 'overheads_fixed_loc',
            'carry_fixed', 'overheads_fx', 'overheads_fx_loc', 'total', 'total_loc', 'total_fx', 'total_fx_loc', 'total_fixed', 'total_fixed_loc', 'carry_loc', 'overheads_loc',
            'principal', 'principal_loc'
        ];

        var balancePerformanceAttrsToRemove = [
            'principal_fx', 'principal_fixed_loc', 'principal_fx_loc', 'carry_fixed_loc', 'carry', 'carry_fx', 'carry_fx_loc', 'overheads', 'overheads_fixed', 'overheads_fixed_loc',
            'carry_fixed', 'overheads_fx', 'overheads_fx_loc', 'total', 'total_loc', 'total_fx', 'total_fx_loc', 'total_fixed', 'total_fixed_loc', 'carry_loc', 'overheads_loc',
            'principal', 'principal_loc'
        ];

        var instrumentAttrsToRemove = [
            'instrument.instrument_type.is_active', 'instrument.instrument_type.instrument_class.name', 'instrument.pricing_currency.notes', 'instrument.pricing_currency.reference_for_pricing',
            'instrument.pricing_currency.daily_pricing_model.name', 'instrument.pricing_currency.default_fx_rate'
        ];

        var linkedInstrumentAttrsToShow = [
            'linked_instrument.name', 'linked_instrument.short_name', 'linked_instrument.user_code', 'linked_instrument.user_text_1', 'linked_instrument.user_text_2', 'linked_instrument.user_text_3'
        ];

        var accountAttrsToRemove = ['account.type.transaction_details_expr'];

        var strategy1AttrsToRemove = ['strategy1.subgroup.short_name', 'strategy1.subgroup.notes', 'strategy1.subgroup.user_code'];
        var strategy2AttrsToRemove = ['strategy2.subgroup.short_name', 'strategy2.subgroup.notes', 'strategy2.subgroup.user_code'];
        var strategy3AttrsToRemove = ['strategy3.subgroup.short_name', 'strategy3.subgroup.notes', 'strategy3.subgroup.user_code'];

        var allocationAttrsToRemove = [
            'allocation.instrument_type.notes', 'allocation.instrument_type.is_active', 'allocation.instrument_type.instrument_class.name', 'allocation.is_active', 'allocation.reference_for_pricing',
            'allocation.pricing_currency.name', 'allocation.pricing_currency.short_name', 'allocation.pricing_currency.notes', 'allocation.pricing_currency.user_code',
            'allocation.pricing_currency.daily_pricing_model.name', 'allocation.pricing_currency.default_fx_rate', 'allocation.price_multiplier', 'allocation.pricing_currency.reference_for_pricing',
            'allocation.accrued_currency.name', 'allocation.accrued_currency.short_name', 'allocation.accrued_currency.notes', 'allocation.accrued_currency.user_code', 'allocation.accrued_currency.reference_for_pricing',
            'allocation.accrued_currency.daily_pricing_model.name', 'allocation.accrued_currency.default_fx_rate', 'allocation.maturity_date', 'allocation.maturity_price', 'allocation.accrued_multiplier',
            'allocation.daily_pricing_model.name', 'allocation.payment_size_detail.name', 'allocation.default_price', 'allocation.default_accrued'
        ];

        var filterAttrsToShow = function (vmAttrKey, attrsToRemoveArray) {
            vm[vmAttrKey] = vm[vmAttrKey].filter(function (attr) {
                if (attrsToRemoveArray.indexOf(attr.key) !== -1) {
                    return false;
                }
                return true;
            })
        };

        vm.getAttributes = function () {

            vm.balanceAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereport', '', 'Balance', {maxDepth: 1});

            vm.balanceMismatchAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereportmismatch', '', 'Mismatch', {maxDepth: 1});

            vm.balancePerformanceAttrs = attributeDataService.getAllAttributesAsFlatList('reports.balancereportperfomance', '', 'Perfomance', {maxDepth: 1});

            vm.allocationAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'allocation', 'Allocation', {maxDepth: 1});

            vm.instrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            vm.linkedInstrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            vm.accountAttrs = attributeDataService.getAllAttributesAsFlatList('accounts.account', 'account', 'Account', {maxDepth: 1});

            vm.portfolioAttrs = attributeDataService.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            vm.strategy1attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1', 'Strategy 1', {maxDepth: 1});

            vm.strategy2attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2', 'Strategy 2', {maxDepth: 1});

            vm.strategy3attrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3', 'Strategy 3', {maxDepth: 1});

            var instrumentUserFields = attributeDataService.getInstrumentUserFields();

            instrumentUserFields.forEach(function (field) {

                vm.instrumentAttrs = vm.instrumentAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'instrument.' + field.key) {
                        entityAttr.name = 'Instrument. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.allocationAttrs = vm.allocationAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'allocation.' + field.key) {
                        entityAttr.name = 'Allocation. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.linkedInstrumentAttrs = vm.linkedInstrumentAttrs.map(function (entityAttr) {

                    if (entityAttr.key === 'linked_instrument.' + field.key) {
                        entityAttr.name = 'Linked Instrument. ' + field.name;
                    }

                    return entityAttr;

                });


            });

            vm.custom = attributeDataService.getCustomFieldsByEntityType(vm.entityType);

            vm.custom = vm.custom.map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });

            var portfolioDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('portfolio');
            var accountDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('account');
            var instrumentDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('instrument');

            vm.portfolioDynamicAttrs = attributeDataService.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            vm.accountDynamicAttrs = attributeDataService.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account', 'Account');
            vm.instrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            vm.allocationDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'allocation', 'Allocation');
            vm.linkedInstrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');

            vm.attrsList = vm.attrsList.concat(vm.balanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.balancePerformanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.balanceMismatchAttrs);
            vm.attrsList = vm.attrsList.concat(vm.custom);

            vm.attrsList = vm.attrsList.concat(vm.instrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.instrumentDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.accountAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.portfolioAttrs);
            vm.attrsList = vm.attrsList.concat(vm.portfolioDynamicAttrs);

            vm.attrsList = vm.attrsList.concat(vm.strategy1attrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2attrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3attrs);

            /*filterAttrsToShow('balanceAttrs', balanceAttrsToRemove);
            filterAttrsToShow('balancePerformanceAttrs', balancePerformanceAttrsToRemove);
            filterAttrsToShow('allocationAttrs', allocationAttrsToRemove);
            filterAttrsToShow('instrumentAttrs', instrumentAttrsToRemove);
            vm.linkedInstrumentAttrs = vm.linkedInstrumentAttrs.filter(function (attr) {
                if (linkedInstrumentAttrsToShow.indexOf(attr.key) !== -1) {
                    return true;
                }
                return false;
            });
            filterAttrsToShow('accountAttrs', accountAttrsToRemove);
            filterAttrsToShow('strategy1attrs', strategy1AttrsToRemove);
            filterAttrsToShow('strategy2attrs', strategy2AttrsToRemove);
            filterAttrsToShow('strategy3attrs', strategy3AttrsToRemove);*/

            /*vm.attrsList = attrsList;*/

            vm.syncAttrs();
            getSelectedAttrs();

            vm.readyStatus.content = true;

        };

        vm.checkAreaAccessibility = function (item, type) {
            if (type === 'group') {
                if (['notes', 'accounts', 'responsibles', 'counterparties', 'transaction_types', 'portfolios', 'tags', 'content_types'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            } else {
                if (['notes'].indexOf(item.key) !== -1) {
                    return true;
                }
                return false;
            }
        };

        vm.syncAttrs = function () {

            syncTypeAttrs(vm.balanceAttrs);
            syncTypeAttrs(vm.balancePerformanceAttrs);
            syncTypeAttrs(vm.balanceMismatchAttrs);
            syncTypeAttrs(vm.custom);
            syncTypeAttrs(vm.allocationAttrs);
            syncTypeAttrs(vm.allocationDynamicAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.linkedInstrumentAttrs);
            syncTypeAttrs(vm.linkedInstrumentDynamicAttrs);

            syncTypeAttrs(vm.accountAttrs);
            syncTypeAttrs(vm.accountDynamicAttrs);

            syncTypeAttrs(vm.portfolioAttrs);
            syncTypeAttrs(vm.portfolioDynamicAttrs);

            syncTypeAttrs(vm.strategy1attrs);
            syncTypeAttrs(vm.strategy2attrs);
            syncTypeAttrs(vm.strategy3attrs);

        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {

                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;

                columns.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].columns = true;
                        }


                    }

                });

                filters.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].filters = true;
                        }

                    }

                });

                groups.map(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].groups = true;
                        }

                    }

                });
            }
        }

        function updateTypeAttrs(attrs) {
            var c, g, f;
            var columnExist, groupExist, filterExist;

            attrs.forEach(function (attr) {

                columnExist = false;
                groupExist = false;
                filterExist = false;

                for (c = 0; c < columns.length; c = c + 1) {

                    if (attr.entity === columns[c].entity) {

                        if (attr.key === columns[c].key) {
                            columnExist = true;
                            if (attr.columns === false) {
                                columns.splice(c, 1);
                                c = c - 1;
                            }
                            break;
                        }


                    }

                }


                /////// GROUPs

                for (g = 0; g < groups.length; g = g + 1) {

                    if (attr.entity === groups[g].entity) {


                        if (attr.key === groups[g].key) {
                            groupExist = true;
                            if (attr.groups === false) {
                                groups.splice(g, 1);
                                g = g - 1;
                            }
                            break;
                        }


                    }

                }


                /////// FILTERING

                for (f = 0; f < filters.length; f = f + 1) {

                    if (attr.entity === filters[f].entity) {

                        if (attr.key === filters[f].key) {
                            filterExist = true;
                            if (attr.filters === false) {
                                filters.splice(f, 1);
                                f = f - 1;
                            }
                            break;
                        }

                    }

                }

                if (!columnExist && attr.columns === true) {
                    columns.push(attr);
                }

                if (!groupExist && attr.groups === true) {
                    groups.push(attr);
                }

                if (!filterExist && attr.filters === true) {
                    filters.push(attr);
                }

            });

            vm.entityViewerDataService.setColumns(columns);
            vm.entityViewerDataService.setGroups(groups);
            vm.entityViewerDataService.setFilters(filters);

        };

        vm.updateAttrs = function (attrs) {

            updateTypeAttrs(attrs);

            evDataHelper.updateColumnsIds(vm.entityViewerDataService);
            evDataHelper.setColumnsDefaultWidth(vm.entityViewerDataService);

            vm.entityViewerEventService.dispatchEvent(evEvents.COLUMNS_CHANGE);
            vm.entityViewerEventService.dispatchEvent(evEvents.FILTERS_CHANGE);
            vm.entityViewerEventService.dispatchEvent(evEvents.GROUPS_CHANGE);

            vm.entityViewerEventService.dispatchEvent(evEvents.REDRAW_TABLE);

        };

        // format data for SELECTED tab
        var selectedGroups = [];
        var selectedColumns = [];
        var selectedFilters = [];

        var separateSelectedAttrs = function (attributes, attrsVmKey) {

            for (var i = 0; i < attributes.length; i++) {
                var attribute = JSON.parse(angular.toJson(attributes[i]));
                attribute['attrsVmKey'] = attrsVmKey;

                // attrsVmKey used in vm.updateAttrs and selectedDnD
                /*if (attribute.groups) {
                    selectedGroups.push(attribute);
                } else if (attribute.columns) {
                    selectedColumns.push(attribute);
                } else if (attribute.filters) {
                    selectedFilters.push(attribute);
                };*/

                if (attribute.groups) {
                    selectedGroups.push(attribute);
                }

                if (attribute.columns) {
                    selectedColumns.push(attribute);
                }

                if (attribute.filters) {
                    selectedFilters.push(attribute);
                }

            }
        };

        var groupSelectedGroups = function (insideTable, selectedAttrs) { // putting selected attributes in the same order as in the table

            var orderedSelAttrs = [];

            var a;
            for (a = 0; a < insideTable.length; a++) {
                var attr = insideTable[a];

                for (var i = 0; i < selectedAttrs.length; i++) {
                    var sAttr = selectedAttrs[i];

                    if (sAttr.key === attr.key) {
                        orderedSelAttrs.push(sAttr);
                        break;
                    }

                }

            }

            return orderedSelAttrs;

        };

        vm.selectedGroups = [];
        vm.selectedColumns = [];
        vm.selectedFilters = [];

        var getSelectedAttrs = function () {

            selectedGroups = [];
            selectedColumns = [];
            selectedFilters = [];

            separateSelectedAttrs(vm.balanceAttrs, 'balanceAttrs');
            separateSelectedAttrs(vm.balancePerformanceAttrs, 'balancePerformanceAttrs');
            separateSelectedAttrs(vm.balanceMismatchAttrs, 'balanceMismatchAttrs');
            separateSelectedAttrs(vm.custom, 'custom');
            separateSelectedAttrs(vm.allocationAttrs, 'allocationAttrs');
            separateSelectedAttrs(vm.allocationDynamicAttrs, 'allocationDynamicAttrs');

            separateSelectedAttrs(vm.instrumentAttrs, 'instrumentAttrs');
            separateSelectedAttrs(vm.instrumentDynamicAttrs, 'instrumentDynamicAttrs');

            separateSelectedAttrs(vm.linkedInstrumentAttrs, 'linkedInstrumentAttrs');
            separateSelectedAttrs(vm.linkedInstrumentDynamicAttrs, 'linkedInstrumentDynamicAttrs');

            separateSelectedAttrs(vm.accountAttrs, 'accountAttrs');
            separateSelectedAttrs(vm.accountDynamicAttrs, 'accountDynamicAttrs');

            separateSelectedAttrs(vm.portfolioAttrs, 'portfolioAttrs');
            separateSelectedAttrs(vm.portfolioDynamicAttrs, 'portfolioDynamicAttrs');

            separateSelectedAttrs(vm.strategy1attrs, 'strategy1attrs');
            separateSelectedAttrs(vm.strategy2attrs, 'strategy2attrs');
            separateSelectedAttrs(vm.strategy3attrs, 'strategy3attrs');


            vm.selectedGroups = groupSelectedGroups(groups, selectedGroups);
            vm.selectedColumns = groupSelectedGroups(columns, selectedColumns);
            vm.selectedFilters = groupSelectedGroups(filters, selectedFilters);

        };
        // < format data for SELECTED tab >

        vm.onSelectedAttrsChange = function (attributesList, selectedAttr) {

            for (var i = 0; i < attributesList.length; i++) {
                if (attributesList[i].key === selectedAttr.key) {
                    attributesList[i].groups = selectedAttr.groups;
                    attributesList[i].columns = selectedAttr.columns;
                    attributesList[i].filters = selectedAttr.filters;
                    break;
                }
            }

            vm.updateAttrs(attributesList);

        };


        vm.selectAttribute = function (selectedGroup, event) {

            var availableAttrs;
            var dialogTitle;

            switch (selectedGroup) {
                case 'group':
                    dialogTitle = 'Choose column to add';
                    availableAttrs = vm.attrsList.filter(function (attr) {
                        return !attr.groups;
                    });
                    break;
                case 'column':
                    dialogTitle = 'Choose column to add';
                    availableAttrs = vm.attrsList.filter(function (attr) {
                        return !attr.columns;
                    });
                    break;
                case 'filter':
                    dialogTitle = 'Choose filter to add';
                    availableAttrs = vm.attrsList.filter(function (attr) {
                        return !attr.filters;
                    });
                    break;
            }

            $mdDialog.show({
                controller: "TableAttributeSelectorDialogController as vm",
                templateUrl: "views/dialogs/table-attribute-selector-dialog-view.html",
                targetEvent: event,
                multiple: true,
                locals: {
                    data: {
                        availableAttrs: availableAttrs,
                        title: dialogTitle
                    }
                }
            }).then(function (res) {

                if (res && res.status === "agree") {

                    for (var i = 0; i < vm.attrsList.length; i++) {

                        if (vm.attrsList[i].key === res.data.key) {

                            switch (selectedGroup) {
                                case 'group':
                                    vm.attrsList[i].groups = true;
                                    break;
                                case 'column':
                                    vm.attrsList[i].columns = true;
                                    break;
                                case 'filter':
                                    vm.attrsList[i].filters = true;
                                    break;
                            }

                            vm.updateAttrs(vm.attrsList);
                            break;
                        }

                    }

                }

            });

        };

        vm.cancel = function () {
            $('body').removeClass('drag-dialog');
            $mdDialog.hide();
        };

        vm.MABtnVisibility = function (entityType) {
            return metaService.checkRestrictedEntityTypesForAM(entityType);
        };

        var init = function () {

            vm.getAttributes();

            vm.entityViewerEventService.addEventListener(evEvents.COLUMNS_CHANGE, function () {

                columns = vm.entityViewerDataService.getColumns();
                vm.syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.GROUPS_CHANGE, function () {

                groups = vm.entityViewerDataService.getGroups();
                vm.syncAttrs();
                getSelectedAttrs();

            });

            vm.entityViewerEventService.addEventListener(evEvents.FILTERS_CHANGE, function () {

                filters = vm.entityViewerDataService.getFilters();
                vm.syncAttrs();
                getSelectedAttrs();

            });

        };

        init();
    }

}());