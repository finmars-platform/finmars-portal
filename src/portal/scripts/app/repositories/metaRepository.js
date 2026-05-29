import * as portfolioPropsModel from "../models/portfolioPropsModel";
import * as portfolioTypePropsModel from "../models/portfolioTypePropsModel";
import * as portfolioReconcileGroupPropsModel from "../models/portfolioReconcileGroupPropsModel";
import * as portfolioRegisterPropsModel from "../models/portfolioRegisterPropsModel";
import * as portfolioRegisterRecordPropsModel from "../models/portfolioRegisterRecordPropsModel";
import * as portfolioHistoryPropsModel from "../models/portfolioHistoryPropsModel";
import * as portfolioReconcileHistoryPropsModel from "../models/portfolioReconcileHistoryPropsModel";
import * as auditTransactionPropsModel from "../models/auditTransactionPropsModel";
import * as auditInstrumentPropsModel from "../models/auditInstrumentPropsModel";
import * as accountPropsModel from "../models/accountPropsModel";
import * as tagPropsModel from "../models/tagPropsModel";
import * as accountTypePropsModel from "../models/accountTypePropsModel";
import * as counterpartyPropsModel from "../models/counterpartyPropsModel";
import * as counterpartyGroupPropsModel from "../models/counterpartyGroupPropsModel";
import * as responsiblePropsModel from "../models/responsiblePropsModel";
import * as responsibleGroupPropsModel from "../models/responsibleGroupPropsModel";
import * as pricingPolicyPropsModel from "../models/pricingPolicyPropsModel";
import * as instrumentTypePropsModel from "../models/instrumentTypePropsModel";
import * as instrumentPropsModel from "../models/instrumentPropsModel";
import * as generatedEventPropsModel from "../models/generatedEventPropsModel";
import * as transactionPropsModel from "../models/transactionPropsModel";
import * as transactionTypeGroupPropsModel from "../models/transactionTypeGroupPropsModel";
import * as transactionTypePropsModel from "../models/transactionTypePropsModel";
import * as currencyPropsModel from "../models/currencyPropsModel";
import * as currencyHistoryPropsModel from "../models/currencyHistoryPropsModel";
import * as priceHistoryPropsModel from "../models/priceHistoryPropsModel";
import * as strategy1PropsModel from "../models/strategy1PropsModel";
import * as strategy2PropsModel from "../models/strategy2PropsModel";
import * as strategy3PropsModel from "../models/strategy3PropsModel";
import * as strategy1subgroupPropsModel from "../models/strategy1subgroupPropsModel";
import * as strategy2subgroupPropsModel from "../models/strategy2subgroupPropsModel";
import * as strategy3subgroupPropsModel from "../models/strategy3subgroupPropsModel";
import * as strategy1groupPropsModel from "../models/strategy1groupPropsModel";
import * as strategy2groupPropsModel from "../models/strategy2groupPropsModel";
import * as strategy3groupPropsModel from "../models/strategy3groupPropsModel";
import * as balanceReportPropsModel from "../models/balanceReportPropsModel";
import * as reportAddonPerformancePropsModel from "../models/reportAddonPerformancePropsModel";
import * as reportAddonPerformancePnlPropsModel from "../models/reportAddonPerformancePnlPropsModel";
import * as reportMismatchPropsModel from "../models/reportMismatchPropsModel";
import * as pnlReportPropsModel from "../models/pnlReportPropsModel";
import * as transactionReportPropsModel from "../models/transactionReportPropsModel";
import * as cashFlowProjectionReportPropsModel from "../models/cashFlowProjectionReportPropsModel";
import * as performanceReportPropsModel from "../models/performanceReportPropsModel";
import * as complexTransactionPropsModel from "../models/complexTransactionPropsModel";
import * as instrumentSchemePropsModel from "../models/instrumentSchemePropsModel";
import evRequiredAttrs from '../../../../../vocabulary/requiredEntityViewerAttrs';

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
        'audit-transaction', 'audit-instrument', 'generated-event'];
};

