/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    var getMenu = function () {
        return window.fetch("portal/content/json/menu.json").then(function (data) {
            return data.json();
        });
    };

    var getBaseAttrs = function () {
        return [
            //{
            //    "key": "name",
            //    "name": "Name",
            //    "value_type": 10
            //},
            //{
            //    "key": "short_name",
            //    "name": "Short name",
            //    "value_type": 10
            //},
            //{
            //    "key": "notes",
            //    "name": "Notes",
            //    "value_type": 10
            //}
        ];
    };


    // DEPRECATED start look at metaRestrictionRepository

    var getEntitiesWithoutBaseAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction',
            'complex-transaction', 'transaction-report', 'cash-flow-projection-report', 'performance-report',
            'balance-report', 'pl-report', 'audit-transaction', 'audit-instrument'];
    };

    // DEPRECATED end look at metaRestrictionRepository

    var getEntitiesWithoutDynAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction', 'pricing-policy',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup',
            'audit-transaction', 'audit-instrument'];
    };

    var getEntityAttrs = function (entity) {
        var entityAttrs = {
            "portfolio": require('../models/portfolioPropsModel').getAttributes(),
            "audit-transaction": require('../models/auditTransactionPropsModel').getAttributes(),
            "audit-instrument": require('../models/auditInstrumentPropsModel').getAttributes(),
            "account": require('../models/accountPropsModel').getAttributes(),
            "tag": require('../models/tagPropsModel').getAttributes(),
            "account-type": require('../models/accountTypePropsModel').getAttributes(),
            "counterparty": require('../models/counterpartyPropsModel').getAttributes(),
            "counterparty-group": require('../models/counterpartyGroupPropsModel').getAttributes(),
            "responsible": require('../models/responsiblePropsModel').getAttributes(),
            "responsible-group": require('../models/responsibleGroupPropsModel').getAttributes(),
            "pricing-policy": require('../models/pricingPolicyPropsModel').getAttributes(),
            "instrument-type": require('../models/instrumentTypePropsModel').getAttributes(),
            "instrument": require('../models/instrumentPropsModel').getAttributes(),
            "transaction": require('../models/transactionPropsModel').getAttributes(),
            "transaction-type-group": require('../models/transactionTypeGroupPropsModel').getAttributes(),
            "transaction-type": require('../models/transactionTypePropsModel').getAttributes(),
            "currency": require('../models/currencyPropsModel').getAttributes(),
            "currency-history": require('../models/currencyHistoryPropsModel').getAttributes(),
            "price-history": require('../models/priceHistoryPropsModel').getAttributes(),
            "strategy-1": require('../models/strategy1PropsModel').getAttributes(),
            "strategy-2": require('../models/strategy2PropsModel').getAttributes(),
            "strategy-3": require('../models/strategy3PropsModel').getAttributes(),
            "strategy-1-subgroup": require('../models/strategy1subgroupPropsModel').getAttributes(),
            "strategy-2-subgroup": require('../models/strategy2subgroupPropsModel').getAttributes(),
            "strategy-3-subgroup": require('../models/strategy3subgroupPropsModel').getAttributes(),
            "strategy-1-group": require('../models/strategy1groupPropsModel').getAttributes(),
            "strategy-2-group": require('../models/strategy2groupPropsModel').getAttributes(),
            "strategy-3-group": require('../models/strategy3groupPropsModel').getAttributes(),
            "balance-report": require('../models/balanceReportPropsModel').getAttributes(),
            'report-addon-performance': require('../models/reportAddonPerformancePropsModel').getAttributes(),
            'report-addon-performance-pnl': require('../models/reportAddonPerformancePnlPropsModel').getAttributes(),
            'report-mismatch': require('../models/reportMismatchPropsModel').getAttributes(),
            "pl-report": require('../models/pnlReportPropsModel').getAttributes(),
            "transaction-report": require('../models/transactionReportPropsModel').getAttributes(),
            "cash-flow-projection-report": require('../models/cashFlowProjectionReportPropsModel').getAttributes(),
            "performance-report": require('../models/performanceReportPropsModel').getAttributes(),
            "complex-transaction": require('../models/complexTransactionPropsModel').getAttributes(),
            "instrument-scheme": require('../models/instrumentSchemePropsModel').getAttributes()
        };

        return entityAttrs[entity];
    };

    var getValueTypes = function () {
        return [{
            "value": 20,
            "display_name": "Number"
        }, {
            "value": 10,
            "display_name": "String"
        }, {
            "value": 40,
            "display_name": "Date"
        }, {
            "value": 30,
            "display_name": "Classifier"
        }, {
            "value": "decoration",
            "display_name": "Decoration"
        }, {
            "value": "field",
            "display_name": "Field"
        }, {
            "value": "mc_field",
            "display_name": "Multiple choice field"
        }, {
            "value": "boolean",
            "display_name": "Boolean"
        }, {
            "value": "float",
            "display_name": "Float"
        }
        ];
    };

    var getDynamicAttrsValueTypes = function () {
        return [
            {
                "value": 20,
                "display_name": "Number"
            }, {
                "value": 10,
                "display_name": "String"
            }, {
                "value": 40,
                "display_name": "Date"
            }, {
                "value": 30,
                "display_name": "Classifier"
            }
        ]
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return ['daily_pricing_model', 'payment_size_detail', 'accrued_currency', 'pricing_currency'];
    };

    var getEntityTabs = function (entityType) {
        switch (entityType) {
            case 'currency':
                return [
                    {
                        label: 'Pricing',
                        templateUrl: 'views/tabs/currency/pricing-view.html'
                    }
                ];
            case 'instrument':
                return [
                    {
                        label: 'Accruals',
                        templateUrl: 'views/tabs/instrument/accrual-calculation-schedules-view.html'
                    },
                    {
                        label: 'Events',
                        templateUrl: 'views/tabs/instrument/events-view.html'
                    },
                    {
                        label: 'Pricing',
                        templateUrl: 'views/tabs/instrument/manual-pricing-formulas-view.html'
                    },
                    {
                        label: 'Factors',
                        templateUrl: 'views/tabs/instrument/factor-schedule-view.html'
                    }
                ];
            case 'complex-transaction':
                return [
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/complex-transaction/book-transaction-actions-tab-view.html'
                    },
                    {
                        enabled: ['update'],
                        label: 'Transactions',
                        templateUrl: 'views/tabs/complex-transaction/book-transaction-transactions-tab-view.html'
                    }
                ];
            case 'transaction-type':
                return [
                    {
                        label: 'General',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-general-tab-view.html'
                    },
                    {
                        label: 'Inputs',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-inputs-tab-view.html'
                    },
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-actions-tab-view.html'
                    }
                ];
        }
    };

    var getEntitiesWithSimpleFields = function () {
        // e.g. both of responsible-group, counterparty group
        // have save property group, so its hard to resolve proper service
        return ["responsible", 'counterparty',
            'strategy-1', 'strategy-2', 'strategy-3',
            'transaction-type', 'transaction-type-group',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup']
    };

    var getFieldsWithTagGrouping = function () {
        return ['instrument_type', 'type', 'transaction_type', 'instrument_types', 'transaction_types', 'account_types'];
    };

    var getContentGroups = function (typeOfGrouping) {

        var path = "";

        switch (typeOfGrouping) {
            case "entityLayoutsGroups":
                path = "portal/content/json/groups/bookmarks_groups_list.json";
                break;
            case "exportImportConfigGroups":
                path = "portal/content/json/groups/configuration_export_import_files_groups_list.json";
                break;
        }

        return window.fetch(path).then(function (data) {
            return data.json();
        });

    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
        getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
        getEntityTabs: getEntityTabs,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
        getFieldsWithTagGrouping: getFieldsWithTagGrouping,
        getContentGroups: getContentGroups
    }


}());