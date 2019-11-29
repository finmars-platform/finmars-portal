/**
 * Created by szhitenev on 05.05.2016.
 */
(function () {

    'use strict';

    var logService = require('../../../../../core/services/logService');

    var uiService = require('../../services/uiService');

    var evEvents = require('../../services/entityViewerEvents');

    var metaService = require('../../services/metaService');
    var attributeTypeService = require('../../services/attributeTypeService');
    var customFieldService = require('../../services/reports/customFieldService');

    var evDataHelper = require('../../helpers/ev-data.helper');

    module.exports = function ($scope, $mdDialog, entityViewerDataService, entityViewerEventService, attributeDataService, contentWrapElement) {

        logService.controller('gModalController', 'initialized');

        var vm = this;
        vm.readyStatus = {content: false};

        vm.entityViewerDataService = entityViewerDataService;
        vm.entityViewerEventService = entityViewerEventService;

        vm.contentWrapElement = contentWrapElement;

        vm.entityType = vm.entityViewerDataService.getEntityType();

        logService.property('vm.entityType', vm.entityType);

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

        vm.getAttributes = function () {

            //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.transactionAttrs = attributeDataService.getAllAttributesAsFlatList('reports.transactionreport', '', 'Transaction', {maxDepth: 1});

            vm.complexTransactionAttrs = attributeDataService.getAllAttributesAsFlatList('transactions.complextransaction', 'complex_transaction', 'Complex Transaction', {maxDepth: 1});

            vm.portfolioAttrs = attributeDataService.getAllAttributesAsFlatList('portfolios.portfolio', 'portfolio', 'Portfolio', {maxDepth: 1});

            vm.instrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'instrument', 'Instrument', {maxDepth: 1});

            vm.responsibleAttrs = attributeDataService.getAllAttributesAsFlatList('counterparties.responsible', 'responsible', 'Responsible', {maxDepth: 1});

            vm.counterpartyAttrs = attributeDataService.getAllAttributesAsFlatList('counterparties.counterparty', 'counterparty', 'Counterparty', {maxDepth: 1});

            // instruments

            vm.linkedInstrumentAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'linked_instrument', 'Linked Instrument', {maxDepth: 1});

            vm.allocationBalanceAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'allocation_balance', 'Allocation Balance', {maxDepth: 1});

            vm.allocationPlAttrs = attributeDataService.getAllAttributesAsFlatList('instruments.instrument', 'allocation_pl', 'Allocation P&L', {maxDepth: 1});

            // currencies

            vm.transactionCurrencyAttrs = attributeDataService.getAllAttributesAsFlatList('currencies.currency', 'transaction_currency', 'Transaction currency', {maxDepth: 1});

            vm.settlementCurrencyAttrs = attributeDataService.getAllAttributesAsFlatList('currencies.currency', 'settlement_currency', 'Settlement currency', {maxDepth: 1});

            // accounts

            vm.accountPositionAttrs = attributeDataService.getAllAttributesAsFlatList('accounts.account', 'account_position', 'Account Position', {maxDepth: 1});

            vm.accountCashAttrs = attributeDataService.getAllAttributesAsFlatList('accounts.account', 'account_cash', 'Account Cash', {maxDepth: 1});

            vm.accountInterimAttrs = attributeDataService.getAllAttributesAsFlatList('accounts.account', 'account_interim', 'Account Interim', {maxDepth: 1});

            // strategies

            vm.strategy1cashAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_cash', 'Strategy 1 Cash', {maxDepth: 1});

            vm.strategy1positionAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy1', 'strategy1_position', 'Strategy 1 Position', {maxDepth: 1});

            vm.strategy2cashAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_cash', 'Strategy 2 Cash', {maxDepth: 1});

            vm.strategy2positionAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy2', 'strategy2_position', 'Strategy 2 Position', {maxDepth: 1});

            vm.strategy3cashAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_cash', 'Strategy 3 Cash', {maxDepth: 1});

            vm.strategy3positionAttrs = attributeDataService.getAllAttributesAsFlatList('strategies.strategy3', 'strategy3_position', 'Strategy 3 Position', {maxDepth: 1});

            var transactionUserFields = attributeDataService.getTransactionUserFields();

            transactionUserFields.forEach(function (field) {

                vm.complexTransactionAttrs = vm.complexTransactionAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'complex_transaction.' + field.key) {
                        entityAttr.name = 'Complex Transaction. ' + field.name;
                    }

                    return entityAttr;

                });

            });

            vm.transactionTypeAttrs = [];

            vm.complexTransactionAttrs = vm.complexTransactionAttrs.filter(function (entityAttr) {

                if (entityAttr.key.indexOf('complex_transaction.transaction_type.') !== -1) {

                    if (entityAttr.key.indexOf('complex_transaction.transaction_type.user_text_') === -1 &&
                        entityAttr.key.indexOf('complex_transaction.transaction_type.user_number_') === -1 &&
                        entityAttr.key.indexOf('complex_transaction.transaction_type.user_date_') === -1) {

                        vm.transactionTypeAttrs.push(entityAttr);

                    }

                    return false;

                } else {
                    return true;
                }

            });

            var instrumentUserFields = attributeDataService.getInstrumentUserFields();

            instrumentUserFields.forEach(function (field) {

                vm.instrumentAttrs = vm.instrumentAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'instrument.' + field.key) {
                        entityAttr.name = 'Instrument. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.linkedInstrumentAttrs = vm.linkedInstrumentAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'linked_instrument.' + field.key) {
                        entityAttr.name = 'Linked Instrument. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.allocationBalanceAttrs = vm.allocationBalanceAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'allocation_balance.' + field.key) {
                        entityAttr.name = 'Allocation Balance. ' + field.name;
                    }

                    return entityAttr;

                });

                vm.allocationPlAttrs = vm.allocationPlAttrs.map(function (entityAttr, index) {

                    if (entityAttr.key === 'allocation_pl.' + field.key) {
                        entityAttr.name = 'Allocation P&L. ' + field.name;
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
            var transactionTypeDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('transaction-type');
            var complexTransactionDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('complex-transaction');
            var responsibleDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('responsible');
            var counterpartyDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('counterparty');

            var instrumentDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('instrument');

            var accountDynamicAttrs = attributeDataService.getDynamicAttributesByEntityType('account');


            vm.portfolioDynamicAttrs = attributeDataService.formatAttributeTypes(portfolioDynamicAttrs, 'portfolios.portfolio', 'portfolio', 'Portfolio');
            vm.complexTransactionDynamicAttrs = attributeDataService.formatAttributeTypes(complexTransactionDynamicAttrs, 'transactions.complextransaction', 'complex_transaction', 'Complex Transaction');
            vm.transactionTypeDynamicAttrs = attributeDataService.formatAttributeTypes(transactionTypeDynamicAttrs, 'transactions.transactiontype', 'transaction_type', 'Transaction Type');
            vm.responsibleDynamicAttrs = attributeDataService.formatAttributeTypes(responsibleDynamicAttrs, 'counterparties.responsible', 'responsible', 'Responsible');
            vm.counterpartyDynmicAttrs = attributeDataService.formatAttributeTypes(counterpartyDynamicAttrs, 'counterparties.counterparty', 'counterparty', 'Counterparty');

            vm.instrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'instrument', 'Instrument');
            vm.linkedInstrumentDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'linked_instrument', 'Linked Instrument');
            vm.allocationBalanceDynamicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'allocation_balance', 'Allocation Balance');
            vm.allocationPlDnymaicAttrs = attributeDataService.formatAttributeTypes(instrumentDynamicAttrs, 'instruments.instrument', 'allocation_pl', 'Allocation PL');

            vm.accountPositionDynamicAttrs = attributeDataService.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account_position', 'Account Position');
            vm.accountCashDynamicAttrs = attributeDataService.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account_cash', 'Account Cash');
            vm.accountInterimDynamicAttrs = attributeDataService.formatAttributeTypes(accountDynamicAttrs, 'accounts.account', 'account_interim', 'Account Interim');

            //vm.entityAttrs = metaService.getEntityAttrs(vm.entityType);

            vm.attrsList = vm.attrsList.concat(vm.transactionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.complexTransactionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.transactionTypeAttrs);
            vm.attrsList = vm.attrsList.concat(vm.portfolioAttrs);
            vm.attrsList = vm.attrsList.concat(vm.instrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.responsibleAttrs);
            vm.attrsList = vm.attrsList.concat(vm.counterpartyAttrs);

            vm.attrsList = vm.attrsList.concat(vm.portfolioDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.complexTransactionDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.transactionTypeDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.responsibleDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.counterpartyDynmicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.custom);

            // instruments

            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationBalanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationPlAttrs);

            vm.attrsList = vm.attrsList.concat(vm.instrumentDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationBalanceDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationPlDnymaicAttrs);

            // currencies

            vm.attrsList = vm.attrsList.concat(vm.transactionCurrencyAttrs);
            vm.attrsList = vm.attrsList.concat(vm.settlementCurrencyAttrs);

            // accounts

            vm.attrsList = vm.attrsList.concat(vm.accountPositionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountCashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountInterimAttrs);

            vm.attrsList = vm.attrsList.concat(vm.accountPositionDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountCashDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountInterimDynamicAttrs);

            // strategies

            vm.attrsList = vm.attrsList.concat(vm.strategy1cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy1positionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2positionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3positionAttrs);


            vm.syncAttrs();
            getSelectedAttrs();

            vm.readyStatus.content = true;

        };

        vm.getCustomAttrs = function () {

            vm.custom = attributeDataService.getCustomFieldsByEntityType(vm.entityType);
            vm.custom = vm.custom.map(function (customItem) {

                customItem.custom_field = Object.assign({}, customItem);

                customItem.key = 'custom_fields.' + customItem.user_code;
                customItem.name = 'Custom Field. ' + customItem.name;

                return customItem

            });

            vm.attrsList = [];

            vm.attrsList = vm.attrsList.concat(vm.transactionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.complexTransactionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.transactionTypeAttrs);
            vm.attrsList = vm.attrsList.concat(vm.portfolioAttrs);
            vm.attrsList = vm.attrsList.concat(vm.instrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.responsibleAttrs);
            vm.attrsList = vm.attrsList.concat(vm.counterpartyAttrs);

            vm.attrsList = vm.attrsList.concat(vm.portfolioDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.complexTransactionDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.transactionTypeDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.responsibleDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.counterpartyDynmicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.custom);

            // instruments

            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationBalanceAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationPlAttrs);

            vm.attrsList = vm.attrsList.concat(vm.instrumentDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.linkedInstrumentDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationBalanceDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.allocationPlDnymaicAttrs);

            // currencies

            vm.attrsList = vm.attrsList.concat(vm.transactionCurrencyAttrs);
            vm.attrsList = vm.attrsList.concat(vm.settlementCurrencyAttrs);

            // accounts

            vm.attrsList = vm.attrsList.concat(vm.accountPositionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountCashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountInterimAttrs);

            vm.attrsList = vm.attrsList.concat(vm.accountPositionDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountCashDynamicAttrs);
            vm.attrsList = vm.attrsList.concat(vm.accountInterimDynamicAttrs);

            // strategies

            vm.attrsList = vm.attrsList.concat(vm.strategy1cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy1positionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy2positionAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3cashAttrs);
            vm.attrsList = vm.attrsList.concat(vm.strategy3positionAttrs);

            vm.updateAttrs(vm.custom);

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

            syncTypeAttrs(vm.transactionAttrs);
            syncTypeAttrs(vm.complexTransactionAttrs);
            syncTypeAttrs(vm.transactionTypeAttrs);
            syncTypeAttrs(vm.complexTransactionDynamicAttrs);
            syncTypeAttrs(vm.transactionTypeDynamicAttrs);

            syncTypeAttrs(vm.portfolioAttrs);
            syncTypeAttrs(vm.portfolioDynamicAttrs);

            syncTypeAttrs(vm.instrumentAttrs);
            syncTypeAttrs(vm.instrumentDynamicAttrs);

            syncTypeAttrs(vm.responsibleAttrs);
            syncTypeAttrs(vm.responsibleDynamicAttrs);

            syncTypeAttrs(vm.counterpartyAttrs);
            syncTypeAttrs(vm.counterpartyDynmicAttrs);

            syncTypeAttrs(vm.linkedInstrumentAttrs);
            syncTypeAttrs(vm.linkedInstrumentDynamicAttrs);

            syncTypeAttrs(vm.allocationBalanceAttrs);
            syncTypeAttrs(vm.allocationBalanceDynamicAttrs);

            syncTypeAttrs(vm.allocationPlAttrs);
            syncTypeAttrs(vm.allocationPlDnymaicAttrs);

            syncTypeAttrs(vm.transactionCurrencyAttrs);
            syncTypeAttrs(vm.settlementCurrencyAttrs);

            syncTypeAttrs(vm.accountPositionAttrs);
            syncTypeAttrs(vm.accountPositionDynamicAttrs);

            syncTypeAttrs(vm.accountCashAttrs);
            syncTypeAttrs(vm.accountCashDynamicAttrs);

            syncTypeAttrs(vm.accountInterimAttrs);
            syncTypeAttrs(vm.accountInterimDynamicAttrs);

            syncTypeAttrs(vm.strategy1cashAttrs);
            syncTypeAttrs(vm.strategy1positionAttrs);

            syncTypeAttrs(vm.strategy2cashAttrs);
            syncTypeAttrs(vm.strategy2positionAttrs);

            syncTypeAttrs(vm.strategy3cashAttrs);
            syncTypeAttrs(vm.strategy3positionAttrs);

            syncTypeAttrs(vm.custom);

        };

        function syncTypeAttrs(attrs) {

            var i;
            for (i = 0; i < attrs.length; i = i + 1) {

                attrs[i].columns = false;
                attrs[i].filters = false;
                attrs[i].groups = false;

                columns.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].columns = true;
                        }

                    }

                });

                filters.forEach(function (item) {

                    if (attrs[i].entity === item.entity) {

                        if (attrs[i].key === item.key) {
                            attrs[i].filters = true;
                        }

                    }

                });

                groups.forEach(function (item) {

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


                /////// groups

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

        }

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

            separateSelectedAttrs(vm.transactionAttrs, 'transactionAttrs');
            separateSelectedAttrs(vm.complexTransactionAttrs, 'complexTransactionAttrs');
            separateSelectedAttrs(vm.transactionTypeAttrs, 'transactionTypeAttrs');
            separateSelectedAttrs(vm.complexTransactionDynamicAttrs, 'complexTransactionDynamicAttrs');
            separateSelectedAttrs(vm.transactionTypeDynamicAttrs, 'transactionTypeDynamicAttrs');

            separateSelectedAttrs(vm.portfolioAttrs, 'portfolioAttrs');
            separateSelectedAttrs(vm.portfolioDynamicAttrs, 'portfolioDynamicAttrs');

            separateSelectedAttrs(vm.instrumentAttrs, 'instrumentAttrs');
            separateSelectedAttrs(vm.instrumentDynamicAttrs, 'instrumentDynamicAttrs');

            separateSelectedAttrs(vm.responsibleAttrs, 'responsibleAttrs');
            separateSelectedAttrs(vm.responsibleDynamicAttrs, 'responsibleDynamicAttrs');

            separateSelectedAttrs(vm.counterpartyAttrs, 'counterpartyAttrs');
            separateSelectedAttrs(vm.counterpartyDynmicAttrs, 'counterpartyDynmicAttrs');

            separateSelectedAttrs(vm.linkedInstrumentAttrs, 'linkedInstrumentAttrs');
            separateSelectedAttrs(vm.linkedInstrumentDynamicAttrs, 'linkedInstrumentDynamicAttrs');

            separateSelectedAttrs(vm.allocationBalanceAttrs, 'allocationBalanceAttrs');
            separateSelectedAttrs(vm.allocationBalanceDynamicAttrs, 'allocationBalanceDynamicAttrs');

            separateSelectedAttrs(vm.allocationPlAttrs, 'allocationPlAttrs');
            separateSelectedAttrs(vm.allocationPlDnymaicAttrs, 'allocationPlDnymaicAttrs');

            separateSelectedAttrs(vm.transactionCurrencyAttrs, 'transactionCurrencyAttrs');
            separateSelectedAttrs(vm.settlementCurrencyAttrs, 'settlementCurrencyAttrs');

            separateSelectedAttrs(vm.accountPositionAttrs, 'accountPositionAttrs');
            separateSelectedAttrs(vm.accountPositionDynamicAttrs, 'accountPositionDynamicAttrs');

            separateSelectedAttrs(vm.accountCashAttrs, 'accountCashAttrs');
            separateSelectedAttrs(vm.accountCashDynamicAttrs, 'accountCashDynamicAttrs');

            separateSelectedAttrs(vm.accountInterimAttrs, 'accountInterimAttrs');
            separateSelectedAttrs(vm.accountInterimDynamicAttrs, 'accountInterimDynamicAttrs');

            separateSelectedAttrs(vm.strategy1cashAttrs, 'strategy1cashAttrs');
            separateSelectedAttrs(vm.strategy1positionAttrs, 'strategy1positionAttrs');

            separateSelectedAttrs(vm.strategy2cashAttrs, 'strategy2cashAttrs');
            separateSelectedAttrs(vm.strategy2positionAttrs, 'strategy2positionAttrs');

            separateSelectedAttrs(vm.strategy3cashAttrs, 'strategy3cashAttrs');
            separateSelectedAttrs(vm.strategy3positionAttrs, 'strategy3positionAttrs');

            separateSelectedAttrs(vm.custom, 'custom');

            vm.selectedGroups = groupSelectedGroups(groups, selectedGroups);
            vm.selectedColumns = groupSelectedGroups(columns, selectedColumns);
            vm.selectedFilters = groupSelectedGroups(filters, selectedFilters);

        };

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

        /*vm.openCustomFieldsManager = function () {

            $mdDialog.show({
                controller: 'CustomFieldDialogController as vm',
                templateUrl: 'views/dialogs/custom-field-dialog-view.html',
                parent: angular.element(document.body),
                clickOutsideToClose: false,
                preserveScope: true,
                multiple: true,
                autoWrap: true,
                skipHide: true,
                locals: {
                    data: {
                        entityType: vm.entityType
                    }
                }
            })

        };*/

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

            vm.entityViewerEventService.addEventListener(evEvents.DYNAMIC_ATTRIBUTES_CHANGE, function () {
                vm.getCustomAttrs();
            });

        };

        init();

    }

}());