var getEntityAttrs = function (entity) {
    var entityAttrs = {
        "portfolio": portfolioPropsModel.getAttributes(),
        "portfolio-type": portfolioTypePropsModel.getAttributes(),
        "portfolio-reconcile-group": portfolioReconcileGroupPropsModel.getAttributes(),
        "portfolio-register": portfolioRegisterPropsModel.getAttributes(),
        "portfolio-register-record": portfolioRegisterRecordPropsModel.getAttributes(),
        "portfolio-history": portfolioHistoryPropsModel.getAttributes(),
        "portfolio-reconcile-history": portfolioReconcileHistoryPropsModel.getAttributes(),
        "audit-transaction": auditTransactionPropsModel.getAttributes(),
        "audit-instrument": auditInstrumentPropsModel.getAttributes(),
        "account": accountPropsModel.getAttributes(),
        "tag": tagPropsModel.getAttributes(),
        "account-type": accountTypePropsModel.getAttributes(),
        "counterparty": counterpartyPropsModel.getAttributes(),
        "counterparty-group": counterpartyGroupPropsModel.getAttributes(),
        "responsible": responsiblePropsModel.getAttributes(),
        "responsible-group": responsibleGroupPropsModel.getAttributes(),
        "pricing-policy": pricingPolicyPropsModel.getAttributes(),
        "instrument-type": instrumentTypePropsModel.getAttributes(),
        "instrument": instrumentPropsModel.getAttributes(),
        "generated-event": generatedEventPropsModel.getAttributes(),
        "transaction": transactionPropsModel.getAttributes(),
        "transaction-type-group": transactionTypeGroupPropsModel.getAttributes(),
        "transaction-type": transactionTypePropsModel.getAttributes(),
        "currency": currencyPropsModel.getAttributes(),
        "currency-history": currencyHistoryPropsModel.getAttributes(),
        "price-history": priceHistoryPropsModel.getAttributes(),
        "strategy-1": strategy1PropsModel.getAttributes(),
        "strategy-2": strategy2PropsModel.getAttributes(),
        "strategy-3": strategy3PropsModel.getAttributes(),
        "strategy-1-subgroup": strategy1subgroupPropsModel.getAttributes(),
        "strategy-2-subgroup": strategy2subgroupPropsModel.getAttributes(),
        "strategy-3-subgroup": strategy3subgroupPropsModel.getAttributes(),
        "strategy-1-group": strategy1groupPropsModel.getAttributes(),
        "strategy-2-group": strategy2groupPropsModel.getAttributes(),
        "strategy-3-group": strategy3groupPropsModel.getAttributes(),
        "balance-report": balanceReportPropsModel.getAttributes(),
        'report-addon-performance': reportAddonPerformancePropsModel.getAttributes(),
        'report-addon-performance-pnl': reportAddonPerformancePnlPropsModel.getAttributes(),
        'report-mismatch': reportMismatchPropsModel.getAttributes(),
        "pl-report": pnlReportPropsModel.getAttributes(),
        "transaction-report": transactionReportPropsModel.getAttributes(),
        "cash-flow-projection-report": cashFlowProjectionReportPropsModel.getAttributes(),
        "performance-report": performanceReportPropsModel.getAttributes(),
        "complex-transaction": complexTransactionPropsModel.getAttributes(),
        "instrument-scheme": instrumentSchemePropsModel.getAttributes()
    };

    return entityAttrs[entity];
};

var getRequiredEntityAttrs = function (entityType) {

    switch (entityType) {
        case 'portfolio':
        case 'account':
        case 'currency':
        case 'account-type':
        case 'pricing-policy':
            return evRequiredAttrs.requiredAttrs;

        case 'counterparty':
        case 'responsible':
            return evRequiredAttrs.requiredAttrs2;

        case 'strategy-1':
        case 'strategy-2':
        case 'strategy-3':
            return evRequiredAttrs.strategiesAttrs;

        case 'instrument':
            return evRequiredAttrs.instrumentAttrs;

        case 'instrument-type':
            return evRequiredAttrs.instrumentTypeAttrs;

        case 'price-history':
            return evRequiredAttrs.pricesAttrs;

        case 'currency-history':
            return evRequiredAttrs.currenciesAttrs;

        default:
            return [];
    }


};

