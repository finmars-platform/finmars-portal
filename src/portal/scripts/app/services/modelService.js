import * as portfolioPropsModel from "../models/portfolioPropsModel";
import * as portfolioTypePropsModel from "../models/portfolioTypePropsModel";
import * as portfolioReconcileGroupPropsModel from "../models/portfolioReconcileGroupPropsModel";
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
import * as complexTransactionPropsModel from "../models/complexTransactionPropsModel";
import * as instrumentSchemePropsModel from "../models/instrumentSchemePropsModel";
import * as balanceReportPropsModel from "../models/balanceReportPropsModel";
import * as reportAddonPerformancePropsModel from "../models/reportAddonPerformancePropsModel";
import * as reportMismatchPropsModel from "../models/reportMismatchPropsModel";
import * as pnlReportPropsModel from "../models/pnlReportPropsModel";
import * as reportAddonPerformancePnlPropsModel from "../models/reportAddonPerformancePnlPropsModel";
import * as reportMismatchPnlPropsModel from "../models/reportMismatchPnlPropsModel";
import * as transactionReportPropsModel from "../models/transactionReportPropsModel";
import * as cashFlowProjectionReportPropsModel from "../models/cashFlowProjectionReportPropsModel";
import * as performanceReportPropsModel from "../models/performanceReportPropsModel";
import * as countryPropsModel from "../models/countryPropsModel";
import * as transactionClassPropsModel from "../models/transactionClassPropsModel";
"use strict";


var getAttributesByEntityType = function (entityType) {

    var models = {
        "portfolio": portfolioPropsModel.getAttributes(),
        "portfolio-type": portfolioTypePropsModel.getAttributes(),
        "portfolio-reconcile-group": portfolioReconcileGroupPropsModel.getAttributes(),
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
        "complex-transaction": complexTransactionPropsModel.getAttributes(),
        "instrument-scheme": instrumentSchemePropsModel.getAttributes(),
        "balance-report": balanceReportPropsModel.getAttributes(),
        'balance-report-performance': reportAddonPerformancePropsModel.getAttributes(),
        'balance-report-mismatch': reportMismatchPropsModel.getAttributes(),
        "pl-report": pnlReportPropsModel.getAttributes(),
        'pl-report-performance': reportAddonPerformancePnlPropsModel.getAttributes(),
        'pl-report-mismatch': reportMismatchPnlPropsModel.getAttributes(),
        "transaction-report": transactionReportPropsModel.getAttributes(),
        "cash-flow-projection-report": cashFlowProjectionReportPropsModel.getAttributes(),
        "performance-report": performanceReportPropsModel.getAttributes(),
    };

    return models[entityType];
};

var getAttributesByContentType = function (contentType) {

    var models = {
        "portfolios.portfolio": portfolioPropsModel.getAttributes(),
        "audit.transactionaudit": auditTransactionPropsModel.getAttributes(),
        "audit.instrumentaudit": auditInstrumentPropsModel.getAttributes(),
        "accounts.account": accountPropsModel.getAttributes(),
        "accounts.accounttype": accountTypePropsModel.getAttributes(),
        "counterparties.counterparty": counterpartyPropsModel.getAttributes(),
        "counterparties.counterpartygroup": counterpartyGroupPropsModel.getAttributes(),
        "counterparties.responsible": responsiblePropsModel.getAttributes(),
        "counterparties.responsiblegroup": responsibleGroupPropsModel.getAttributes(),
        "instruments.pricingpolicy": pricingPolicyPropsModel.getAttributes(),
        "instruments.instrumenttype": instrumentTypePropsModel.getAttributes(),
        "instruments.instrument": instrumentPropsModel.getAttributes(),
        "instruments.generatedevent": generatedEventPropsModel.getAttributes(),
        "instruments.country": countryPropsModel.getAttributes(),
        "transactions.transaction": transactionPropsModel.getAttributes(),
        "transactions.transactionclass": transactionClassPropsModel.getAttributes(),
        "transactions.transactiontypegroup": transactionTypeGroupPropsModel.getAttributes(),
        "transactions.transactiontype": transactionTypePropsModel.getAttributes(),
        "transactions.complextransaction": complexTransactionPropsModel.getAttributes(),
        "currencies.currency": currencyPropsModel.getAttributes(),
        "currencies.currencyhistory": currencyHistoryPropsModel.getAttributes(),
        "instruments.pricehistory": priceHistoryPropsModel.getAttributes(),
        "strategies.strategy1": strategy1PropsModel.getAttributes(),
        "strategies.strategy2": strategy2PropsModel.getAttributes(),
        "strategies.strategy3": strategy3PropsModel.getAttributes(),
        "strategies.strategy1subgroup": strategy1subgroupPropsModel.getAttributes(),
        "strategies.strategy2subgroup": strategy2subgroupPropsModel.getAttributes(),
        "strategies.strategy3subgroup": strategy3subgroupPropsModel.getAttributes(),
        "strategies.strategy1group": strategy1groupPropsModel.getAttributes(),
        "strategies.strategy2group": strategy2groupPropsModel.getAttributes(),
        "strategies.strategy3group": strategy3groupPropsModel.getAttributes(),
        "reports.balancereport": balanceReportPropsModel.getAttributes(),
        "reports.balancereportperformance": reportAddonPerformancePropsModel.getAttributes(),
        "reports.balancereportmismatch":  reportMismatchPropsModel.getAttributes(),
        "reports.plreport": pnlReportPropsModel.getAttributes(),
        'reports.plreportperformance': reportAddonPerformancePnlPropsModel.getAttributes(),
        'reports.plreportmismatch': reportMismatchPnlPropsModel.getAttributes(),
        "reports.transactionreport": transactionReportPropsModel.getAttributes(),
        "reports.cashflowreport": cashFlowProjectionReportPropsModel.getAttributes(),
        "reports.performancereport": performanceReportPropsModel.getAttributes()

    };

    if (models[contentType]) {
        return models[contentType]
    }

    return [];
};

var getModelsWithAttributes = function () {

    var models = {
        "portfolios.portfolio": portfolioPropsModel.getAttributes(),
        "audit.transactionaudit": auditTransactionPropsModel.getAttributes(),
        "audit.instrumentaudit": auditInstrumentPropsModel.getAttributes(),
        "accounts.account": accountPropsModel.getAttributes(),
        "accounts.accounttype": accountTypePropsModel.getAttributes(),
        "counterparties.counterparty": counterpartyPropsModel.getAttributes(),
        "counterparties.counterpartygroup": counterpartyGroupPropsModel.getAttributes(),
        "counterparties.responsible": responsiblePropsModel.getAttributes(),
        "counterparties.responsiblegroup": responsibleGroupPropsModel.getAttributes(),
        "instruments.pricingpolicy": pricingPolicyPropsModel.getAttributes(),
        "instruments.instrumenttype": instrumentTypePropsModel.getAttributes(),
        "instruments.instrument": instrumentPropsModel.getAttributes(),
        "instruments.generatedevent": generatedEventPropsModel.getAttributes(),
        "instruments.country": countryPropsModel.getAttributes(),
        "transactions.transaction": transactionPropsModel.getAttributes(),
        "transactions.transactionclass": transactionClassPropsModel.getAttributes(),
        "transactions.transactiontypegroup": transactionTypeGroupPropsModel.getAttributes(),
        "transactions.transactiontype": transactionTypePropsModel.getAttributes(),
        "transactions.complextransaction": complexTransactionPropsModel.getAttributes(),
        "currencies.currency": currencyPropsModel.getAttributes(),
        "currencies.currencyhistory": currencyHistoryPropsModel.getAttributes(),
        "instruments.pricehistory": priceHistoryPropsModel.getAttributes(),
        "strategies.strategy1": strategy1PropsModel.getAttributes(),
        "strategies.strategy2": strategy2PropsModel.getAttributes(),
        "strategies.strategy3": strategy3PropsModel.getAttributes(),
        "strategies.strategy1subgroup": strategy1subgroupPropsModel.getAttributes(),
        "strategies.strategy2subgroup": strategy2subgroupPropsModel.getAttributes(),
        "strategies.strategy3subgroup": strategy3subgroupPropsModel.getAttributes(),
        "strategies.strategy1group": strategy1groupPropsModel.getAttributes(),
        "strategies.strategy2group": strategy2groupPropsModel.getAttributes(),
        "strategies.strategy3group": strategy3groupPropsModel.getAttributes(),
        "reports.balancereport": balanceReportPropsModel.getAttributes(),
        "reports.balancereportperformance": reportAddonPerformancePropsModel.getAttributes(),
        "reports.balancereportmismatch":  reportMismatchPropsModel.getAttributes(),
        "reports.plreport": pnlReportPropsModel.getAttributes(),
        'reports.plreportperformance': reportAddonPerformancePnlPropsModel.getAttributes(),
        'reports.plreportmismatch': reportMismatchPnlPropsModel.getAttributes(),
        "reports.transactionreport": transactionReportPropsModel.getAttributes(),
        "reports.cashflowreport": cashFlowProjectionReportPropsModel.getAttributes(),
        "reports.performancereport": performanceReportPropsModel.getAttributes()

    };
    return models
};

export default {
    getAttributesByEntityType: getAttributesByEntityType,
    getModelsWithAttributes:getModelsWithAttributes,
    getAttributesByContentType: getAttributesByContentType
};