var getEntityViewerFormComponentsValueTypes = function () {
    return [
        {
            "value": 20,
            "display_name": "Number"
        },
        {
            "value": 10,
            "display_name": "String"
        },
        {
            "value": 40,
            "display_name": "Date"
        },
        {
            "value": 30,
            "display_name": "Classifier"
        },
        {
            "value": 110,
            "display_name": "Selector"
        },
        {
            "value": 80,
            "display_name": "Datetime"
        },
        {
            "value": 120,
            "display_name": "Button"
        },
        {
            "value": 130,
            "display_name": "JSON"
        },
        {
            "value": "decoration",
            "display_name": "Decoration"
        },
        {
            "value": "field",
            "display_name": "Field"
        },
        {
            "value": "mc_field",
            "display_name": "Multiple choice field"
        },
        {
            "value": 50,
            "display_name": "Boolean"
        },
        {
            "value": "float",
            "display_name": "Float"
        },
        {
            "value": "table",
            "display_name": "Table"
        },
        {
            "value": "attachment",
            "display_name": "Attachment"
        },
        {
            "value": "json",
            "display_name": "JSON"
        },
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
        case 'portfolio':
            return [
                {
                    key: 'performance',
                    label: 'Performance',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/portfolio/performance-tab-view.html',
                }
            ];
        case 'currency':
            return [
                {
                    key: 'pricing',
                    label: 'Pricing',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/currency/pricing-view.html'
                }
                // {
                //     label: 'Pricing (Old)',
                //     templateUrl: 'views/tabs/currency/pricing-view-old.html'
                // }
            ];
        case 'instrument':
            return [
                {
                    key: 'accruals',
                    label: 'Accruals',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument/accrual-calculation-schedules-view.html',
                },
                {
                    key: 'events',
                    label: 'Events',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument/events-schedules-tab-view.html',
                },
                {
                    key: 'exposure',
                    label: 'Exposure',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument/exposure-view.html',
                },
                // {
                //     label: 'Pricing (old)',
                //     templateUrl: 'views/tabs/instrument/manual-pricing-formulas-view.html'
                // },
                {
                    key: 'factors',
                    label: 'Factors',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument/factor-schedule-view.html',
                },
                {
                    key: 'pricing',
                    label: 'Pricing',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument/pricing-view.html',
                }
            ];
        case 'instrument-type':
            return [
                {
                    key: 'pricing',
                    label: 'Pricing',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/pricing-view.html'
                },
                {
                    key: 'accruals',
                    label: 'Accruals',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/accruals-view.html'
                },
                {
                    key: 'events',
                    label: 'Events',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/events-view.html'
                },
                {
                    key: 'factors',
                    label: 'Factors',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/factors-view.html'
                },
                {
                    key: 'exposure',
                    label: 'Exposure',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/exposure-view.html'
                },
                {
                    label: 'User attributes',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/user-attributes-view.html'
                },
                {
                    label: 'Layout Settings',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/instrument-type/layout-settings-view.html'
                }
            ];
        case 'transaction-type':
            return [
                {
                    label: 'General',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/transaction-type/transaction-type-general-tab-view.html'
                },
                {
                    key: 'inputs',
                    label: 'Inputs',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/transaction-type/transaction-type-inputs-tab-view.html'
                },
                {
                    key: 'actions',
                    label: 'Actions',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/transaction-type/transaction-type-actions-tab-view.html'
                },
                {
                    key: 'fields',
                    label: 'Fields',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/transaction-type/transaction-type-fields-tab-view.html'
                }
            ];
        case 'complex-transaction':
            return [
                {
                    label: 'Fields',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-fields-tab.html'
                },
                {
                    label: 'Inputs',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-inputs-tab.html'
                },
                {
                    label: 'Base Transactions',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-base-transactions-tab.html'
                },
                {
                    label: 'Reconciliation',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-reconciliation-tab.html'
                },
                {
                    label: 'Execution Log',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-execution-log-tab.html'
                },
                {
                    label: 'Source',
                    type: 'system_tab',
                    templateUrl: 'views/tabs/complex-transaction/complex-transaction-source-tab.html'
                }
            ];
        default:
            return [];
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

export default {
    getMenu: getMenu,
    getBaseAttrs: getBaseAttrs,
    getEntityAttrs: getEntityAttrs,
    getRequiredEntityAttrs: getRequiredEntityAttrs,
    getEntityViewerFormComponentsValueTypes: getEntityViewerFormComponentsValueTypes,
    getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
    getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
    getEntityTabs: getEntityTabs,
    getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
    getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
    getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
    getFieldsWithTagGrouping: getFieldsWithTagGrouping,
    getContentGroups: getContentGroups
};